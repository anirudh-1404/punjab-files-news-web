import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://anirudhjoshidev_db_user:setT9HYt7WurLrxT@news-web-cluster.rda9yib.mongodb.net/punjab_files?retryWrites=true&w=majority&appName=news-web-cluster";

let cachedConnection = null;

async function getMongoConnection() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }
  cachedConnection = await mongoose.connect(MONGO_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000
  });
  return cachedConnection;
}

const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export default async function handler(req, res) {
  try {
    const slug = req.query.slug || "";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "punjab-files-news-web-1b3.vercel.app";
    const proto = req.headers["x-forwarded-proto"] || "https";
    const siteBaseUrl = `${proto}://${host}`;
    const defaultLogoUrl = `${siteBaseUrl}/logo-updated.png`;

    // 1. If homepage / website URL is shared
    if (!slug || slug === "home" || slug === "default") {
      const homeTitle = "Punjab Files | Your 24h News Source";
      const homeDesc = "ਪੰਜਾਬ ਫਾਈਲਜ਼ - 24 ਘੰਟੇ ਨਿਰਪੱਖ, ਸੱਚੀਆਂ ਅਤੇ ਭਰੋਸੇਯੋਗ ਜ਼ਮੀਨੀ ਖ਼ਬਰਾਂ, ਮੁੱਖ ਵਾਕ ਅਤੇ ਲਾਈਵ ਟੀਵੀ।";

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");

      const homeHtml = `<!DOCTYPE html>
<html lang="pa" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(homeTitle)}</title>
  <meta name="description" content="${escapeHtml(homeDesc)}">

  <!-- Open Graph Meta Tags (WhatsApp, Facebook, LinkedIn, Telegram) -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Punjab Files">
  <meta property="og:title" content="${escapeHtml(homeTitle)}">
  <meta property="og:description" content="${escapeHtml(homeDesc)}">
  <meta property="og:image" content="${escapeHtml(defaultLogoUrl)}">
  <meta property="og:image:secure_url" content="${escapeHtml(defaultLogoUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="Punjab Files News Logo">
  <meta property="og:url" content="${escapeHtml(siteBaseUrl)}">

  <!-- Twitter / X Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@punjabfiles">
  <meta name="twitter:title" content="${escapeHtml(homeTitle)}">
  <meta name="twitter:description" content="${escapeHtml(homeDesc)}">
  <meta name="twitter:image" content="${escapeHtml(defaultLogoUrl)}">

  <!-- Instant Redirection for Human Visitors -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(siteBaseUrl)}">
  <script>
    window.location.replace(${JSON.stringify(siteBaseUrl)});
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; text-align: center; padding: 40px 20px;">
  <p>Loading Punjab Files...</p>
</body>
</html>`;

      return res.status(200).send(homeHtml);
    }

    // 2. Fetch specific news article
    await getMongoConnection();
    const db = mongoose.connection.db;
    const articlesCollection = db.collection("articles");

    let article = null;
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        article = await articlesCollection.findOne({ _id: new mongoose.Types.ObjectId(slug) });
      } catch {}
    }

    if (!article) {
      article = await articlesCollection.findOne({ slug });
    }

    if (!article) {
      try {
        const decoded = decodeURIComponent(slug);
        article = await articlesCollection.findOne({ slug: decoded });
      } catch {}
    }

    if (!article) {
      const tsMatch = String(slug).match(/(\d{10,14})/);
      if (tsMatch) {
        article = await articlesCollection.findOne({ slug: { $regex: tsMatch[1] } });
      }
    }

    if (!article) {
      return res.redirect(siteBaseUrl);
    }

    const articleSlugOrId = article.slug || String(article._id);
    const targetUrl = `${siteBaseUrl}/news/${articleSlugOrId}`;

    let imageUrl = article.featuredImage || defaultLogoUrl;
    if (imageUrl.includes("res.cloudinary.com") && imageUrl.includes("/image/upload/")) {
      const uploadIdx = imageUrl.indexOf("/image/upload/");
      const prefix = imageUrl.substring(0, uploadIdx + "/image/upload/".length);
      let suffix = imageUrl.substring(uploadIdx + "/image/upload/".length);
      suffix = suffix.replace(/^(?:w_\d+,?|h_\d+,?|c_[a-z]+,?|q_[a-z0-9:]+,?|f_[a-z0-9]+,?|dpr_[a-z0-9.]+,?)+\//i, "");
      imageUrl = `${prefix}c_fill,w_1200,h_630,g_auto,f_jpg,q_auto:best/${suffix}`;
    } else if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
      imageUrl = `${siteBaseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    }

    const title = article.seoTitle || article.title || "Punjab Files | 24h News Source";
    const description =
      article.metaDescription ||
      article.excerpt ||
      (article.content ? String(article.content).replace(/<[^>]*>/g, "").slice(0, 180).trim() + "..." : "") ||
      "ਪੰਜਾਬ ਫਾਈਲਜ਼ - 24 ਘੰਟੇ ਨਿਰਪੱਖ, ਸੱਚੀਆਂ ਅਤੇ ਭਰੋਸੇਯੋਗ ਜ਼ਮੀਨੀ ਖ਼ਬਰਾਂ";

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");

    const html = `<!DOCTYPE html>
<html lang="pa" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">

  <!-- Open Graph Meta Tags (WhatsApp, Facebook, LinkedIn, Telegram) -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Punjab Files">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="${escapeHtml(title)}">
  <meta property="og:url" content="${escapeHtml(targetUrl)}">

  <!-- Twitter / X Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@punjabfiles">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
  <meta name="twitter:image:alt" content="${escapeHtml(title)}">

  <!-- Instant Browser Redirection for Human Visitors -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(targetUrl)}">
  <script>
    window.location.replace(${JSON.stringify(targetUrl)});
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center;">
  <div style="max-width: 460px; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    <div style="width: 38px; height: 38px; border: 3px solid #f1f5f9; border-top: 3px solid #b71c1c; border-radius: 50%; margin: 0 auto 16px; animation: spin 0.8s linear infinite;"></div>
    <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 800; color: #0f172a;">ਖ਼ਬਰ ਖੁੱਲ੍ਹ ਰਹੀ ਹੈ...</h3>
    <p style="margin: 0 0 16px; font-size: 13px; color: #64748b;">(Redirecting to Punjab Files...)</p>
    <a href="${escapeHtml(targetUrl)}" style="display: inline-block; background-color: #b71c1c; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 9px 20px; border-radius: 6px;">ਇੱਥੇ ਕਲਿੱਕ ਕਰੋ</a>
  </div>
  <style>
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</body>
</html>`;

    return res.status(200).send(html);
  } catch (error) {
    console.error("Vercel OG Handler Error:", error);
    const host = req.headers["x-forwarded-host"] || req.headers.host || "punjab-files-news-web-1b3.vercel.app";
    return res.redirect(`https://${host}`);
  }
}
