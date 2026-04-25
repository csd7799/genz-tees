const fs = require('fs');
const path = require('path');

// Data storage paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const COLLECTIONS_FILE = path.join(DATA_DIR, 'collections.json');
const INVENTORY_FILE = path.join(DATA_DIR, 'inventory.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
function initializeDataFiles() {
    if (!fs.existsSync(PRODUCTS_FILE)) {
        // Import existing products from app.js
        const initialProducts = [
            { id: "prod_001", name: "VOID CIRCLE — BLACK", price: "₹1299", img: "mockup_front.png", badge: "LIMITED", filter: "brightness(0)", collection: "shunya", desc: "Pure minimalism. A single void circle on black. Embroidered chest logo. Drop-shoulder oversized fit.", status: "active", inventory: { S: 50, M: 75, L: 100, XL: 75, XXL: 50 }, createdAt: new Date().toISOString() },
            { id: "prod_002", name: "SHUNYA SANSKRIT — CHARCOAL", price: "₹1399", img: "print_hindi_gothic_1776522416869.png", badge: "NEW", filter: "brightness(0.2)", collection: "shunya", desc: "The Sanskrit character 'शून्य' in oversized distressed print. Premium heavy cotton.", status: "active", inventory: { S: 30, M: 45, L: 60, XL: 45, XXL: 30 }, createdAt: new Date().toISOString() },
            { id: "prod_003", name: "ORBITAL RINGS — BLACK", price: "₹1499", img: "mockup_side.png", badge: "", filter: "brightness(0)", collection: "shunya", desc: "Abstract orbit rings with VYOM VOID wordmark. Wraparound print. Heavy 280 GSM.", status: "active", inventory: { S: 25, M: 40, L: 50, XL: 40, XXL: 25 }, createdAt: new Date().toISOString() },
            { id: "prod_004", name: "STAR MAP — DEEP NAVY", price: "₹1599", img: "thermal_map_tee_1776520874913.png", badge: "HOT", filter: "sepia(0.5) hue-rotate(190deg)", collection: "nakshatra", desc: "Indian constellation mythology rendered in technical diagram style. Star map aesthetic.", status: "active", inventory: { S: 40, M: 60, L: 80, XL: 60, XXL: 40 }, createdAt: new Date().toISOString() },
            { id: "prod_005", name: "CONSTELLATION — BLACK", price: "₹1299", img: "mockup_front.png", badge: "", filter: "brightness(0)", collection: "nakshatra", desc: "Dark star maps reimagined. Minimalist constellation print on chest.", status: "active", inventory: { S: 35, M: 50, L: 70, XL: 50, XXL: 35 }, createdAt: new Date().toISOString() },
            { id: "prod_006", name: "GLITCH TIME — OFF BLACK", price: "₹1399", img: "gothic_acid_tee_1776520860162.png", badge: "TRENDING", filter: "hue-rotate(270deg) contrast(1.2)", collection: "kaal", desc: "Distorted time. Melting clocks, broken grids. Y2K-dark glitch aesthetic.", status: "active", inventory: { S: 45, M: 65, L: 85, XL: 65, XXL: 45 }, createdAt: new Date().toISOString() },
            { id: "prod_007", name: "DISTORTED GRID — GREY", price: "₹1199", img: "retro_futuristic_tee_1776520668860.png", badge: "", filter: "grayscale(1)", collection: "kaal", desc: "Broken grid lines and corrupted text. The concept: time is an illusion.", status: "active", inventory: { S: 20, M: 30, L: 40, XL: 30, XXL: 20 }, createdAt: new Date().toISOString() },
            { id: "prod_008", name: "COSMIC SUPERNOVA — BLACK", price: "₹1799", img: "print_neon_rickshaw_1776522381991.png", badge: "HEAVY", filter: "hue-rotate(320deg)", collection: "pralay", desc: "Bold graphic heavy. Supernova explosion art. Double-sided print.", status: "active", inventory: { S: 15, M: 25, L: 35, XL: 25, XXL: 15 }, createdAt: new Date().toISOString() },
            { id: "prod_009", name: "COLLAPSING STAR — CHARCOAL", price: "₹1599", img: "y2k_smiley_tee_1776520772048.png", badge: "", filter: "sepia(1) hue-rotate(300deg)", collection: "pralay", desc: "Inspired by Hindu cosmological cycles of creation and destruction.", status: "active", inventory: { S: 30, M: 45, L: 60, XL: 45, XXL: 30 }, createdAt: new Date().toISOString() },
            { id: "prod_010", name: "OPTICAL ILLUSION — BLACK", price: "₹1499", img: "gothic_acid_tee_1776520860162.png", badge: "NEW", filter: "hue-rotate(270deg) contrast(1.3)", collection: "maya", desc: "Mind-bending geometric patterns that play with perception. Hypnotic design that changes when viewed from different angles.", status: "active", inventory: { S: 25, M: 35, L: 45, XL: 35, XXL: 25 }, createdAt: new Date().toISOString() },
            { id: "prod_011", name: "QUANTUM DREAM — DEEP NAVY", price: "₹1599", img: "thermal_map_tee_1776520874913.png", badge: "TRENDING", filter: "sepia(0.3) hue-rotate(200deg)", collection: "maya", desc: "Quantum mechanics visualization. Subatomic particle patterns in dreamlike arrangement.", status: "active", inventory: { S: 20, M: 30, L: 40, XL: 30, XXL: 20 }, createdAt: new Date().toISOString() },
            { id: "prod_012", name: "MIRROR REALITY — GREY", price: "₹1399", img: "retro_futuristic_tee_1776520668860.png", badge: "", filter: "grayscale(0.8)", collection: "maya", desc: "Reflective patterns that mirror and distort. The concept of perceived vs actual reality.", status: "active", inventory: { S: 15, M: 25, L: 35, XL: 25, XXL: 15 }, createdAt: new Date().toISOString() },
            { id: "prod_013", name: "BIG BANG — BLACK", price: "₹1799", img: "print_neon_rickshaw_1776522381991.png", badge: "LIMITED", filter: "hue-rotate(340deg) brightness(0.8)", collection: "srishti", desc: "Explosive creation pattern. The moment everything began. Radiating energy from center point.", status: "active", inventory: { S: 10, M: 20, L: 30, XL: 20, XXL: 10 }, createdAt: new Date().toISOString() },
            { id: "prod_014", name: "STELLAR NURSERY — DEEP NAVY", price: "₹1699", img: "thermal_map_tee_1776520874913.png", badge: "NEW", filter: "sepia(0.2) hue-rotate(220deg)", collection: "srishti", desc: "Where stars are born. Nebula clouds and stellar formation patterns.", status: "active", inventory: { S: 25, M: 40, L: 55, XL: 40, XXL: 25 }, createdAt: new Date().toISOString() },
            { id: "prod_015", name: "CREATION SEED — CHARCOAL", price: "₹1499", img: "print_hindi_gothic_1776522416869.png", badge: "", filter: "brightness(0.3)", collection: "srishti", desc: "The seed of creation. Sacred geometry patterns representing the origin of all things.", status: "active", inventory: { S: 30, M: 45, L: 60, XL: 45, XXL: 30 }, createdAt: new Date().toISOString() },
            { id: "prod_016", name: "ENLIGHTENMENT CIRCLE — WHITE", price: "₹1599", img: "mockup_front.png", badge: "NEW", filter: "brightness(1.2) contrast(0.9)", collection: "nirvana", desc: "The circle of enlightenment. Perfect harmony and balance in minimalist form.", status: "active", inventory: { S: 35, M: 50, L: 70, XL: 50, XXL: 35 }, createdAt: new Date().toISOString() },
            { id: "prod_017", name: "MEDITATION WAVE — LIGHT GREY", price: "₹1399", img: "mockup_back.png", badge: "TRENDING", filter: "brightness(1.5) grayscale(0.3)", collection: "nirvana", desc: "Brainwave patterns during deep meditation. The flow of consciousness.", status: "active", inventory: { S: 40, M: 60, L: 80, XL: 60, XXL: 40 }, createdAt: new Date().toISOString() },
            { id: "prod_018", name: "TRANSCENDENCE — BLACK", price: "₹1799", img: "y2k_smiley_tee_1776520772048.png", badge: "LIMITED", filter: "sepia(0.8) hue-rotate(280deg)", collection: "nirvana", desc: "Breaking through the veil. Ascension patterns representing spiritual liberation.", status: "active", inventory: { S: 12, M: 18, L: 25, XL: 18, XXL: 12 }, createdAt: new Date().toISOString() }
        ];
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2));
    }

    if (!fs.existsSync(COLLECTIONS_FILE)) {
        const initialCollections = [
            { id: "col_001", name: "SHUNYA", color: "#7B2FBE", meaning: "The Void", status: "active", productCount: 3, createdAt: new Date().toISOString() },
            { id: "col_002", name: "NAKSHATRA", color: "#00D4FF", meaning: "Star / Constellation", status: "active", productCount: 2, createdAt: new Date().toISOString() },
            { id: "col_003", name: "KAAL", color: "#FF3864", meaning: "Time / Death", status: "active", productCount: 2, createdAt: new Date().toISOString() },
            { id: "col_004", name: "PRALAY", color: "#FF4500", meaning: "Apocalypse", status: "active", productCount: 2, createdAt: new Date().toISOString() },
            { id: "col_005", name: "AATMA", color: "#E8E8F0", meaning: "Soul", status: "active", productCount: 0, createdAt: new Date().toISOString() },
            { id: "col_006", name: "MAYA", color: "#9D4EDD", meaning: "Illusion", status: "active", productCount: 3, createdAt: new Date().toISOString() },
            { id: "col_007", name: "SRISHTI", color: "#FF006E", meaning: "Creation", status: "active", productCount: 3, createdAt: new Date().toISOString() },
            { id: "col_008", name: "NIRVANA", color: "#00F5FF", meaning: "Liberation", status: "active", productCount: 3, createdAt: new Date().toISOString() }
        ];
        fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(initialCollections, null, 2));
    }

    if (!fs.existsSync(INVENTORY_FILE)) {
        const initialInventory = {
            lastUpdated: new Date().toISOString(),
            totalProducts: 18,
            totalCollections: 8,
            lowStockThreshold: 20,
            outOfStock: [],
            lowStock: []
        };
        fs.writeFileSync(INVENTORY_FILE, JSON.stringify(initialInventory, null, 2));
    }
}

