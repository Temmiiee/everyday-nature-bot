**README: Everyday Nature Bot**

---

## Everyday Nature Bot

Everyday Nature Bot is a JavaScript-powered automation tool that fetches stunning nature photos from Unsplash and posts them to Bluesky social platform.

### Features

- **Nature Image Fetching:** Automatically retrieves a random, high-quality nature image from Unsplash using their API.
- **Dynamic Captions & Hashtags:** Generates engaging captions with random appreciative words and selects relevant hashtags based on the photo’s content.
- **Bluesky Integration:** uploads the image and posts it to Bluesky, tagging the photographer.
- **Error Handling:** manages API errors, image size limits, and authentication issues.

### Technologies Used

- **JavaScript** (Node.js)
- **Axios** for HTTP requests
- **dotenv** for environment variable management
- **@atproto/api** for interacting with Bluesky

### Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Temmiiee/everyday-nature-bot.git
   cd everyday-nature-bot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root and add:
   ```
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key
   BSKY_IDENTIFIER=your_bluesky_username_or_handle
   BSKY_PASSWORD=your_bluesky_password
   ```

4. **Run the Bot**
   ```bash
   node bot.js
   ```

### How It Works

- The bot logs into Bluesky using your credentials.
- It fetches a random landscape image tagged as “nature” from Unsplash.
- The image is uploaded to Bluesky, and a post is created with a creative caption and hashtags.
- The bot runs once per execution, but can be scheduled with a task runner or cron job for daily posts.

### Notes

- Make sure your Unsplash API key and Bluesky credentials are active and valid.
- The bot checks for image size limits before uploading to Bluesky.
- Customize the list of appreciative words or hashtags in `bot.js` for more personalized posts.
