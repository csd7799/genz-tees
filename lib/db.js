/**
 * Phase 6: Database Layer
 * Migrate from JSON to SQLite for production scalability
 * Type-safe with Prisma ORM
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Initialize Prisma client
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./dev.db'
        }
    }
});

// Database migration functions
async function migrateFromJSON() {
    try {
        console.log('🔄 Starting database migration from JSON to SQLite...');
        
        // Load existing JSON data
        const fs = require('fs');
        const historyFile = path.join(__dirname, '..', 'history.json');
        const collectionsFile = path.join(__dirname, '..', 'collections.json');
        const ordersFile = path.join(__dirname, '..', 'orders.json');
        
        let history = [];
        let collections = [];
        let orders = [];
        
        if (fs.existsSync(historyFile)) {
            history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
        }
        if (fs.existsSync(collectionsFile)) {
            collections = JSON.parse(fs.readFileSync(collectionsFile, 'utf8'));
        }
        if (fs.existsSync(ordersFile)) {
            orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
        }

        // Migrate designs
        for (const design of history) {
            if (design.status === 'completed' && design.imageUrl) {
                await prisma.design.create({
                    data: {
                        id: design.id,
                        prompt: design.prompt,
                        provider: design.provider,
                        quality: design.quality || 'draft',
                        imageUrl: design.imageUrl,
                        timestamp: design.timestamp,
                        status: design.status,
                        metadata: design.metadata || {}
                    }
                });
            }
        }

        // Migrate collections
        for (const collection of collections) {
            await prisma.collection.create({
                data: {
                    id: collection.id,
                    name: collection.name,
                    description: collection.description,
                    designIds: collection.designIds || [],
                    products: collection.products || [],
                    status: collection.status || 'draft',
                    timestamp: collection.timestamp || new Date().toISOString(),
                    dropNumber: collection.dropNumber
                }
            });
        }

        // Migrate orders
        for (const order of orders) {
            await prisma.order.create({
                data: {
                    id: order.id,
                    customer: order.customer,
                    items: order.items,
                    totalAmount: order.totalAmount,
                    status: order.status || 'pending',
                    timestamp: order.timestamp || new Date().toISOString(),
                    metadata: order.metadata || {}
                }
            });
        }

        console.log('✅ Migration completed successfully');
        console.log(`📊 Migrated ${history.length} designs`);
        console.log(`📚 Migrated ${collections.length} collections`);
        console.log(`🛍️ Migrated ${orders.length} orders`);

        return {
            success: true,
            designsMigrated: history.length,
            collectionsMigrated: collections.length,
            ordersMigrated: orders.length
        };

    } catch (error) {
        console.error('❌ Migration failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Database operations
async function createDesign(designData) {
    try {
        const design = await prisma.design.create({
            data: designData
        });
        return {
            success: true,
            design
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

async function updateDesign(id, updates) {
    try {
        const design = await prisma.design.update({
            where: { id },
            data: updates
        });
        return {
            success: true,
            design
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

async function getDesigns(limit = 100) {
    try {
        const designs = await prisma.design.findMany({
            orderBy: { timestamp: 'desc' },
            take: limit
        });
        return {
            success: true,
            designs
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

async function createCollection(collectionData) {
    try {
        const collection = await prisma.collection.create({
            data: collectionData
        });
        return {
            success: true,
            collection
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

async function getCollections(limit = 50) {
    try {
        const collections = await prisma.collection.findMany({
            orderBy: { timestamp: 'desc' },
            take: limit
        });
        return {
            success: true,
            collections
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Backup functions
async function createBackup() {
    try {
        const fs = require('fs');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(__dirname, '..', 'backups', `backup-${timestamp}.db`);
        
        // Ensure backups directory exists
        const backupsDir = path.dirname(backupFile);
        if (!fs.existsSync(backupsDir)) {
            fs.mkdirSync(backupsDir, { recursive: true });
        }
        
        // Copy database
        fs.copyFileSync('./dev.db', backupFile);
        
        console.log(`✅ Backup created: ${backupFile}`);
        return {
            success: true,
            backupFile
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Close connection
async function closeConnection() {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
}

module.exports = {
    prisma,
    migrateFromJSON,
    createDesign,
    updateDesign,
    getDesigns,
    createCollection,
    getCollections,
    createBackup,
    closeConnection
};
