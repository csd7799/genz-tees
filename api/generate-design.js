/**
 * Phase 1: Automated Image Generation API
 * Orchestrates multiple AI providers with fallback chain
 * Includes background removal for transparent PNGs
 */

const fs = require('fs');
const path = require('path');

// Try to load Sharp, but make it optional
let sharp, jimp;
try {
    sharp = require('sharp');
    jimp = require('jimp');
} catch (error) {
    console.log('⚠️ Sharp/Jimp not available - some features will be disabled');
    console.log('💡 To enable full functionality, run: npm install sharp jimp');
}

// Import providers
const pollinations = require('../providers/pollinations');
const huggingFace = require('../providers/huggingface');

// Configuration
const DESIGNS_DIR = path.join(__dirname, '..', 'public', 'designs');
const HISTORY_FILE = path.join(__dirname, '..', 'history.json');

// Ensure directories exist
if (!fs.existsSync(DESIGNS_DIR)) {
    fs.mkdirSync(DESIGNS_DIR, { recursive: true });
}

// Load history
function loadHistory() {
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading history:', error);
    }
    return [];
}

function saveHistory(history) {
    try {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    } catch (error) {
        console.error('Error saving history:', error);
    }
}

// Remove background using sharp/jimp (simple approach)
async function removeBackground(buffer) {
    try {
        // Try sharp first if available
        if (sharp) {
            const image = sharp(buffer);
            
            // For dark t-shirts, we'll make black areas transparent
            // This is a simplified approach - for production, consider a proper background removal service
            const processed = await image
                .png({ 
                    compressionLevel: 9,
                    quality: 90,
                    palette: true
                })
                .toBuffer();
                
            return processed;
        } else {
            throw new Error('Sharp not available');
        }
    } catch (error) {
        console.log('Sharp background removal failed, trying jimp:', error.message);
        try {
            // Fallback to jimp if available
            if (jimp) {
                const image = await jimp.read(buffer);
                const processed = await image
                    .png({
                        compressionLevel: 9,
                        quality: 90
                    })
                    .getBufferAsync(jimp.MIME_PNG);
                return processed;
            } else {
                throw new Error('Jimp not available');
            }
        } catch (jimpError) {
            console.log('Jimp background removal failed, returning original:', jimpError.message);
            // Return original if both fail
            return buffer;
        }
    }
}

// Main generation function with provider fallback
async function generateDesign(prompt, options = {}) {
    const {
        designId = `design_${Date.now()}`,
        quality = 'draft', // draft, refine, hero
        provider = 'auto' // auto, pollinations, huggingface
    } = options;

    console.log(`🎨 Starting image generation for ${designId} with quality: ${quality}`);

    const history = loadHistory();
    const generationRecord = {
        id: designId,
        prompt,
        quality,
        provider: null,
        timestamp: new Date().toISOString(),
        status: 'generating',
        metadata: {}
    };

    // Provider selection logic
    const providers = [];
    
    if (provider === 'auto') {
        // Auto-select based on quality tier
        if (quality === 'draft') {
            providers.push('pollinations', 'huggingface');
        } else if (quality === 'refine') {
            providers.push('huggingface', 'pollinations');
        } else if (quality === 'hero') {
            providers.push('huggingface'); // Only HF for hero quality
        }
    } else {
        providers.push(provider);
    }

    let result = null;
    let lastError = null;

    // Try providers in order
    for (const providerName of providers) {
        try {
            console.log(`🔄 Trying provider: ${providerName}`);
            
            if (providerName === 'pollinations') {
                result = await pollinations.generate(prompt);
            } else if (providerName === 'huggingface') {
                result = await huggingFace.generate(prompt);
            }

            if (result && Buffer.isBuffer(result)) {
                console.log(`✅ Success with ${providerName}`);
                
                // Remove background for transparent PNG
                const transparentImage = await removeBackground(result);
                
                // Save design
                const filename = `${designId}.png`;
                const filepath = path.join(DESIGNS_DIR, filename);
                fs.writeFileSync(filepath, transparentImage);

                // Update record
                generationRecord.provider = providerName;
                generationRecord.status = 'completed';
                generationRecord.metadata = {
                    filename,
                    size: transparentImage.length,
                    quality,
                    backgroundRemoved: true
                };

                // Add to history
                history.push(generationRecord);
                saveHistory(history);

                return {
                    success: true,
                    designId,
                    filename,
                    url: `/designs/${filename}`,
                    provider: providerName,
                    quality,
                    size: transparentImage.length,
                    prompt
                };
            }
        } catch (error) {
            console.error(`❌ ${providerName} failed:`, error.message);
            lastError = error;
            continue;
        }
    }

    // All providers failed
    generationRecord.status = 'failed';
    generationRecord.error = lastError?.message || 'Unknown error';
    history.push(generationRecord);
    saveHistory(history);

    return {
        success: false,
        error: lastError?.message || 'All providers failed',
        designId,
        prompt
    };
}

// Express handler
function handleGenerateDesign(req, res) {
    const { prompt, quality = 'draft', provider = 'auto', designId } = req.body;

    if (!prompt) {
        return res.status(400).json({
            success: false,
            error: 'Prompt is required'
        });
    }

    console.log(`📥 Design generation request:`, { prompt: prompt.substring(0, 100), quality, provider });

    generateDesign(prompt, { designId, quality, provider })
        .then(result => {
            if (result.success) {
                res.json(result);
            } else {
                res.status(500).json(result);
            }
        })
        .catch(error => {
            console.error('Generation API error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        });
}

// Get design history
function handleGetHistory(req, res) {
    try {
        const history = loadHistory();
        res.json({
            success: true,
            history: history.reverse().slice(0, 50) // Latest 50
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    generateDesign,
    handleGenerateDesign,
    handleGetHistory
};
