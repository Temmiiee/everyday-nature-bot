require('dotenv').config();
const axios = require('axios');
const { BskyAgent } = require('@atproto/api');
const schedule = require('node-schedule');

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
      description: image.alt_description || 'Belle image de la nature',
      photographer: image.user.name,
      photographerLink: image.user.links.html,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l’image :', error.message);
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

    const text = `🌿 ${image.description}\n\nPhoto par ${image.photographer} 🌍\n${image.photographerLink}`;

    await agent.post({
      text,
      embed: {
        $type: 'app.bsky.embed.external',
        external: {
          uri: image.url,
          title: 'Belle image de la nature',
          description: image.description,
        },
      },
    });

    console.log('Image publiée avec succès !');
  } catch (error) {
    console.error('Erreur lors de la publication sur Bluesky :', error.message);
  }
}

schedule.scheduleJob('0 9 * * *', () => { // Tous les jours à 9h
  console.log('Lancement du bot "Everyday Nature"...');
  postImage();
});