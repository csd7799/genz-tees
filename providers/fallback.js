/**
 * Fallback Placeholder Generator
 * Creates a simple PNG with text when all providers fail
 * Keeps workflow alive similar to getFallbackDraft()
 */

function generateFallbackImage(prompt, provider) {
    // Create a simple SVG placeholder
    const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="1024" fill="#0A0A0F"/>
        <text x="512" y="400" font-family="Arial" font-size="24" fill="#7B2FBE" text-anchor="middle">
            VYOM VOID
        </text>
        <text x="512" y="450" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">
            [FALLBACK PLACEHOLDER]
        </text>
        <text x="512" y="500" font-family="Arial" font-size="14" fill="#888" text-anchor="middle">
            ${provider} provider temporarily unavailable
        </text>
        <text x="512" y="550" font-family="Arial" font-size="12" fill="#555" text-anchor="middle" style="max-width: 800px;">
            Prompt: ${prompt.substring(0, 80)}...
        </text>
        <text x="512" y="650" font-family="Arial" font-size="14" fill="#00D4FF" text-anchor="middle">
            Try another provider or retry later
        </text>
    </svg>
    `;

    return Buffer.from(svg);
}

module.exports = { generateFallbackImage };
