/**
 * build.js — Static HTML & Sitemap Generator
 * -------------------------------------------------------------
 * Node.js দিয়ে বিল্ড টাইমে (Build-Time) সরাসরি HTML পেজ ও sitemap.xml
 * তৈরি করে নেওয়া। এর ফলে গুগল বট রেডিমেড HTML পাবে এবং SEO স্কোরের
 * সম্পূর্ণ সুবিধা পাওয়া যাবে।
 */

const fs = require('fs');
const path = require('path');

// ডাটা ফাইল লোড করা (tools-data.json বা bangla-tools.json)
let tools = [];
const dataFilePath = path.join(__dirname, 'assets', 'json', 'tools--blog--data.json');

try {
    if (fs.existsSync(dataFilePath)) {
        const rawData = fs.readFileSync(dataFilePath, 'utf8');
        tools = JSON.parse(rawData);
    } else {
        console.warn('⚠️ Warning: tools-data.json file not found. Generating default build.');
    }
} catch (err) {
    console.error('❌ Error parsing tools data JSON:', err.message);
}

// XML-এর বিশেষ ক্যারেক্টার এস্কেপ করার ফাংশন
function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

// ১. মূল tools.html পেজ জেনারেট করা
const toolCardsHTML = tools.map(tool => {
    const name = tool.name || tool.title || 'AI Tool';
    const link = tool.link || tool.url || '#';
    const desc = tool.description || tool.short_description || 'Advanced AI application.';
    const category = tool.category || tool.task || 'General AI';
    const blogUrl = tool.blogUrl || 'blog.html';

    return `
    <div class="col-12 col-md-6 col-lg-4">
        <div class="tool-card">
            <span class="category-badge">${escapeXml(category)}</span>
            <h3>${escapeXml(name)}</h3>
            <p>${escapeXml(desc)}</p>
            <div class="d-flex gap-2 mt-3">
                <a href="${escapeXml(link)}" target="_blank" class="btn-use">Use Tool ↗</a>
                <a href="${escapeXml(blogUrl)}" class="btn-guide">Read Guide</a>
            </div>
        </div>
    </div>`;
}).join('\n');

const toolsPageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All AI Tools Directory — allalo AI</title>
    <meta name="description" content="Explore static generated directory of verified AI tools, agents, and custom utilities on allalo AI.">
    <link rel="canonical" href="https://ai.allalo.com/tools.html">
    <link rel="icon" type="image/png" href="https://ai.allalo.com/favicon.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
    <style>
        body { background-color: #030712; color: #94a3b8; font-family: 'Inter', sans-serif; padding: 40px 0; }
        h1, h3 { font-family: 'Space Grotesk', sans-serif; color: #f1f5f9; font-weight: 700; }
        .tool-card { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 20px; padding: 24px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
        .category-badge { font-size: 10px; text-transform: uppercase; color: #818cf8; font-weight: 700; letter-spacing: 1px; margin-bottom: 8px; display: block; }
        .btn-use { background: #6366f1; color: #fff; padding: 8px 16px; border-radius: 50px; text-decoration: none; font-size: 12px; font-weight: 600; flex: 1; text-align: center; }
        .btn-guide { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #cbd5e1; padding: 8px 16px; border-radius: 50px; text-decoration: none; font-size: 12px; text-align: center; }
        .btn-use:hover, .btn-guide:hover { color: #fff; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="container">
        <header class="text-center mb-5">
            <h1 class="display-5">All AI Tools Directory</h1>
            <p class="text-muted">Pre-rendered static index powered by allalo AI build engine.</p>
        </header>
        <div class="row g-4">
            ${toolCardsHTML || '<div class="col-12 text-center text-muted">No static tools rendered.</div>'}
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync('./tools.html', toolsPageHTML, 'utf8');
console.log('✅ Success: tools.html generated.');

// ২. অটোমেটিক sitemap.xml জেনারেট করা
const sitemapURLs = tools.map(tool => {
    let toolUrl = tool.link || tool.url || '';
    if (!toolUrl.startsWith('http')) {
        toolUrl = `https://ai.allalo.com${toolUrl.startsWith('/') ? '' : '/'}${toolUrl}`;
    }
    return `    <url>
        <loc>${escapeXml(toolUrl)}</loc>
        <priority>0.8</priority>
    </url>`;
}).join('\n');

const staticPages = [
    'https://ai.allalo.com/',
    'https://ai.allalo.com/about.html',
    'https://ai.allalo.com/blog.html',
    'https://ai.allalo.com/toolspro.html',
    'https://ai.allalo.com/privacy-policy.html',
    'https://ai.allalo.com/terms.html'
].map(url => `    <url>\n        <loc>${url}</loc>\n        <priority>1.0</priority>\n    </url>`).join('\n');

const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages}
${sitemapURLs}
</urlset>`;

fs.writeFileSync('./sitemap.xml', sitemapXML, 'utf8');
console.log('✅ Success: sitemap.xml generated.');