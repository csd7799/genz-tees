const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// ── Data Storage (JSON file-based) ──────────────────────────────────
const ORDERS_FILE = path.join(__dirname, 'orders.json');

function loadOrders() {
    try {
        if (fs.existsSync(ORDERS_FILE)) {
            return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
        }
    } catch (err) {
        console.error('Error loading orders:', err);
    }
    return [];
}

function saveOrders(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// ── Email Notification Setup ────────────────────────────────────────
// Configure with your actual email credentials
// For Gmail: enable "App Passwords" in Google Account settings
const EMAIL_CONFIG = {
    adminEmail: 'your-admin@gmail.com',      // ← Change to your email
    senderEmail: 'your-sender@gmail.com',     // ← Change to your email
    senderPassword: 'your-app-password',      // ← Change to your app password
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
    key_id: 'rzp_test_SfJRVUJVV0bXjj',
    key_secret: 'j3YAfigOypBtQA20uQ1b2waD'
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

// Serve admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server started on http://localhost:${PORT}`);
    console.log(`🛍️ Store:  http://localhost:${PORT}`);
    console.log(`📊 Admin:  http://localhost:${PORT}/admin`);
    console.log(`\n💡 Email notifications will work once you configure EMAIL_CONFIG in server.js\n`);
});
