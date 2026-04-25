/**
 * Hugging Face Inference API Provider
 * Free tier: ~300 requests/day
 * Model: FLUX.1-schnell (fast, high quality)
 */

const https = require('https');

// You can get a free API key from https://huggingface.co/settings/tokens
const HF_API_KEY = process.env.HF_API_KEY || 'YOUR_HF_API_KEY';

async function generate(prompt) {
    return new Promise((resolve, reject) => {
        if (HF_API_KEY === 'YOUR_HF_API_KEY') {
            reject(new Error('HuggingFace API key not configured. Set HF_API_KEY in environment or providers/huggingface.js'));
            return;
        }

        const data = JSON.stringify({
            inputs: prompt,
            parameters: {
                width: 1024,
                height: 1024,
                num_inference_steps: 4
            }
        });

        const options = {
            hostname: 'api-inference.huggingface.co',
            path: '/models/black-forest-labs/FLUX.1-schnell',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        console.log('🎨 HuggingFace: Generating image with FLUX.1-schnell...');

        const req = https.request(options, (response) => {
            if (response.statusCode !== 200) {
                let errorData = '';
                response.on('data', (chunk) => errorData += chunk);
                response.on('end', () => {
                    reject(new Error(`HuggingFace API error: ${response.statusCode} - ${errorData}`));
                });
                return;
            }

            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => {
                const buffer = Buffer.concat(chunks);
                console.log('✅ HuggingFace: Image generated successfully');
                resolve(buffer);
            });
        });

        req.on('error', (err) => {
            console.error('❌ HuggingFace error:', err.message);
            reject(err);
        });

        req.write(data);
        req.end();
    });
}

module.exports = { generate };
