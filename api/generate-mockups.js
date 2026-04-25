const fs = require('fs');
const path = require('path');

// New collection concepts for VYOM VOID
const newCollections = {
    'maya': { 
        name: 'MAYA', 
        color: '#9D4EDD', 
        meaning: 'Illusion',
        theme: 'Cosmic illusions and reality-bending designs'
    },
    'srishti': { 
        name: 'SRISHTI', 
        color: '#FF006E', 
        meaning: 'Creation',
        theme: 'Big bang and cosmic creation patterns'
    },
    'nirvana': { 
        name: 'NIRVANA', 
        color: '#00F5FF', 
        meaning: 'Liberation',
        theme: 'Transcendental meditation and enlightenment symbols'
    }
};

const newProducts = [
    // MAYA Collection - Illusion themed
    { 
        name: "OPTICAL ILLUSION — BLACK", 
        price: "₹1499", 
        collection: "maya", 
        desc: "Mind-bending geometric patterns that play with perception. Hypnotic design that changes when viewed from different angles.",
        prompt: "minimalist black t-shirt with optical illusion geometric pattern, hypnosis style, black and white, clean design, product mockup"
    },
    { 
        name: "QUANTUM DREAM — DEEP SPACE", 
        price: "₹1599", 
        collection: "maya", 
        desc: "Quantum mechanics visualization. Subatomic particle patterns in dreamlike arrangement.",
        prompt: "dark navy t-shirt with quantum particle pattern, scientific illustration style, minimalist, product mockup"
    },
    { 
        name: "MIRROR REALITY — GREY", 
        price: "₹1399", 
        collection: "maya", 
        desc: "Reflective patterns that mirror and distort. The concept of perceived vs actual reality.",
        prompt: "grey t-shirt with mirror reflection pattern, symmetrical design, minimalist aesthetic, product mockup"
    },
    
    // SRISHTI Collection - Creation themed
    { 
        name: "BIG BANG — BLACK", 
        price: "₹1799", 
        collection: "srishti", 
        desc: "Explosive creation pattern. The moment everything began. Radiating energy from center point.",
        prompt: "black t-shirt with big bang explosion pattern, radiating lines from center, cosmic energy, minimalist, product mockup"
    },
    { 
        name: "STELLAR NURSERY — DEEP NAVY", 
        price: "₹1699", 
        collection: "srishti", 
        desc: "Where stars are born. Nebula clouds and stellar formation patterns.",
        prompt: "navy t-shirt with nebula cloud pattern, star formation, cosmic dust, minimalist design, product mockup"
    },
    { 
        name: "CREATION SEED — CHARCOAL", 
        price: "₹1499", 
        collection: "srishti", 
        desc: "The seed of creation. Sacred geometry patterns representing the origin of all things.",
        prompt: "charcoal t-shirt with sacred geometry seed of life pattern, minimalist, spiritual design, product mockup"
    },
    
    // NIRVANA Collection - Liberation themed
    { 
        name: "ENLIGHTENMENT CIRCLE — WHITE", 
        price: "₹1599", 
        collection: "nirvana", 
        desc: "The circle of enlightenment. Perfect harmony and balance in minimalist form.",
        prompt: "white t-shirt with enlightenment circle pattern, minimalist zen design, sacred geometry, product mockup"
    },
    { 
        name: "MEDITATION WAVE — LIGHT GREY", 
        price: "₹1399", 
        collection: "nirvana", 
        desc: "Brainwave patterns during deep meditation. The flow of consciousness.",
        prompt: "light grey t-shirt with meditation wave pattern, brainwave visualization, minimalist, product mockup"
    },
    { 
        name: "TRANSCENDENCE — BLACK", 
        price: "₹1799", 
        collection: "nirvana", 
        desc: "Breaking through the veil. Ascension patterns representing spiritual liberation.",
        prompt: "black t-shirt with transcendence pattern, ascending lines, spiritual minimalist design, product mockup"
    }
];

// Generate mockup images using AI endpoint
async function generateMockups() {
    console.log('Generating mockups for new collections...');
    
    for (const product of newProducts) {
        try {
            console.log(`Generating: ${product.name}`);
            
            const response = await fetch('http://localhost:3000/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: product.prompt,
                    style: 'minimalist fashion mockup'
                })
            });
            
            if (response.ok) {
                const imageBuffer = await response.arrayBuffer();
                const filename = `${product.collection.toLowerCase()}_${product.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
                const filepath = path.join(__dirname, '..', 'images', filename);
                
                fs.writeFileSync(filepath, Buffer.from(imageBuffer));
                console.log(`✅ Generated: ${filename}`);
                product.img = filename;
            } else {
                console.log(`❌ Failed to generate: ${product.name}`);
                // Use existing mockup as fallback
                product.img = 'mockup_front.png';
            }
        } catch (error) {
            console.log(`❌ Error generating ${product.name}:`, error.message);
            product.img = 'mockup_front.png';
        }
    }
    
    return newProducts;
}

// Update the app.js with new collections and products
function updateAppJS() {
    const appPath = path.join(__dirname, '..', 'app.js');
    let appContent = fs.readFileSync(appPath, 'utf8');
    
    // Add new collections to the collections object
    const collectionsStart = appContent.indexOf('const collections = {');
    const collectionsEnd = appContent.indexOf('};', collectionsStart) + 2;
    
    const newCollectionsCode = `
        'maya': { name: 'MAYA', color: '#9D4EDD', meaning: 'Illusion' },
        'srishti': { name: 'SRISHTI', color: '#FF006E', meaning: 'Creation' },
        'nirvana': { name: 'NIRVANA', color: '#00F5FF', meaning: 'Liberation' }`;
    
    // Insert new collections before the closing brace
    appContent = appContent.substring(0, collectionsEnd - 2) + newCollectionsCode + '\n' + appContent.substring(collectionsEnd);
    
    // Add new products to the products array
    const productsStart = appContent.indexOf('const products = [');
    const productsEnd = appContent.indexOf('];', productsStart) + 2;
    
    const newProductsCode = newProducts.map(p => 
        `{ name: "${p.name}", price: "${p.price}", img: "${p.img}", badge: "NEW", filter: "brightness(0.1)", collection: "${p.collection}", desc: "${p.desc}" }`
    ).join(',\n        ');
    
    // Insert new products before the closing bracket
    appContent = appContent.substring(0, productsEnd - 2) + ',\n        ' + newProductsCode + '\n' + appContent.substring(productsEnd);
    
    fs.writeFileSync(appPath, appContent);
    console.log('✅ Updated app.js with new collections and products');
}

// Update HTML with new collection tabs
function updateHTML() {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Add new collection tabs
    const tabsSection = htmlContent.indexOf('<div class="collection-tabs"');
    const tabsEnd = htmlContent.indexOf('</div>', tabsSection) + 6;
    
    const newTabs = `
            <button class="tab-btn" data-collection="maya">MAYA</button>
            <button class="tab-btn" data-collection="srishti">SRISHTI</button>
            <button class="tab-btn" data-collection="nirvana">NIRVANA</button>`;
    
    htmlContent = htmlContent.substring(0, tabsEnd - 6) + newTabs + '\n        </div>' + htmlContent.substring(tabsEnd);
    
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('✅ Updated index.html with new collection tabs');
}

// Main execution
async function main() {
    try {
        await generateMockups();
        updateAppJS();
        updateHTML();
        console.log('🚀 Successfully added new collections with mockups!');
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

if (require.main === module) {
    main();
}

module.exports = { newCollections, newProducts, generateMockups };
