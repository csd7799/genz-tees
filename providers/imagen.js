/**
 * Google Imagen 3 Provider (via Gemini API)
 * Uses existing Gemini API key
 * Limited free tier, best quality
 */

const https = require('https');

// Reuse the Gemini API key from server.js
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyArjtrXIQOCr1f_mA0PQL27kf8rsWD3teM';

async function generate(prompt) {
    return new Promise((resolve, reject) => {
        if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
            reject(new Error('Gemini API key not configured'));
            return;
        }

        const data = JSON.stringify({
            prompt: prompt,
            number_of_images: 1,
            aspect_ratio: '1:1',
            safety_filter_level: 'block_some',
            person_generation: 'allow_adult'
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        console.log('🎨 Imagen 3: Generating premium image...');

        const req = https.request(options, (response) => {
            let responseData = '';
            response.on('data', (chunk) => responseData += chunk);
            response.on('end', () => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Imagen API error: ${response.statusCode} - ${responseData}`));
                    return;
                }

                try {
                    const result = JSON.parse(responseData);
                    // Imagen returns base64 encoded image
                    if (result.predictions && result.predictions[0] && result.predictions[0].bytesBase64Encoded) {
                        const buffer = Buffer.from(result.predictions[0].bytesBase64Encoded, 'base64');
                        console.log('✅ Imagen 3: Premium image generated successfully');
                        resolve(buffer);
                    } else {
                        reject(new Error('Imagen API returned unexpected format'));
                    }
                } catch (err) {
                    reject(new Error(`Failed to parse Imagen response: ${err.message}`));
                }
            });
        });

        req.on('error', (err) => {
            console.error('❌ Imagen error:', err.message);
            reject(err);
        });

        req.write(data);
        req.end();
    });
}

module.exports = { generate };
