/**
 * Phase 5: Marketing Auto-Post Scheduler
 * Schedules and posts content across Instagram, Pinterest, Facebook
 * 7-day automated marketing sequences for new drops
 */

const fs = require('fs');
const path = require('path');

// Configuration
const QUEUE_FILE = path.join(__dirname, '..', 'marketing-queue.json');
const HISTORY_FILE = path.join(__dirname, '..', 'history.json');

// Load functions
function loadQueue() {
    try {
        if (fs.existsSync(QUEUE_FILE)) {
            return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading queue:', error);
    }
    return [];
}

function saveQueue(queue) {
    try {
        fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
    } catch (error) {
        console.error('Error saving queue:', error);
    }
}

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

// Marketing content generator
function generateMarketingContent(product) {
    const {
        title,
        description,
        mockups = [],
        tags = []
    } = product;

    const baseCaptions = [
        `🌌 Just dropped: ${title}. Where sky meets nothingness.`,
        `New from VYOM VOID: ${title}. Dark aesthetic for the cosmic soul.`,
        `Limited drop alert: ${title}. Only a few exist in the void.`,
        `Wear the cosmos. ${title}. Now available.`,
        `From the void to your wardrobe. ${title}. Premium streetwear.`
    ];

    const hashtags = [
        '#vyomvoid',
        '#darkfashion',
        '#streetwearindia',
        '#genzfashion',
        '#minimalist',
        '#cosmicart',
        '#sanskritfashion',
        '#indiebrand',
        '#limiteddrop',
        '#blackaesthetic'
    ];

    const postTypes = [
        { type: 'teaser', delay: 0, caption: baseCaptions[0] },
        { type: 'announcement', delay: 1, caption: baseCaptions[1] },
        { type: 'lifestyle', delay: 3, caption: baseCaptions[2] },
        { type: 'ugc', delay: 5, caption: baseCaptions[3] },
        { type: 'restock', delay: 7, caption: baseCaptions[4] }
    ];

    return postTypes.map((postType, index) => ({
        id: `post_${Date.now()}_${index}`,
        productId: product.id,
        title: product.title,
        type: postType.type,
        caption: postType.caption,
        hashtags: hashtags.slice(0, 10).join(' '), // Limit hashtags
        imageUrl: mockups.length > 0 ? mockups[0].url : null,
        platform: ['instagram', 'pinterest', 'facebook'],
        scheduledFor: new Date(Date.now() + (postType.delay * 24 * 60 * 60 * 1000)).toISOString(),
        status: 'scheduled',
        createdAt: new Date().toISOString()
    }));
}

// Create marketing queue for product
async function createMarketingQueue(productId) {
    try {
        // Load product from history
        const history = loadHistory();
        const product = history.find(item => item.id === productId);

        if (!product) {
            throw new Error(`Product not found: ${productId}`);
        }

        console.log(`📅 Creating marketing queue for product: ${product.title}`);

        // Generate marketing content
        const posts = generateMarketingContent(product);

        // Load existing queue
        const queue = loadQueue();

        // Add new posts to queue
        const updatedQueue = [...queue, ...posts];
        saveQueue(updatedQueue);

        console.log(`✅ Created ${posts.length} scheduled posts for ${product.title}`);
        return {
            success: true,
            productId,
            postsCreated: posts.length,
            totalScheduled: updatedQueue.length
        };

    } catch (error) {
        console.error('Marketing queue creation failed:', error);
        return {
            success: false,
            error: error.message,
            productId
        };
    }
}

// Get scheduled posts
function getScheduledPosts(limit = 50) {
    try {
        const queue = loadQueue();
        const sortedQueue = queue.sort((a, b) => new Date(b.scheduledFor) - new Date(a.scheduledFor));
        
        return {
            success: true,
            posts: sortedQueue.slice(0, limit),
            total: queue.length
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Post to platform (mock implementation)
async function postToPlatform(postId, platform) {
    try {
        console.log(`📤 Posting to ${platform}: ${postId}`);
        
        // In production, this would integrate with:
        // - Instagram Graph API
        // - Pinterest API v5
        // - Facebook Graph API
        
        // For now, simulate posting
        const queue = loadQueue();
        const postIndex = queue.findIndex(p => p.id === postId);
        
        if (postIndex !== -1) {
            queue[postIndex].status = 'posted';
            queue[postIndex].postedAt = new Date().toISOString();
            saveQueue(queue);
        }

        return {
            success: true,
            platform,
            postId,
            postedAt: new Date().toISOString()
        };

    } catch (error) {
        console.error(`Failed to post to ${platform}:`, error);
        return {
            success: false,
            error: error.message,
            platform,
            postId
        };
    }
}

// Process due posts (cron job)
async function processDuePosts() {
    try {
        console.log('⏰ Processing due marketing posts...');
        
        const queue = loadQueue();
        const now = new Date();
        
        const duePosts = queue.filter(post => 
            post.status === 'scheduled' && 
            new Date(post.scheduledFor) <= now
        );

        let processedCount = 0;
        
        for (const post of duePosts) {
            // Post to each platform
            for (const platform of post.platform) {
                await postToPlatform(post.id, platform);
                processedCount++;
            }
        }

        console.log(`✅ Processed ${processedCount} due posts`);
        return {
            success: true,
            processedCount,
            dueCount: duePosts.length
        };

    } catch (error) {
        console.error('Failed to process due posts:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Express handlers
function handleCreateQueue(req, res) {
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({
            success: false,
            error: 'Product ID is required'
        });
    }

    console.log(`📥 Marketing queue request for product: ${productId}`);

    createMarketingQueue(productId)
        .then(result => {
            if (result.success) {
                res.json(result);
            } else {
                res.status(500).json(result);
            }
        })
        .catch(error => {
            console.error('Create marketing queue API error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        });
}

function handleGetQueue(req, res) {
    const { limit = 50 } = req.query;

    const result = getScheduledPosts(limit);
    
    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
}

function handleProcessDue(req, res) {
    console.log('📥 Manual process due posts request');

    processDuePosts()
        .then(result => {
            if (result.success) {
                res.json(result);
            } else {
                res.status(500).json(result);
            }
        })
        .catch(error => {
            console.error('Process due posts API error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        });
}

function handlePostNow(req, res) {
    const { postId, platform } = req.body;

    if (!postId || !platform) {
        return res.status(400).json({
            success: false,
            error: 'Post ID and platform are required'
        });
    }

    postToPlatform(postId, platform)
        .then(result => {
            if (result.success) {
                res.json(result);
            } else {
                res.status(500).json(result);
            }
        })
        .catch(error => {
            console.error('Post now API error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        });
}

module.exports = {
    createMarketingQueue,
    getScheduledPosts,
    processDuePosts,
    handleCreateQueue,
    handleGetQueue,
    handlePostNow
};
