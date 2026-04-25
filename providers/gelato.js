/**
 * Gelato POD Provider
 * Local printing in India + international fulfillment
 * Pay-per-order, no upfront costs
 */

const https = require('https');
const querystring = require('querystring');

class GelatoProvider {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.gelato.com/v1';
    }

    async createProduct(productData) {
        return new Promise((resolve, reject) => {
            const {
                designId,
                title,
                description,
                designUrl,
                mockupUrls = [],
                price = 1299, // ₹1299 default
                variants = []
            } = productData;

            // Gelato product payload
            const payload = {
                productType: 't-shirt',
                title: title,
                description: description,
                designFileUrl: designUrl, // Transparent PNG from Phase 1
                images: mockupUrls, // Mockups from Phase 2
                variants: variants.length > 0 ? variants : [
                    {
                        size: 'S',
                        color: 'Black',
                        price: price
                    },
                    {
                        size: 'M',
                        color: 'Black',
                        price: price
                    },
                    {
                        size: 'L',
                        color: 'Black',
                        price: price
                    },
                    {
                        size: 'XL',
                        color: 'Black',
                        price: price
                    },
                    {
                        size: 'XXL',
                        color: 'Black',
                        price: price
                    }
                ],
                attributes: {
                    brand: 'VYOM VOID',
                    material: '100% Cotton',
                    fit: 'Oversized',
                    care: 'Machine wash cold'
                },
                metadata: {
                    designId: designId,
                    collection: 'vyom-void',
                    tags: ['streetwear', 'dark aesthetic', 'gen z', 'indian brand']
                }
            };

            const postData = JSON.stringify(payload);
            const auth = Buffer.from(`:${this.apiKey}`).toString('base64');

            const options = {
                hostname: 'api.gelato.com',
                port: 443,
                path: '/products',
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            console.log('🛍️ Gelato: Creating product...');

            const req = https.request(options, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk;
                });

                res.on('end', () => {
                    try {
                        const result = JSON.parse(responseData);
                        
                        if (res.statusCode === 201 || res.statusCode === 200) {
                            console.log('✅ Gelato: Product created successfully');
                            resolve({
                                success: true,
                                productId: result.id,
                                gelatoProductId: result.id,
                                url: result.url,
                                price: price,
                                variants: result.variants || payload.variants
                            });
                        } else {
                            console.error('❌ Gelato API error:', result);
                            reject(new Error(`Gelato API error: ${res.statusCode} - ${result.message || 'Unknown error'}`));
                        }
                    } catch (error) {
                        reject(new Error(`Failed to parse Gelato response: ${error.message}`));
                    }
                });
            });

            req.on('error', (err) => {
                console.error('❌ Gelato request error:', err.message);
                reject(err);
            });

            req.write(postData);
            req.end();
        });
    }

    async getProduct(productId) {
        return new Promise((resolve, reject) => {
            const auth = Buffer.from(`:${this.apiKey}`).toString('base64');

            const options = {
                hostname: 'api.gelato.com',
                port: 443,
                path: `/products/${productId}`,
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk;
                });

                res.on('end', () => {
                    try {
                        const result = JSON.parse(responseData);
                        
                        if (res.statusCode === 200) {
                            resolve({
                                success: true,
                                product: result
                            });
                        } else {
                            reject(new Error(`Gelato API error: ${res.statusCode}`));
                        }
                    } catch (error) {
                        reject(new Error(`Failed to parse Gelato response: ${error.message}`));
                    }
                });
            });

            req.on('error', (err) => {
                reject(err);
            });

            req.end();
        });
    }

    async createWebhook(orderData) {
        // Gelato will call this webhook when orders are placed
        // This forwards the order to Gelato for fulfillment
        return {
            success: true,
            webhookUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/api/gelato-webhook`,
            instructions: 'Configure this URL in your Gelato dashboard for automatic order fulfillment'
        };
    }
}

module.exports = GelatoProvider;
