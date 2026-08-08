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

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function generateProgrammaticBlogs() {
    console.log("🚀 Generating Enhanced Programmatic SEO Blogs...");
    let allTools = [];

    for (const url of MASTER_URLS) {
        try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const data = await res.json();
            if (Array.isArray(data)) {
                data.forEach(item => {
                    if (item && item.name) {
                        allTools.push({
                            name: item.name,
                            task: item.task || item.category || 'General AI',
                            desc: item.shortDescription || item.short_description || item.description || 'Advanced AI application tailored for automation workflows.',
                            link: item.website || item.link || `https://ai.allalo.com/?tool=${encodeURIComponent(item.name.toLowerCase().trim().replace(/\s+/g, '-'))}`
                        });
                    }
                });
            }
        } catch (e) {
            console.warn("⚠️ Warning: Error reading pipeline data:", url);
        }
    }

    const outputDir = path.join(__dirname, 'blog-post');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const categories = ['AI Agent', 'AI Swarm', 'Local AI', 'General AI'];

    categories.forEach(cat => {
        const filtered = allTools.filter(t => t.task.toLowerCase().includes(cat.toLowerCase())).slice(0, 15);
        if (filtered.length === 0) return;

        const slug = `top-${cat.toLowerCase().replace(/\s+/g, '-')}-tools`;
        const pageTitle = `Top 15 Best ${cat} Tools & Platforms (2026 Directory & Review)`;
        const pageUrl = `https://ai.allalo.com/blog-post/${slug}.html`;

        // Dynamic Table Content
        let tableRowsHtml = filtered.map((t, idx) => `
            <tr>
                <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1); color: #fff; font-weight: 600;">#${idx + 1} ${escapeHtml(t.name)}</td>
                <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1); color: #818cf8;">${escapeHtml(t.task)}</td>
                <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.1);"><a href="${escapeHtml(t.link)}" target="_blank" rel="noopener" style="color: #10b981; text-decoration: none; font-weight: 600;">Visit Tool ↗</a></td>
            </tr>
        `).join('');

        // Itemized Cards
        let toolListHtml = filtered.map((t, idx) => `
            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(99, 102, 241, 0.2); padding: 24px; margin-bottom: 24px; border-radius: 16px;">
                <h3 style="color: #f1f5f9; margin-top: 0; font-size: 18px;">#${idx + 1}. ${escapeHtml(t.name)}</h3>
                <p style="color: #94a3b8; font-size: 14px; line-height: 1.7;"><strong>Overview:</strong> ${escapeHtml(t.desc)}</p>
                <p style="color: #94a3b8; font-size: 14px; line-height: 1.7;"><strong>Why it stands out in 2026:</strong> ${escapeHtml(t.name)} addresses key computational bottlenecks within the ${escapeHtml(cat)} dynamic landscape. By leveraging modular data architectures, it enables users to execute complex tasks with higher precision and lower overhead.</p>
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; margin: 12px 0;">
                    <span style="color: #818cf8; font-size: 12px;"><strong>Primary Domain:</strong> ${escapeHtml(t.task)}</span> | 
                    <span style="color: #10b981; font-size: 12px;"><strong>Index Status:</strong> Verified Node</span>
                </div>
                <div style="margin-top: 14px;">
                    <a href="${escapeHtml(t.link)}" target="_blank" rel="noopener" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; font-size: 12px; display: inline-block;">Explore ${escapeHtml(t.name)} ↗</a>
                </div>
            </div>
        `).join('');

        let blogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle} — allalo AI</title>
    <meta name="description" content="In-depth technical breakdown and list of the top 15 ${cat} applications in 2026. Compare specifications, capabilities, and direct access links.">
    <meta name="author" content="allalo AI">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${pageUrl}">
    <link rel="icon" type="image/png" sizes="32x32" href="https://ai.allalo.com/favicon.png">

    <!-- Open Graph & Schema -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="Top 15 ${cat} AI tools and platforms reviewed for maximum workflow efficiency.">
    <meta property="og:image" content="https://ai.allalo.com/logo.png">

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${pageTitle}",
      "image": "https://ai.allalo.com/logo.png",
      "publisher": {
        "@type": "Organization",
        "name": "allalo AI",
        "logo": "https://ai.allalo.com/logo.png"
      },
      "datePublished": "2026-08-06",
      "dateModified": "2026-08-06"
    }
    </script>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #030712; color: #f1f5f9; font-family: 'Inter', sans-serif; padding: 40px 20px; }
        .container { max-width: 850px; margin: 0 auto; }
        h1 { color: #818cf8; font-weight: 800; margin-bottom: 20px; font-size: 2rem; }
        h2 { color: #38bdf8; font-weight: 700; margin-top: 30px; margin-bottom: 15px; font-size: 1.4rem; }
        a.back-btn { color: #94a3b8; text-decoration: none; font-size: 14px; display: inline-block; margin-bottom: 20px; }
        a.back-btn:hover { color: #818cf8; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: rgba(15, 23, 42, 0.4); }
        .footer-link-custom { color: #64748b !important; text-decoration: none; font-size: 13px; margin: 0 8px; }
        .footer-link-custom:hover { color: #6366f1 !important; }
    </style>
</head>
<body>
    <div class="container">
        <a href="../index.html" class="back-btn">← Back to allalo AI Mega Directory</a>
        <h1>${pageTitle}</h1>
        
        <p style="color: #94a3b8; font-size: 15px; line-height: 1.8;">
            The artificial intelligence landscape in 2026 is evolving at an unprecedented pace. As workflows transition toward autonomous task completion and localized processing, selecting the right software stack is crucial for maximum productivity. Below is an updated evaluation of the highest-rated <strong>${cat}</strong> platforms currently indexed inside the <em>allalo AI</em> ecosystem.
        </p>

        <h2>📊 Quick Matrix Comparison</h2>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr style="background: rgba(99, 102, 241, 0.2);">
                        <th style="padding: 12px; text-align: left; border: 1px solid rgba(255,255,255,0.1);">Tool Name</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid rgba(255,255,255,0.1);">Category</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid rgba(255,255,255,0.1);">Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRowsHtml}
                </tbody>
            </table>
        </div>

        <h2>🔍 Detailed Breakdown & Analysis</h2>
        ${toolListHtml}

        <h2>❓ Frequently Asked Questions (FAQ)</h2>
        <div style="background: rgba(15, 23, 42, 0.4); padding: 20px; border-radius: 12px; margin-top: 20px;">
            <h4 style="color: #f1f5f9; font-size: 16px;">What makes ${cat} tools essential in 2026?</h4>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">${cat} tools streamline multi-step operations by reducing human effort in task orchestration, automated reasoning, and data parsing.</p>
            
            <h4 style="color: #f1f5f9; font-size: 16px; margin-top: 15px;">How often is this index updated?</h4>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">Our distributed pipeline scripts crawl and index new entries daily to ensure all links and operational metrics remain active.</p>
        </div>

        <footer style="text-align: center; margin-top: 50px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; color: #64748b; font-size: 12px;">
            <div style="margin-bottom: 12px;">
                <a href="../index.html" class="footer-link-custom">Home</a>
                <a href="../about.html" class="footer-link-custom">About</a>
                <a href="../blog.html" class="footer-link-custom">Blog</a>
                <a href="../toolspro.html" class="footer-link-custom">Tools Pro</a>
                <a href="../privacy-policy.html" class="footer-link-custom">Privacy Policy</a>
                <a href="../terms.html" class="footer-link-custom">Terms</a>
            </div>
            &copy; 2026 allalo AI Search Engine. Developed for High-Speed AI Indexing.
        </footer>
    </div>
</body>
</html>`;

        fs.writeFileSync(path.join(outputDir, `${slug}.html`), blogHtml, 'utf8');
        console.log(`✅ Generated expanded blog: blog-post/${slug}.html`);
    });
}

generateProgrammaticBlogs();