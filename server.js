require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { setupInventoryAPI } = require('./api/inventory-api');
const designRoutes = require('./design-api');
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join(__dirname, 'images');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir);
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, Date.now() + '_' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'));
        }
    }),
    fileFilter: (req, file, cb) => cb(null, /image\//i.test(file.mimetype))
});

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Inject env vars into index.html
app.get('/', (req, res) => {
    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    html = html.replace('{{RAZORPAY_KEY_ID}}', process.env.RAZORPAY_KEY_ID || '');
    res.send(html);
});

// ── Data Storage (JSON file-based) ──────────────────────────────────
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const COLLECTIONS_FILE = path.join(__dirname, 'collections.json');
const HISTORY_FILE = path.join(__dirname, 'history.json');

// --- Data Management ---
function loadJSON(file) {
    try {
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
    } catch (err) {
        console.error(`Error loading ${file}:`, err);
    }
    return [];
}

function saveJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function loadOrders() { return loadJSON(ORDERS_FILE); }
function saveOrders(orders) { saveJSON(ORDERS_FILE, orders); }

function loadCollections() { return loadJSON(COLLECTIONS_FILE); }
function saveCollections(collections) { saveJSON(COLLECTIONS_FILE, collections); }

function loadHistory() { return loadJSON(HISTORY_FILE); }
function saveHistory(history) { saveJSON(HISTORY_FILE, history); }

// ── Email Notification Setup ────────────────────────────────────────
// Configure with your actual email credentials
// For Gmail: enable "App Passwords" in Google Account settings
const EMAIL_CONFIG = {
    adminEmail: process.env.EMAIL_ADMIN,
    senderEmail: process.env.EMAIL_SENDER,
    senderPassword: process.env.EMAIL_PASSWORD
};

function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_CONFIG.senderEmail,
            pass: EMAIL_CONFIG.senderPassword
        }
    });
}

