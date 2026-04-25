/**
 * Phase 3: Product Creation API
 * Integrates with Gelato POD and creates Shopify products
 */

const fs = require('fs');
const path = require('path');
const GelatoProvider = require('../providers/gelato');

// Configuration
const HISTORY_FILE = path.join(__dirname, '..', 'history.json');
const COLLECTIONS_FILE = path.join(__dirname, '..', 'collections.json');

// Load data functions
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

function loadCollections() {
    try {
        if (fs.existsSync(COLLECTIONS_FILE)) {
            return JSON.parse(fs.readFileSync(COLLECTIONS_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading collections:', error);
    }
    return [];
}

function saveCollections(collections) {
    try {
        fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(collections, null, 2));
    } catch (error) {
        console.error('Error saving collections:', error);
    }
}

// Initialize Gelato provider
const gelato = new GelatoProvider(process.env.GELATO_API_KEY || 'your-gelato-api-key');

// Create product in Gelato and optionally Shopify
async function createProduct(productData) {
    const {
        designId,
        title,
        description,
        price,
        mockupUrls = [],
        variants = [],
        publishToShopify = false,
        collectionId = null
    } = productData;

    try {
        console.log(`🛍️ Creating product: ${title}`);

        // Get design file path
        const designsDir = path.join(__dirname, '..', 'public', 'designs');
        const designUrl = `http://localhost:3000/designs/${designId}.png`;

        // Create product in Gelato
        const gelatoResult = await gelato.createProduct({
            designId,
            title,
            description,
            designUrl,
            mockupUrls,
            price,
            variants
        });

        if (!gelatoResult.success) {
            throw new Error(`Gelato product creation failed: ${gelatoResult.error}`);
        }

        const product = {
            id: `product_${Date.now()}`,
            designId,
            title,
            description,
            price,
            gelatoProductId: gelatoResult.productId,
            gelatoUrl: gelatoResult.url,
            mockups: mockupUrls,
            variants: gelatoResult.variants,
            shopifyProductId: null,
            status: 'created_pod',
            timestamp: new Date().toISOString(),
            collectionId
        };

        // Update history
        const history = loadHistory();
        const designRecord = history.find(item => item.id === designId);
        
        if (designRecord) {
            designRecord.product = product;
            designRecord.status = 'product_created';
            designRecord.productTimestamp = new Date().toISOString();
            saveHistory(history);
        }

        // Add to collections
        if (collectionId) {
            const collections = loadCollections();
            const collection = collections.find(c => c.id === collectionId);
            
            if (collection) {
                if (!collection.products) {
                    collection.products = [];
                }
                collection.products.push(product.id);
                saveCollections(collections);
            }
        }

        console.log('✅ Product created successfully in Gelato');

        return {
            success: true,
            product,
            gelatoResult,
            publishedToShopify: false
        };

    } catch (error) {
        console.error('Product creation failed:', error);
        return {
            success: false,
            error: error.message,
            designId
        };
    }
}

// Create collection
async function createCollection(collectionData) {
    const {
        name,
        description,
        designIds = [],
        publish = false
    } = collectionData;

    try {
        const collection = {
            id: `collection_${Date.now()}`,
            name,
            description,
            designIds,
            products: [],
            status: publish ? 'published' : 'draft',
            timestamp: new Date().toISOString(),
            dropNumber: Math.floor(Math.random() * 100) + 1
        };

        const collections = loadCollections();
        collections.push(collection);
        saveCollections(collections);

        console.log(`✅ Collection created: ${name}`);
        return {
            success: true,
            collection
        };

    } catch (error) {
        console.error('Collection creation failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Express handlers
function handleCreateProduct(req, res) {
    const {
        designId,
        title,
        description,
        price = 1299,
        mockupUrls,
        variants,
        collectionId
    } = req.body;

    if (!designId || !title) {
        return res.status(400).json({
            success: false,
            error: 'Design ID and title are required'
        });
    }

    console.log(`📥 Product creation request: ${title}`);

    createProduct({
        designId,
        title,
        description,
        price,
        mockupUrls: mockupUrls || [],
        variants: variants || [],
        collectionId
    })
        .then(result => {
            if (result.success) {
                res.json(result);
            } else {
                res.status(500).json(result);
            }
        })
        .catch(error => {
            console.error('Create product API error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        });
}

function handleCreateCollection(req, res) {
    const { name, description, designIds, publish } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            error: 'Collection name is required'
        });
    }

    createCollection({ name, description, designIds, publish })
        .then(result => {
            if (result.success) {
                res.json(result);
            } else {
                res.status(500).json(result);
            }
        })
        .catch(error => {
            console.error('Create collection API error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        });
}

function handleGetCollections(req, res) {
    try {
        const collections = loadCollections();
        res.json({
            success: true,
            collections: collections.reverse()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    createProduct,
    createCollection,
    handleCreateProduct,
    handleCreateCollection,
    handleGetCollections
};
