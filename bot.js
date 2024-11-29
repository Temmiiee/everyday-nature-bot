require('dotenv').config();
const axios = require('axios');
const { BskyAgent } = require('@atproto/api');

const agent = new BskyAgent({ service: 'https://bsky.social' });

const UNSPLASH_URL = 'https://api.unsplash.com/photos/random';

async function fetchNatureImage() {
    try {
        const response = await axios.get(UNSPLASH_URL, {
            params: { query: 'nature', orientation: 'landscape' },
            headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
        });

        const image = response.data;
        return {
            url: image.urls.full,
            description: image.alt_description || 'Beautiful nature image',
            photographer: image.user.name,
            photographerLink: image.user.links.html,
        };
    } catch (error) {
        console.error('Error fetching the image:', error.message);
        return null;
    }
}

async function postImage() {
    try {
        await agent.login({
            identifier: process.env.BSKY_IDENTIFIER,
            password: process.env.BSKY_PASSWORD,
        });

        const image = await fetchNatureImage();
        if (!image) return;

        const text = `🌿 ${image.description}\n\nPhoto by ${image.photographer} 🌍\n${image.photographerLink}`;

        await agent.post({
            text,
            embed: {
                $type: 'app.bsky.embed.images',
                image: {
                    uri: image.url,
                    alt: image.description,
                },
            },
        });

        console.log('Image posted successfully!');
    } catch (error) {
        console.error('Error posting to Bluesky:', error.message);
    }
}

postImage();