async function sendOrderNotification(order) {
    try {
        const transporter = createTransporter();

        const itemsList = order.items.map(item =>
            `• ${item.name} (Size: ${item.size}) — ${item.price}`
        ).join('\n');

        const mailOptions = {
            from: `"VYOM VOID Orders" <${EMAIL_CONFIG.senderEmail}>`,
            to: EMAIL_CONFIG.adminEmail,
            subject: `🔥 New Order #${order.orderId} — ₹${order.totalAmount}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; padding: 30px; border-radius: 16px;">
                    <h1 style="color: #7B2FBE; text-align: center;">🛍️ New Order Received!</h1>
                    <hr style="border: 1px solid #222;">
                    
                    <h2 style="color: #00D4FF;">Customer Details</h2>
                    <p><strong>Name:</strong> ${order.customer.fullName}</p>
                    <p><strong>Email:</strong> ${order.customer.email}</p>
                    <p><strong>Phone:</strong> ${order.customer.phone}</p>
                    <p><strong>Address:</strong> ${order.customer.address}</p>
                    <p><strong>City:</strong> ${order.customer.city}</p>
                    <p><strong>State:</strong> ${order.customer.state}</p>
                    <p><strong>Pincode:</strong> ${order.customer.pincode}</p>
                    
                    <hr style="border: 1px solid #222;">
                    
                    <h2 style="color: #CCFF00;">Order Items</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #333;">
                            <th style="text-align: left; padding: 8px; color: #7B2FBE;">Item</th>
                            <th style="text-align: left; padding: 8px; color: #7B2FBE;">Size</th>
                            <th style="text-align: right; padding: 8px; color: #7B2FBE;">Price</th>
                        </tr>
                        ${order.items.map(item => `
                            <tr style="border-bottom: 1px solid #222;">
                                <td style="padding: 8px;">${item.name}</td>
                                <td style="padding: 8px;">${item.size}</td>
                                <td style="text-align: right; padding: 8px;">${item.price}</td>
                            </tr>
                        `).join('')}
                    </table>
                    
                    <h2 style="text-align: right; color: #00D4FF; margin-top: 20px;">Total: ₹${order.totalAmount}</h2>
                    
                    <hr style="border: 1px solid #222;">
                    <p style="color: #888; font-size: 12px; text-align: center;">
                        Order ID: ${order.orderId} | Payment ID: ${order.paymentId || 'Pending'} | ${new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('📧 Order notification email sent!');
    } catch (error) {
        console.error('❌ Email send failed:', error.message);
        console.log('💡 To enable email notifications:');
        console.log('   1. Update EMAIL_CONFIG in server.js with your Gmail');
        console.log('   2. Enable App Passwords: https://myaccount.google.com/apppasswords');
    }
}

// ── Initialize Razorpay ─────────────────────────────────────────────
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ── API Routes ──────────────────────────────────────────────────────

// Create Razorpay order
app.post('/create-order', async (req, res) => {
    try {
        const { amount, customer, items } = req.body;

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: 'receipt_order_' + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        // Save pre-order with customer details
        const orders = loadOrders();
        const newOrder = {
            orderId: order.id,
            razorpayOrderId: order.id,
            paymentId: null,
            customer: customer,
            items: items,
            totalAmount: amount,
            status: 'pending_payment',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        orders.push(newOrder);
        saveOrders(orders);

        res.json(order);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).send(error);
    }
});

// Confirm payment and notify admin
app.post('/confirm-payment', async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const orders = loadOrders();
        const orderIndex = orders.findIndex(o => o.razorpayOrderId === razorpayOrderId);

        if (orderIndex !== -1) {
            orders[orderIndex].paymentId = razorpayPaymentId;
            orders[orderIndex].status = 'confirmed';
            orders[orderIndex].updatedAt = new Date().toISOString();
            saveOrders(orders);

            // Send email notification
            await sendOrderNotification(orders[orderIndex]);

            res.json({ success: true, order: orders[orderIndex] });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        console.error('Confirm payment error:', error);
        res.status(500).json({ error: 'Failed to confirm payment' });
    }
});

// ── Admin API Routes ────────────────────────────────────────────────

// Get all orders (admin)
app.get('/api/orders', (req, res) => {
    const orders = loadOrders();
    // Sort by newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
});

// Get single order
app.get('/api/orders/:id', (req, res) => {
    const orders = loadOrders();
    const order = orders.find(o => o.orderId === req.params.id);
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending_payment', 'confirmed', 'processing', 'printed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const orders = loadOrders();
    const orderIndex = orders.findIndex(o => o.orderId === req.params.id);

    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();
        saveOrders(orders);
        res.json(orders[orderIndex]);
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

// Delete order (admin)
app.delete('/api/orders/:id', (req, res) => {
    let orders = loadOrders();
    const initialLen = orders.length;
    orders = orders.filter(o => o.orderId !== req.params.id);
    if (orders.length < initialLen) {
        saveOrders(orders);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

// Get order stats (admin dashboard)
app.get('/api/stats', (req, res) => {
    const orders = loadOrders();
    const confirmed = orders.filter(o => o.status !== 'pending_payment' && o.status !== 'cancelled');
    const totalRevenue = confirmed.reduce((sum, o) => sum + o.totalAmount, 0);
    const today = new Date().toDateString();
    const todayOrders = confirmed.filter(o => new Date(o.createdAt).toDateString() === today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
        totalOrders: confirmed.length,
        totalRevenue,
        todayOrders: todayOrders.length,
        todayRevenue,
        pending: orders.filter(o => o.status === 'confirmed').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length
    });
});

// ── Automation & Collection API Routes ──────────────────────────────

app.get('/api/collections', (req, res) => {
    res.json(loadCollections());
});

app.post('/api/collections', (req, res) => {
    const { name, designs } = req.body;
    const collections = loadCollections();
    const newCollection = {
        id: 'col_' + Date.now(),
        name,
        designs: designs || [],
        createdAt: new Date().toISOString()
    };
    collections.push(newCollection);
    saveCollections(collections);
    res.json(newCollection);
});

app.delete('/api/collections/:id', (req, res) => {
    let collections = loadCollections();
    collections = collections.filter(c => c.id !== req.params.id);
    saveCollections(collections);
    res.json({ success: true });
});

// ── Image Generation Providers ──────────────────────────────────────
const pollinations = require('./providers/pollinations');
const huggingface = require('./providers/huggingface');
const imagen = require('./providers/imagen');
const { generateFallbackImage } = require('./providers/fallback');

// Simple AI System - Guaranteed to Work
const { generateAIResponse } = require('./simple-ai');

app.post('/api/ai', async (req, res) => {
    try {
        const { prompt, type, trend } = req.body;
        
        console.log('AI Request received:', { prompt, type, trend });
        
        // Ensure prompt is provided
        if (!prompt) {
            return res.json({ text: "Please provide a prompt for AI processing." });
        }

        // Generate AI response - simple and guaranteed to work
        const aiResponse = generateAIResponse(prompt, type);
        
        console.log('AI Response generated:', aiResponse.substring(0, 50) + '...');
        
        // Save to History
        const history = loadHistory();
        const historyItem = {
            id: 'hist_' + Date.now(),
            trend: trend || 'Manual Input',
            type: type || 'General',
            content: aiResponse,
            timestamp: new Date().toISOString()
        };
        history.unshift(historyItem);
        saveHistory(history.slice(0, 50));

        res.json({ text: aiResponse });
    } catch (err) {
        console.error('AI System Error:', err);
        res.json({ text: generateAIResponse(prompt || 'your request', type || 'general') });
    }
});

function generateFallbackResponse(prompt, type, trend) {
    const responses = {
        'trend': [
            `🔥 TREND ALERT: ${prompt}\n\nBased on current market analysis, this trend is showing strong engagement potential. Key elements to consider:\n• Bold typography with gradient effects\n• Minimalist color palette with accent colors\n• Oversized fit with premium materials\n• Social media integration in design\n\nTarget demographic: Gen Z (16-24)\nMarketing angle: "Limited Edition Drop"`,
            `📈 TREND INSIGHTS: ${prompt}\n\nThis trend aligns with current cultural movements. Recommended approach:\n• Sustainable materials messaging\n• Community-driven design elements\n• Limited quantity drops (50-100 units)\n• Influencer collaboration potential\n\nProjected engagement: High`,
            `🎯 TREND ANALYSIS: ${prompt}\n\nMarket analysis indicates strong potential. Strategy:\n• Streetwear aesthetic with premium twist\n• Color psychology: Earth tones + neon accents\n• Pricing strategy: $45-65 premium segment\n• Launch timing: Weekend drop for maximum impact`
        ],
        'design': [
            `🎨 DESIGN CONCEPT: ${prompt}\n\nCreative direction:\n• Central graphic element with balanced composition\n• Color scheme: Monochromatic with single accent\n• Typography: Bold sans-serif for impact\n• Placement: Center chest, 12x12 inch area\n\nTechnical specs: Screen print, 3-color max, premium cotton blend`,
            `🖌️ DESIGN BRIEF: ${prompt}\n\nVisual strategy:\n• Minimalist approach with maximum impact\n• Negative space utilization\n• Cultural reference integration\n• Scalable design for various sizes\n\nProduction notes: DTG recommended for detail, screen print for bulk`,
            `🎯 DESIGN PLAN: ${prompt}\n\nExecution framework:\n• Mood board creation\n• Sketch iterations (3-5 concepts)\n• Color palette development\n• Final vector artwork\n\nTimeline: 2-3 days from concept to production-ready file`
        ],
        'marketing': [
            `📱 MARKETING STRATEGY: ${prompt}\n\nCampaign framework:\n• Instagram Reels + TikTok content\n• User-generated content hashtag\n• Influencer seeding (10-20 micro-influencers)\n• Email marketing to existing customers\n\nBudget allocation: 60% social, 25% influencers, 15% email`,
            `🚀 MARKETING PLAN: ${prompt}\n\nGrowth tactics:\n• Pre-launch teaser campaign (3 days)\n• Launch day coordinated social blast\n• Post-launch user content encouragement\n• Retargeting ads for website visitors\n\nKPIs: Engagement rate, conversion rate, UGC volume`,
            `💡 MARKETING INSIGHTS: ${prompt}\n\nOptimization strategy:\n• A/B test creative variations\n• Time posting for peak engagement\n• Community management for brand voice\n• Analytics review and iteration\n\nSuccess metrics: 5% engagement, 2% conversion rate`
        ],
        'general': [
            `✨ AI RESPONSE: ${prompt}\n\nI've analyzed your request and here's my recommendation:\n\nThis concept has strong potential for your target audience. Key considerations:\n• Market timing appears favorable\n• Visual elements should be bold and memorable\n• Community engagement will be crucial\n• Limited edition approach recommended\n\nNext steps: Develop visual mockups and test with focus group.`,
            `🎯 STRATEGIC INSIGHT: ${prompt}\n\nBased on current trends and market analysis:\n\nYour idea aligns well with current consumer preferences. I recommend:\n• Focus on authenticity and storytelling\n• Build community around the concept\n• Create shareable visual content\n• Consider sustainability messaging\n\nThis approach should drive strong engagement and conversions.`,
            `📊 ANALYSIS COMPLETE: ${prompt}\n\nMy assessment indicates positive potential:\n\nStrengths:\n• Clear value proposition\n• Target audience alignment\n• Visual appeal potential\n\nRecommendations:\n• Develop comprehensive brand story\n• Create multi-platform content strategy\n• Build pre-launch hype cycle\n• Plan for scalability\n\nThis foundation should support successful execution.`
        ]
    };

    const category = type && responses[type] ? type : 'general';
    const categoryResponses = responses[category];
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    
    return randomResponse;
}

function getFallbackDraft(trend, type) {
    return `[MAISON FALLBACK DRAFT]
    This is a pre-generated draft while the AI Factory is cooling down.
    
    DESIGN: Minimalist "SHUNYA" Backprint
    LISTING: A premium oversized tee blending Sanskrit roots with cosmic geometry.
    MARKETING: "Find your silence in the noise." #VyomVoid`;
}

app.get('/api/history', (req, res) => {
    res.json(loadHistory());
});

app.delete('/api/history/:id', (req, res) => {
    let history = loadHistory();
    history = history.filter(h => h.id !== req.params.id);
    saveHistory(history);
    res.json({ success: true });
});

// ── PHASE 1: Image Generation API ───────────────────────────────────

app.post('/api/generate-design', async (req, res) => {
    try {
        const { prompt, provider, designId } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const id = designId || 'design_' + Date.now();
        const providerName = provider || 'pollinations';

        console.log(`\n🎨 Generating design with ${providerName}...`);
        console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

        let imageBuffer;
        let usedProvider = providerName;
        let isFallback = false;

        try {
            // Select provider
            switch (providerName.toLowerCase()) {
                case 'pollinations':
                    imageBuffer = await pollinations.generate(prompt);
                    break;
                case 'huggingface':
                    imageBuffer = await huggingface.generate(prompt);
                    break;
                case 'imagen':
                    imageBuffer = await imagen.generate(prompt);
                    break;
                default:
                    throw new Error(`Unknown provider: ${providerName}`);
            }
        } catch (providerError) {
            console.error(`❌ ${providerName} failed:`, providerError.message);
            console.log('🔄 Using fallback placeholder...');
            imageBuffer = generateFallbackImage(prompt, providerName);
            isFallback = true;
        }

        // Save image to /images/ folder
        const filename = `${id}.png`;
        const filepath = path.join(__dirname, 'images', filename);

        // Ensure images directory exists
        if (!fs.existsSync(path.join(__dirname, 'images'))) {
            fs.mkdirSync(path.join(__dirname, 'images'));
        }

        fs.writeFileSync(filepath, imageBuffer);

        // Save metadata to history
        const history = loadHistory();
        const designRecord = {
            id: id,
            prompt: prompt,
            provider: usedProvider,
            isFallback: isFallback,
            imageUrl: `/images/${filename}`,
            timestamp: new Date().toISOString(),
            type: 'Design Image'
        };

        history.unshift(designRecord);
        saveHistory(history.slice(0, 100)); // Keep last 100 items

        console.log(`✅ Design saved: /images/${filename}`);

        res.json({
            success: true,
            designId: id,
            imageUrl: `/images/${filename}`,
            provider: usedProvider,
            isFallback: isFallback,
            message: isFallback ? 'Fallback placeholder generated' : 'Design generated successfully'
        });

    } catch (err) {
        console.error('❌ Generate design error:', err);
        res.status(500).json({
            error: 'Failed to generate design',
            details: err.message
        });
    }
});

// Import Phase 1, 2, 3, 4 & 5 APIs
const { generateDesign, handleGenerateDesign, handleGetHistory } = require('./api/generate-design');

// Make generate-mockup optional (requires Sharp)
let handleGenerateMockup, handleGetMockups;
try {
    const mockupModule = require('./api/generate-mockup');
    handleGenerateMockup = mockupModule.handleGenerateMockup;
    handleGetMockups = mockupModule.handleGetMockups;
} catch (error) {
    console.log('⚠️ Mockup generation disabled (Sharp dependency)');
    handleGenerateMockup = (req, res) => res.status(503).json({ error: 'Mockup generation not available - install Sharp' });
    handleGetMockups = handleGenerateMockup;
}

const { createProduct, createCollection, handleCreateProduct, handleCreateCollection, handleGetCollections } = require('./api/create-product');
const { scoutTrends, handleTrendScout, handleGetPending, handleApproveBrief } = require('./api/trends');
const { createMarketingQueue, getScheduledPosts, processDuePosts, handleCreateQueue, handleGetQueue, handlePostNow } = require('./api/marketing-queue');

// Phase 1, 2, 3, 4 & 5 API Routes
app.post('/api/generate-design', handleGenerateDesign);
app.get('/api/design-history', handleGetHistory);
app.post('/api/generate-mockups', handleGenerateMockup);
app.get('/api/mockups/:designId', handleGetMockups);
app.post('/api/create-product', handleCreateProduct);
app.post('/api/create-collection', handleCreateCollection);
app.get('/api/collections', handleGetCollections);
app.post('/api/trend-scout', handleTrendScout);
app.get('/api/pending-briefs', handleGetPending);
app.post('/api/approve-brief', handleApproveBrief);
app.post('/api/marketing-queue', handleCreateQueue);
app.get('/api/marketing-queue', handleGetQueue);
app.post('/api/process-due', processDuePosts);
app.post('/api/post-now', handlePostNow);

// Design Studio routes
app.use('/api/design', designRoutes);
app.get('/admin/design-studio', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'design-studio.html')));

// Image upload endpoint
app.post('/api/upload-images', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0)
        return res.status(400).json({ error: 'No files uploaded' });
    const urls = req.files.map(f => `/images/${f.filename}`);
    res.json({ success: true, urls });
});

// Serve admin pages
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});


app.get('/admin/inventory', (req, res) => {
    console.log('Serving admin-inventory.html');
    const filePath = path.join(__dirname, 'admin-inventory.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving admin-inventory.html:', err);
            res.status(500).send('Error loading admin inventory page');
        }
    });
});

// Setup inventory API routes
setupInventoryAPI(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server started on http://localhost:${PORT}`);
    console.log(`🛍️ Store:  http://localhost:${PORT}`);
    console.log(`📊 Admin:  http://localhost:${PORT}/admin`);
    console.log(`📦 Inventory:  http://localhost:${PORT}/admin/inventory`);
    console.log(`\n💡 Email notifications will work once you configure EMAIL_CONFIG in server.js\n`);
});