// Helper functions
function readDataFile(filename) {
    try {
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return null;
    }
}

function writeDataFile(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}

function generateId(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// API Routes
function setupInventoryAPI(app) {
    initializeDataFiles();

    // PRODUCTS API
    app.get('/api/inventory/products', (req, res) => {
        const products = readDataFile(PRODUCTS_FILE);
        if (!products) {
            return res.status(500).json({ success: false, error: 'Failed to read products data' });
        }
        res.json({ success: true, data: products });
    });

    app.get('/api/inventory/products/:id', (req, res) => {
        const products = readDataFile(PRODUCTS_FILE);
        if (!products) {
            return res.status(500).json({ success: false, error: 'Failed to read products data' });
        }
        
        const product = products.find(p => p.id === req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        
        res.json({ success: true, data: product });
    });

    app.post('/api/inventory/products', (req, res) => {
        const products = readDataFile(PRODUCTS_FILE);
        if (!products) {
            return res.status(500).json({ success: false, error: 'Failed to read products data' });
        }

        const newProduct = {
            id: generateId('prod'),
            ...req.body,
            status: req.body.status || 'active',
            inventory: req.body.inventory || { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        products.push(newProduct);
        
        if (writeDataFile(PRODUCTS_FILE, products)) {
            // Update collection product count
            updateCollectionProductCount(newProduct.collection);
            res.json({ success: true, data: newProduct });
        } else {
            res.status(500).json({ success: false, error: 'Failed to save product' });
        }
    });

    app.put('/api/inventory/products/:id', (req, res) => {
        const products = readDataFile(PRODUCTS_FILE);
        if (!products) {
            return res.status(500).json({ success: false, error: 'Failed to read products data' });
        }

        const index = products.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        const oldCollection = products[index].collection;
        products[index] = {
            ...products[index],
            ...req.body,
            id: req.params.id, // Preserve original ID
            updatedAt: new Date().toISOString()
        };

        if (writeDataFile(PRODUCTS_FILE, products)) {
            // Update collection product counts if collection changed
            if (oldCollection !== products[index].collection) {
                updateCollectionProductCount(oldCollection);
                updateCollectionProductCount(products[index].collection);
            }
            res.json({ success: true, data: products[index] });
        } else {
            res.status(500).json({ success: false, error: 'Failed to update product' });
        }
    });

    app.delete('/api/inventory/products/:id', (req, res) => {
        const products = readDataFile(PRODUCTS_FILE);
        if (!products) {
            return res.status(500).json({ success: false, error: 'Failed to read products data' });
        }

        const index = products.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        const deletedProduct = products.splice(index, 1)[0];
        
        if (writeDataFile(PRODUCTS_FILE, products)) {
            // Update collection product count
            updateCollectionProductCount(deletedProduct.collection);
            res.json({ success: true, message: 'Product deleted successfully' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to delete product' });
        }
    });

    // COLLECTIONS API
    app.get('/api/inventory/collections', (req, res) => {
        const collections = readDataFile(COLLECTIONS_FILE);
        if (!collections) {
            return res.status(500).json({ success: false, error: 'Failed to read collections data' });
        }
        res.json({ success: true, data: collections });
    });

    app.get('/api/inventory/collections/:id', (req, res) => {
        const collections = readDataFile(COLLECTIONS_FILE);
        if (!collections) {
            return res.status(500).json({ success: false, error: 'Failed to read collections data' });
        }
        
        const collection = collections.find(c => c.id === req.params.id);
        if (!collection) {
            return res.status(404).json({ success: false, error: 'Collection not found' });
        }
        
        res.json({ success: true, data: collection });
    });

    app.post('/api/inventory/collections', (req, res) => {
        const collections = readDataFile(COLLECTIONS_FILE);
        if (!collections) {
            return res.status(500).json({ success: false, error: 'Failed to read collections data' });
        }

        const newCollection = {
            id: generateId('col'),
            ...req.body,
            status: req.body.status || 'active',
            productCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        collections.push(newCollection);
        
        if (writeDataFile(COLLECTIONS_FILE, collections)) {
            res.json({ success: true, data: newCollection });
        } else {
            res.status(500).json({ success: false, error: 'Failed to save collection' });
        }
    });

    app.put('/api/inventory/collections/:id', (req, res) => {
        const collections = readDataFile(COLLECTIONS_FILE);
        if (!collections) {
            return res.status(500).json({ success: false, error: 'Failed to read collections data' });
        }

        const index = collections.findIndex(c => c.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Collection not found' });
        }

        collections[index] = {
            ...collections[index],
            ...req.body,
            id: req.params.id, // Preserve original ID
            updatedAt: new Date().toISOString()
        };

        if (writeDataFile(COLLECTIONS_FILE, collections)) {
            res.json({ success: true, data: collections[index] });
        } else {
            res.status(500).json({ success: false, error: 'Failed to update collection' });
        }
    });

    app.delete('/api/inventory/collections/:id', (req, res) => {
        const collections = readDataFile(COLLECTIONS_FILE);
        if (!collections) {
            return res.status(500).json({ success: false, error: 'Failed to read collections data' });
        }

        const index = collections.findIndex(c => c.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Collection not found' });
        }

        // Check if collection has products
        const products = readDataFile(PRODUCTS_FILE);
        const productsInCollection = products ? products.filter(p => p.collection === collections[index].name.toLowerCase()) : [];
        
        if (productsInCollection.length > 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Cannot delete collection with existing products. Move or delete products first.' 
            });
        }

        collections.splice(index, 1);
        
        if (writeDataFile(COLLECTIONS_FILE, collections)) {
            res.json({ success: true, message: 'Collection deleted successfully' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to delete collection' });
        }
    });

    // INVENTORY STATUS API
    app.get('/api/inventory/status', (req, res) => {
        const products = readDataFile(PRODUCTS_FILE);
        const collections = readDataFile(COLLECTIONS_FILE);
        
        if (!products || !collections) {
            return res.status(500).json({ success: false, error: 'Failed to read data files' });
        }

        const lowStockThreshold = 20;
        const outOfStock = [];
        const lowStock = [];
        let totalInventory = 0;

        products.forEach(product => {
            Object.entries(product.inventory).forEach(([size, quantity]) => {
                totalInventory += quantity;
                if (quantity === 0) {
                    outOfStock.push({ productId: product.id, productName: product.name, size, quantity });
                } else if (quantity <= lowStockThreshold) {
                    lowStock.push({ productId: product.id, productName: product.name, size, quantity });
                }
            });
        });

        const status = {
            totalProducts: products.length,
            totalCollections: collections.length,
            totalInventory,
            outOfStock,
            lowStock,
            lowStockThreshold,
            lastUpdated: new Date().toISOString()
        };

        res.json({ success: true, data: status });
    });

    // Helper function to update collection product count
    function updateCollectionProductCount(collectionName) {
        const collections = readDataFile(COLLECTIONS_FILE);
        const products = readDataFile(PRODUCTS_FILE);
        
        if (!collections || !products) return;

        const collectionIndex = collections.findIndex(c => c.name.toLowerCase() === collectionName.toLowerCase());
        if (collectionIndex !== -1) {
            collections[collectionIndex].productCount = products.filter(p => p.collection === collectionName).length;
            writeDataFile(COLLECTIONS_FILE, collections);
        }
    }
}

module.exports = { setupInventoryAPI, initializeDataFiles };
