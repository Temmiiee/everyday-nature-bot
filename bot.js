import 'dotenv/config';
import axios from 'axios';
import { AtpAgent } from '@atproto/api';

const agent = new AtpAgent({ service: 'https://bsky.social' });

const UNSPLASH_URL = 'https://api.unsplash.com/photos/random';
const IMAGE_ALT_TEXT = 'Beautiful nature image';

// Fetch a random nature image from Unsplash
async function fetchNatureImage() {
    try {
        const response = await axios.get(UNSPLASH_URL, {
            params: { query: 'nature', orientation: 'landscape' },
            headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
        });

        const image = response.data;
        return {
            url: image.urls.regular, // Use a smaller size URL
            description: image.alt_description || 'Beautiful nature image',
            photographer: image.user.name,
            photographerLink: image.user.links.html,
        };
    } catch (error) {
        console.error('Error fetching the image:', error.response?.data || error.message);
        return null;
    }
}

// Upload image to Bluesky
async function uploadImage(imageUrl) {
    try {
        // Download the image from the URL
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        const imgBytes = Buffer.from(response.data);

        if (imgBytes.length > 1000000) {
            throw new Error(`Image file size too large. Max: 1000000 bytes, Got: ${imgBytes.length}`);
        }

        // Upload to Bluesky
        const uploadResponse = await agent.com.atproto.repo.uploadBlob(imgBytes, {
            encoding: response.headers['content-type'],
        });

        return uploadResponse.data.blob;
    } catch (error) {
        console.error('Error uploading the image:', error.response?.data || error.message);
        return null;
    }
}

// Post an image with text to Bluesky
async function postImage() {
    try {
        // Login to Bluesky
        await agent.login({
            identifier: process.env.BSKY_IDENTIFIER,
            password: process.env.BSKY_PASSWORD,
        });

        // Fetch a nature image
        const image = await fetchNatureImage();
        if (!image) return;

        // Upload the image
        const blob = await uploadImage(image.url);
        if (!blob) return;

        // Prepare post content with hashtags
        const hashtags = '#nature #photography #landscape #naturephotography #photooftheday';
        const text = `🌿 ${image.description}\n\nPhoto by ${image.photographer} 🌍\n${image.photographerLink}\n\n${hashtags}`;

        // Create text facets for hashtags
        const facets = hashtags.split(' ').map(tag => ({
            index: {
                start: text.indexOf(tag),
                end: text.indexOf(tag) + tag.length,
                byteStart: Buffer.byteLength(text.slice(0, text.indexOf(tag))),
                byteEnd: Buffer.byteLength(text.slice(0, text.indexOf(tag) + tag.length)),
            },
            features: [{
                $type: 'app.bsky.richtext.facet#tag',
                tag: tag.slice(1), // Remove the '#' character
            }],
        }));

        // Post on Bluesky
        await agent.post({
            text,
            facets,
            embed: {
                $type: 'app.bsky.embed.images',
                images: [{
                    alt: IMAGE_ALT_TEXT,
                    image: blob,
                }],
            },
        });

        console.log('Image posted successfully!');
    } catch (error) {
        console.error('Error posting to Bluesky:', error.response?.data || error.message);
    }
}

// Execute the bot
postImage();