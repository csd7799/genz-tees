/**
 * Phase 4: Trend Scout
 * Scrapes trending topics and feeds them to Gemini for brief generation
 * Runs on cron to provide fresh design ideas
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const PENDING_FILE = path.join(__dirname, '..', 'pending.json');
const HISTORY_FILE = path.join(__dirname, '..', 'history.json');

// Ensure pending file exists
function loadPending() {
    try {
        if (fs.existsSync(PENDING_FILE)) {
            return JSON.parse(fs.readFileSync(PENDING_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading pending:', error);
    }
    return [];
}

function savePending(pending) {
    try {
        fs.writeFileSync(PENDING_FILE, JSON.stringify(pending, null, 2));
    } catch (error) {
        console.error('Error saving pending:', error);
    }
}

// Google Trends scraper (simplified)
async function getGoogleTrends() {
    return new Promise((resolve, reject) => {
        // Trending keywords for Gen Z streetwear
        const keywords = [
            'streetwear 2024',
            'gen z fashion',
            'dark aesthetic',
            'minimalist t-shirt',
            'cosmic fashion',
            'sanskrit tattoo',
            'black clothing aesthetic',
            'oversized t-shirt',
            'indie clothing brands',
            'alt fashion',
            'cyberpunk fashion'
        ];

        // Simulate trend data (in production, use pytrends library)
        const trends = keywords.map(keyword => ({
            keyword,
            score: Math.random() * 100, // Simulated trend score
            source: 'google_trends',
            context: `Rising trend in fashion category`
        }));

        resolve(trends);
    });
}

// Reddit trends scraper (simplified)
async function getRedditTrends() {
    return new Promise((resolve, reject) => {
        const subreddits = [
            'streetwear',
            'malefashionadvice',
            'frugalfemalefashion',
            'streetwearstartup',
            'design',
            'graphic_design'
        ];

        // Simulate Reddit trend data
        const trends = subreddits.map(subreddit => ({
            keyword: `${subreddit} aesthetic`,
            score: Math.random() * 80 + 20,
            source: 'reddit',
            context: `Trending in r/${subreddit}`
        }));

        resolve(trends);
    });
}

// Pinterest trends scraper (simplified)
async function getPinterestTrends() {
    return new Promise((resolve, reject) => {
        const keywords = [
            'dark aesthetic fashion',
            'streetwear style',
            'minimalist design',
            'cosmic art',
            'sanskrit symbols',
            'black t-shirt design',
            'gen z outfits'
        ];

        // Simulate Pinterest trend data
        const trends = keywords.map(keyword => ({
            keyword,
            score: Math.random() * 70 + 30,
            source: 'pinterest',
            context: `High engagement pins`
        }));

        resolve(trends);
    });
}

// Aggregate and rank trends
async function aggregateTrends() {
    try {
        console.log('🔍 Scouring trends from multiple sources...');

        const [googleTrends, redditTrends, pinterestTrends] = await Promise.all([
            getGoogleTrends(),
            getRedditTrends(),
            getPinterestTrends()
        ]);

        // Combine all trends
        const allTrends = [...googleTrends, ...redditTrends, ...pinterestTrends];

        // Remove duplicates and rank by score
        const uniqueTrends = allTrends.reduce((acc, trend) => {
            const existing = acc.find(t => t.keyword.toLowerCase() === trend.keyword.toLowerCase());
            if (existing) {
                existing.score = Math.max(existing.score, trend.score);
                existing.sources = existing.sources ? [...existing.sources, trend.source] : [trend.source];
            } else {
                acc.push({
                    ...trend,
                    sources: [trend.source]
                });
            }
            return acc;
        }, []);

        // Sort by score (descending) and take top 10
        const topTrends = uniqueTrends
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        console.log(`✅ Found ${topTrends.length} top trends`);
        return topTrends;

    } catch (error) {
        console.error('Trend aggregation failed:', error);
        return [];
    }
}

// Generate design brief using Gemini
async function generateBrief(trend) {
    return new Promise((resolve, reject) => {
        const prompt = `Create a t-shirt design brief based on this trend:

Trend: ${trend.keyword}
Score: ${trend.score}
Source: ${trend.source}
Context: ${trend.context}

Generate a brief for VYOM VOID brand:
- Dark aesthetic streetwear brand
- Target: Indian Gen Z (16-26)
- Sanskrit cosmic themes
- Minimalist, bold designs
- Black t-shirts preferred

Return JSON format:
{
  "title": "Brief title",
  "prompt": "Detailed AI image generation prompt",
  "description": "Product description",
  "collection": "Collection name suggestion",
  "tags": ["tag1", "tag2", "tag3"],
  "target_audience": "Audience focus",
  "mood": "Dark/Minimalist/Cosmic"
}`;

        // Use existing Gemini factory
        const { generateFactoryBrief } = require('../app');
        
        generateFactoryBrief(prompt)
            .then(result => {
                try {
                    const brief = JSON.parse(result.response);
                    resolve({
                        ...trend,
                        brief,
                        generatedAt: new Date().toISOString()
                    });
                } catch (error) {
                    // Fallback brief if JSON parsing fails
                    resolve({
                        ...trend,
                        brief: {
                            title: `${trend.keyword} Void Design`,
                            prompt: `Minimalist ${trend.keyword} design, dark aesthetic, black t-shirt, cosmic elements, Sanskrit inspiration`,
                            description: `Dark ${trend.keyword} inspired t-shirt design from VYOM VOID`,
                            collection: `${trend.keyword.toUpperCase()} DROP`,
                            tags: ['streetwear', 'dark aesthetic', 'gen z', 'minimalist'],
                            target_audience: 'Indian Gen Z',
                            mood: 'Dark & Cosmic'
                        },
                        generatedAt: new Date().toISOString()
                    });
                }
            })
            .catch(error => {
                reject(error);
            });

    });
}

// Main trend scout function
async function scoutTrends() {
    try {
        console.log('🚀 Starting trend scout cycle...');

        // Get top trends
        const trends = await aggregateTrends();
        
        // Generate briefs for each trend
        const briefs = [];
        for (const trend of trends) {
            const brief = await generateBrief(trend);
            briefs.push(brief);
        }

        // Load existing pending
        const pending = loadPending();

        // Add new briefs to pending
        const newBriefs = briefs.map(brief => ({
            id: `brief_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...brief,
            status: 'awaiting_approval',
            createdAt: new Date().toISOString()
        }));

        const updatedPending = [...newBriefs, ...pending];

        // Save updated pending list
        savePending(updatedPending);

        console.log(`✅ Generated ${briefs.length} new design briefs`);
        console.log(`📬 Total pending briefs: ${updatedPending.length}`);

        return {
            success: true,
            trendsScraped: trends.length,
            briefsGenerated: briefs.length,
            totalPending: updatedPending.length,
            briefs: newBriefs
        };

    } catch (error) {
        console.error('Trend scout failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Express handlers
function handleTrendScout(req, res) {
    console.log('📥 Manual trend scout request');

    scoutTrends()
        .then(result => {
            if (result.success) {
                res.json(result);
            } else {
                res.status(500).json(result);
            }
        })
        .catch(error => {
            console.error('Trend scout API error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        });
}

function handleGetPending(req, res) {
    try {
        const pending = loadPending();
        res.json({
            success: true,
            pending: pending.reverse().slice(0, 50), // Latest 50
            count: pending.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

function handleApproveBrief(req, res) {
    const { briefId } = req.body;

    if (!briefId) {
        return res.status(400).json({
            success: false,
            error: 'Brief ID is required'
        });
    }

    try {
        const pending = loadPending();
        const briefIndex = pending.findIndex(b => b.id === briefId);

        if (briefIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Brief not found'
            });
        }

        // Mark as approved
        pending[briefIndex].status = 'approved';
        pending[briefIndex].approvedAt = new Date().toISOString();
        savePending(pending);

        // Trigger Phase 1 image generation
        const { generateDesign } = require('./generate-design');
        
        generateDesign(pending[briefIndex].brief.prompt, {
            designId: `auto_${briefId}`,
            quality: 'draft',
            provider: 'auto'
        })
        .then(result => {
            console.log(`✅ Approved brief ${briefId} sent for generation`);
        })
        .catch(error => {
            console.error(`Failed to generate design for approved brief ${briefId}:`, error);
        });

        res.json({
            success: true,
            message: 'Brief approved and sent for generation',
            briefId
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    scoutTrends,
    handleTrendScout,
    handleGetPending,
    handleApproveBrief
};
