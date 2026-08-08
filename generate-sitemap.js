const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const MASTER_URLS = [
    'https://raw.githubusercontent.com/allaloai/allalo/refs/heads/main/assets/json/ai_ag_25k.json', 
    'https://raw.githubusercontent.com/allaloai/allalo/refs/heads/main/assets/json/ai_to_3k.json', 
    'https://raw.githubusercontent.com/allaloai/allalo/refs/heads/main/assets/json/ai_to_19k.json',
    'https://raw.githubusercontent.com/allaloai/allalo/refs/heads/main/assets/json/new_tools.json',
	'https://raw.githubusercontent.com/allaloai/allalo/refs/heads/main/assets/json/tools--blog--data.json',
	'https://raw.githubusercontent.com/allaloai/allalo/refs/heads/main/assets/json/bangla-tools.json'
	
];

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

async function generateSitemap() {
    console.log("🚀 Generating Dynamic Sitemap for Google Search Console...");
    let allTools = new Set();

    for (const url of MASTER_URLS) {
        try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const data = await res.json();
            if (Array.isArray(data)) {
                data.forEach(item => {
                    const name = item ? (item.name || item.title) : null;
                    if (name) {
                        const slug = encodeURIComponent(name.toLowerCase().trim().replace(/\s+/g, '-'));
                        allTools.add(slug);
                    }
                });
            }
        } catch (e) {
            console.warn("⚠️ Warning: Failed to parse pipeline for sitemap:", url);
        }
    }

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // ১. মূল স্ট্যাটিক পেজসমূহ
    const staticPages = [
        { url: 'https://ai.allalo.com/', freq: 'daily', priority: '1.0' },
        { url: 'https://ai.allalo.com/about.html', freq: 'monthly', priority: '0.7' },
        { url: 'https://ai.allalo.com/blog.html', freq: 'daily', priority: '0.9' },
        { url: 'https://ai.allalo.com/toolspro.html', freq: 'weekly', priority: '0.8' },
        { url: 'https://ai.allalo.com/privacy-policy.html', freq: 'monthly', priority: '0.5' },
        { url: 'https://ai.allalo.com/terms.html', freq: 'monthly', priority: '0.5' }
    ];

    staticPages.forEach(p => {
        sitemapXml += `  <url><loc>${p.url}</loc><changefreq>${p.freq}</changefreq><priority>${p.priority}</priority></url>\n`;
    });

    // ২. অটোমেটিক প্রোগ্রাম্যাটিক ব্লগ পেজসমূহ (blog-post/ ফোল্ডার স্ক্যান)
    const blogDir = path.join(__dirname, 'blog-post');
    if (fs.existsSync(blogDir)) {
        const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.html'));
        blogFiles.forEach(file => {
            sitemapXml += `  <url><loc>https://ai.allalo.com/blog-post/${escapeXml(file)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
        });
    }

    // ৩. ডাইনামিক টুল ইউআরএলসমূহ (21,821+ Unique Nodes)
    allTools.forEach(slug => {
        sitemapXml += `  <url><loc>https://ai.allalo.com/?tool=${slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
    });

    sitemapXml += `</urlset>`;

    fs.writeFileSync('sitemap.xml', sitemapXml, 'utf8');
    console.log(`✅ Success: sitemap.xml generated with ${allTools.size} tools & all site pages.`);
}

generateSitemap();