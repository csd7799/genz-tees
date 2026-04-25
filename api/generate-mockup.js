/**
 * Phase 2: Mockup Engine
 * Creates photorealistic t-shirt mockups from design PNGs
 * Multiple variants: flat-lay, model-front, folded, lifestyle
 */

const fs = require('fs');
const path = require('path');

// Try to load sharp, fallback to null if not available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('⚠️ Sharp not available - mockup features will be limited');
  sharp = null;
}

// Configuration
const MOCKUPS_DIR = path.join(__dirname, '..', 'public', 'mockups');
const TEMPLATES_DIR = path.join(__dirname, '..', 'public', 'templates');
const HISTORY_FILE = path.join(__dirname, '..', 'history.json');

// Ensure directories exist
if (!fs.existsSync(MOCKUPS_DIR)) {
    fs.mkdirSync(MOCKUPS_DIR, { recursive: true });
}
if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
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

// Mockup template configurations
const MOCKUP_TEMPLATES = [
    {
        id: 'flat-lay-black',
        name: 'Flat Lay Black',
        templateFile: 'flat-lay-black.png',
        region: { x: 200, y: 300, width: 600, height: 600 },
        blend: 'multiply'
    },
    {
        id: 'model-front-black',
        name: 'Model Front Black',
        templateFile: 'model-front-black.png',
        region: { x: 180, y: 280, width: 640, height: 640 },
        blend: 'multiply'
    },
    {
        id: 'folded-black',
        name: 'Folded Black',
        templateFile: 'folded-black.png',
        region: { x: 150, y: 200, width: 500, height: 500 },
        blend: 'multiply'
    },
    {
        id: 'lifestyle-black',
        name: 'Lifestyle Black',
        templateFile: 'lifestyle-black.png',
        region: { x: 220, y: 320, width: 560, height: 560 },
        blend: 'multiply'
    }
];

// Create mockup by compositing design onto template
async function createMockup(designPath, template) {
    try {
        if (!sharp) {
            console.log(`⚠️ Sharp not available - creating fallback mockup for ${template.name}`);
            // Return the original design as fallback
            return fs.readFileSync(designPath);
        }

        console.log(`🎨 Creating ${template.name} mockup...`);
        
        // Load template
        const templateBuffer = fs.readFileSync(path.join(TEMPLATES_DIR, template.templateFile));
        const templateImage = sharp(templateBuffer);
        const templateInfo = await templateImage.metadata();

        // Load design
        const designBuffer = fs.readFileSync(designPath);
        const designImage = sharp(designBuffer);
        const designInfo = await designImage.metadata();

        // Resize design to fit template region
        const resizedDesign = await designImage
            .resize(template.region.width, template.region.height, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toBuffer();

        // Create composite
        const mockupBuffer = await templateImage
            .composite([{
                input: resizedDesign,
                left: template.region.x,
                top: template.region.y,
                blend: template.blend
            }])
            .png({
                quality: 90,
                compressionLevel: 9
            })
            .toBuffer();

        console.log(`✅ ${template.name} mockup created`);
        return mockupBuffer;
    } catch (error) {
        console.error(`❌ Failed to create ${template.name} mockup:`, error);
        throw error;
    }
}

// Generate all mockup variants for a design
async function generateMockups(designId, designPath) {
    const results = [];
    const mockupDir = path.join(MOCKUPS_DIR, designId);

    // Create directory for this design's mockups
    if (!fs.existsSync(mockupDir)) {
        fs.mkdirSync(mockupDir, { recursive: true });
    }

    // Generate each mockup variant
    for (const template of MOCKUP_TEMPLATES) {
        try {
            const mockupBuffer = await createMockup(designPath, template);
            const filename = `${designId}-${template.id}.png`;
            const filepath = path.join(mockupDir, filename);
            
            fs.writeFileSync(filepath, mockupBuffer);
            
            results.push({
                id: `${designId}-${template.id}`,
                name: template.name,
                filename,
                url: `/mockups/${designId}/${filename}`,
                template: template.id,
                size: mockupBuffer.length
            });
        } catch (error) {
            console.error(`Failed to generate ${template.id}:`, error);
            results.push({
                id: `${designId}-${template.id}`,
                name: template.name,
                error: error.message
            });
        }
    }

    return results;
}

// Main mockup generation function
async function generateMockupsForDesign(designId) {
    try {
        console.log(`🚀 Starting mockup generation for ${designId}`);

        // Find design file
        const designsDir = path.join(__dirname, '..', 'public', 'designs');
        const designPath = path.join(designsDir, `${designId}.png`);

        if (!fs.existsSync(designPath)) {
            throw new Error(`Design file not found: ${designId}.png`);
        }

        // Generate all mockup variants
        const mockups = await generateMockups(designId, designPath);

        // Update history
        const history = loadHistory();
        const designRecord = history.find(item => item.id === designId);
        
        if (designRecord) {
            designRecord.mockups = mockups;
            designRecord.status = 'mockups_completed';
            designRecord.mockupTimestamp = new Date().toISOString();
            saveHistory(history);
        }

        return {
            success: true,
            designId,
            mockups,
            count: mockups.filter(m => !m.error).length,
            total: mockups.length
        };

    } catch (error) {
        console.error('Mockup generation failed:', error);
        return {
            success: false,
            error: error.message,
            designId
        };
    }
}

// Express handlers
function handleGenerateMockup(req, res) {
    const { designId } = req.body;

    if (!designId) {
        return res.status(400).json({
            success: false,
            error: 'Design ID is required'
        });
    }

    console.log(`📥 Mockup generation request: ${designId}`);

    generateMockupsForDesign(designId)
        .then(result => {
            if (result.success) {
                res.json(result);
            } else {
                res.status(500).json(result);
            }
        })
        .catch(error => {
            console.error('Mockup API error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        });
}

// Get mockup list for a design
function handleGetMockups(req, res) {
    const { designId } = req.params;

    try {
        const history = loadHistory();
        const designRecord = history.find(item => item.id === designId);

        if (!designRecord || !designRecord.mockups) {
            return res.status(404).json({
                success: false,
                error: 'Mockups not found for this design'
            });
        }

        res.json({
            success: true,
            designId,
            mockups: designRecord.mockups
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    generateMockupsForDesign,
    handleGenerateMockup,
    handleGetMockups
};
