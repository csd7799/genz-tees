/**
 * Pollinations.ai Provider
 * Free, unlimited image generation using FLUX model
 * No API key required
 */

const https = require('https');
const http = require('http');

async function generate(prompt) {
    return new Promise((resolve, reject) => {
        // Pollinations API endpoint
        const encodedPrompt = encodeURIComponent(prompt);
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux&nologo=true`;

        console.log('🎨 Pollinations: Generating image...');

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Pollinations API returned status ${response.statusCode}`));
                return;
            }

            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => {
                const buffer = Buffer.concat(chunks);
                console.log('✅ Pollinations: Image generated successfully');
                resolve(buffer);
            });
        }).on('error', (err) => {
            console.error('❌ Pollinations error:', err.message);
            reject(err);
        });
    });
}

module.exports = { generate };
