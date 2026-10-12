/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PUNJAB FILES · ONE-FILE MCP SERVER
 *  Lets Claude manage your news articles on command.
 *
 *  SETUP (3 steps):
 *   1. Put this file in your backend folder (next to server.js / index.js).
 *   2. Run:   npm i @modelcontextprotocol/sdk zod
 *   3. In your server file, AFTER mongoose.connect and your models are loaded, add ONE line:
 *          app.use(require("./punjabFilesMcp.cjs"));                     // CommonJS
 *      or  import mcp from "./punjabFilesMcp.cjs";  app.use(mcp);        // ES modules
 *
 *  Then set MCP_SECRET below (or in .env), deploy, and add this URL in Claude as a
 *  custom connector:   https://YOUR-API-DOMAIN/mcp/YOUR_MCP_SECRET
 *
 *  It finds your news model automatically (Article / News / Post / Blog) and
 *  guesses field names (title, slug, image/thumbnail, isBreaking/breaking, …).
 *  Ask Claude to run "describe_schema" after connecting to check what it found.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ===== SETTINGS (optional: you can also put these in .env) =====
const MCP_SECRET = process.env.MCP_SECRET || "ab05be1985534cb8718394137f6554345d3a04e81c514ab5";
const SITE_URL = process.env.SITE_URL || "https://www.punjabfileshd.com";
const ARTICLE_URL = (slug) => `${SITE_URL}/news/${slug}`; // how article links look on your site
const ARTICLE_MODEL = process.env.MCP_ARTICLE_MODEL || ""; // leave empty to auto-detect
const CATEGORY_MODEL = process.env.MCP_CATEGORY_MODEL || ""; // leave empty to auto-detect
// ================================================================

const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StreamableHTTPServerTransport } = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const { z } = require("zod");

// ─── auto-detection ──────────────────────────────────────────────────────────
const findModel = (wanted, guesses) => {
  const names = Object.keys(mongoose.models);
  const list = wanted ? [wanted] : guesses;
  for (const g of list) {
    const hit = names.find((n) => n.toLowerCase() === g.toLowerCase());
    if (hit) return mongoose.models[hit];
  }
  return null;
};

const pick = (paths, candidates, exclude = []) =>
  candidates.find((c) => paths[c] && !exclude.includes(c)) || null;

let cache = null;
function schema() {
  if (cache) return cache;
  const Article = findModel(ARTICLE_MODEL, ["Article", "News", "NewsArticle", "NewsPost", "Post", "Blog", "Story"]);
  if (!Article) {
    throw new Error(
      `No news model found. Registered models: ${Object.keys(mongoose.models).join(", ") || "(none - is this file loaded after your models?)"}. Set ARTICLE_MODEL at the top of punjabFilesMcp.cjs.`
    );
  }
  const p = Article.schema.paths;
  const F = {};
  F.title = pick(p, ["title", "headline", "heading", "name"]);
  F.slug = pick(p, ["slug", "urlSlug", "permalink", "url_slug"]);
  F.content = pick(p, ["content", "body", "fullDescription", "details", "text", "description", "news"]);
  F.summary = pick(p, ["summary", "excerpt", "shortDescription", "short_description", "subtitle", "subTitle", "description", "metaDescription"], [F.content]);
  F.category = pick(p, ["category", "categoryName", "categories", "section", "categoryId"]);
  F.tags = pick(p, ["tags", "keywords"]);
  F.image = pick(p, ["image", "thumbnail", "featuredImage", "coverImage", "imageUrl", "image_url", "img", "banner", "photo"]);
  F.video = pick(p, ["video", "videoUrl", "youtubeUrl", "youtube", "video_url"]);
  F.author = pick(p, ["author", "authorName", "reporter", "writer", "createdBy"]);
  F.status = pick(p, ["status", "state"]);
  F.publishedFlag = pick(p, ["isPublished", "published", "isActive", "active", "isLive"]);
  F.isBreaking = pick(p, ["isBreaking", "breaking", "breakingNews", "isBreakingNews", "is_breaking"]);
  F.isFeatured = pick(p, ["isFeatured", "featured", "isTrending", "trending", "isTop", "topNews"]);
  F.publishedAt = pick(p, ["publishedAt", "publishDate", "publishedDate", "date"]);
  F.views = pick(p, ["views", "viewCount", "views_count", "totalViews"]);

  // category stored as ObjectId reference?
  const catPath = F.category && p[F.category];
  const catRef = catPath && (catPath.options?.ref || catPath.caster?.options?.ref);
  const catIsArray = catPath && catPath.instance === "Array";
  const Category = catRef ? mongoose.models[catRef] : findModel(CATEGORY_MODEL, ["Category", "Categories", "NewsCategory", "Section"]);
  const CF = Category
    ? {
        name: pick(Category.schema.paths, ["name", "title", "categoryName", "label"]),
        slug: pick(Category.schema.paths, ["slug", "urlSlug"]),
      }
    : null;

  const statusEnum = F.status ? p[F.status].enumValues || [] : [];
  cache = { Article, Category, F, CF, catRef: !!catRef, catIsArray, statusEnum, paths: Object.keys(p) };
  return cache;
}

// ─── helpers ─────────────────────────────────────────────────────────────────
const ok = (d) => ({ content: [{ type: "text", text: JSON.stringify(d, null, 2) }] });
const fail = (m) => ({ content: [{ type: "text", text: `Error: ${m}` }], isError: true });
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ci = (s) => new RegExp(`^${esc(s)}$`, "i");
const isId = (s) => mongoose.isValidObjectId(s) && String(s).length === 24;

function slugify(t = "") {
  const s = t.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s-]+/g, "-").slice(0, 80);
  return s || `news-${Date.now().toString(36)}`; // Punjabi/Hindi titles → unique id
}

async function uniqueSlug(base, excludeId) {
  const { Article, F } = schema();
  let s = base, n = 2;
  while (await Article.exists({ [F.slug]: s, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) s = `${base}-${n++}`;
  return s;
}

async function findArticle(ref) {
  const { Article, F } = schema();
  if (isId(ref)) {
    const d = await Article.findById(ref);
    if (d) return d;
  }
  return F.slug ? Article.findOne({ [F.slug]: ref }) : null;
}

const STATUS_WORDS = {
  published: ["published", "publish", "live", "active", "approved"],
  draft: ["draft", "pending", "unpublished", "inactive"],
  archived: ["archived", "archive", "deleted", "hidden", "inactive", "draft"],
};
function applyStatus(doc, wanted) {
  const { F, statusEnum } = schema();
  if (F.status) {
    let v = wanted;
    if (statusEnum.length) v = STATUS_WORDS[wanted].find((w) => statusEnum.includes(w)) || statusEnum.find((e) => e.toLowerCase() === wanted);
    if (!v) throw new Error(`Your status field only allows: ${statusEnum.join(", ")}`);
    doc[F.status] = v;
  }
  if (F.publishedFlag) doc[F.publishedFlag] = wanted === "published";
  if (!F.status && !F.publishedFlag) throw new Error("No status/published field found in your schema");
  if (wanted === "published" && F.publishedAt && !doc[F.publishedAt]) doc[F.publishedAt] = new Date();
}
function readStatus(doc) {
  const { F } = schema();
  if (F.status) return doc[F.status];
  if (F.publishedFlag) return doc[F.publishedFlag] ? "published" : "draft";
  return undefined;
}

// category name/slug/id → value to store
async function resolveCategory(input) {
  const { Category, CF, catRef, catIsArray } = schema();
  if (input == null) return undefined;
  const one = async (name) => {
    if (!Category) return name; // free-text categories
    const or = [];
    if (isId(name)) or.push({ _id: name });
    if (CF.name) or.push({ [CF.name]: ci(name) });
    if (CF.slug) or.push({ [CF.slug]: String(name).toLowerCase() });
    const c = await Category.findOne({ $or: or }).lean();
    if (!c) {
      const all = await Category.find().lean();
      throw new Error(`Unknown category "${name}". Available: ${all.map((x) => x[CF.name] || x._id).join(", ")}`);
    }
    return catRef ? c._id : c[CF.name];
  };
  const arr = Array.isArray(input) ? input : [input];
  const vals = await Promise.all(arr.map(one));
  return catIsArray ? vals : vals[0];
}

async function categoryLabel(val) {
  const { Category, CF, catRef } = schema();
  if (!catRef || !Category || val == null) return val;
  const ids = Array.isArray(val) ? val : [val];
  const cats = await Category.find({ _id: { $in: ids } }).lean();
  const names = cats.map((c) => c[CF.name] || String(c._id));
  return Array.isArray(val) ? names : names[0];
}

async function brief(d) {
  const { F } = schema();
  return {
    id: String(d._id),
    title: F.title && d[F.title],
    slug: F.slug && d[F.slug],
    category: F.category && (await categoryLabel(d[F.category])),
    status: readStatus(d),
    isBreaking: F.isBreaking ? d[F.isBreaking] : undefined,
    isFeatured: F.isFeatured ? d[F.isFeatured] : undefined,
    date: (F.publishedAt && d[F.publishedAt]) || d.createdAt,
    views: F.views ? d[F.views] : undefined,
    url: F.slug && d[F.slug] ? ARTICLE_URL(d[F.slug]) : undefined,
  };
}

// map tool fields → schema fields; "extra" lets Claude set any other real schema field
async function buildUpdate(input, extra) {
  const { F, paths } = schema();
  const out = {};
  for (const k of ["title", "summary", "content", "tags", "image", "video", "author", "isBreaking", "isFeatured"]) {
    if (input[k] !== undefined) {
      if (!F[k]) throw new Error(`Your schema has no field for "${k}"`);
      out[F[k]] = input[k];
    }
  }
  if (input.category !== undefined) {
    if (!F.category) throw new Error("Your schema has no category field");
    out[F.category] = await resolveCategory(input.category);
  }
  for (const [k, v] of Object.entries(extra || {})) {
    if (!paths.includes(k) || ["_id", "__v"].includes(k)) throw new Error(`"${k}" is not a field in your schema`);
    out[k] = v;
  }
  return out;
}

// ─── MCP tools ───────────────────────────────────────────────────────────────
const fields = {
  title: z.string().optional().describe("Headline (Punjabi, Hindi or English)"),
  summary: z.string().optional().describe("Short 1-2 sentence summary"),
  content: z.string().optional().describe("Full article body"),
  category: z.union([z.string(), z.array(z.string())]).optional().describe("Category name (see list_categories)"),
  tags: z.array(z.string()).optional(),
  image: z.string().optional().describe("Image URL"),
  video: z.string().optional().describe("Video / YouTube URL"),
  author: z.string().optional(),
  isBreaking: z.boolean().optional().describe("Show in breaking-news ticker"),
  isFeatured: z.boolean().optional().describe("Show as featured/top story"),
  extra: z.record(z.string(), z.any()).optional().describe("Any other schema field by its exact name (see describe_schema)"),
};

const wrap = (fn) => async (args) => {
  try {
    return await fn(args);
  } catch (e) {
    return fail(e.message);
  }
};

function createServer() {
  const s = new McpServer({ name: "punjab-files", version: "1.0.0" });
  const ro = { readOnlyHint: true };

  s.registerTool("describe_schema", {
    description: "Show which model and fields were auto-detected on the site, plus every field in the schema. Run this first if something looks wrong.",
    inputSchema: {}, annotations: ro,
  }, wrap(async () => {
    const { Article, Category, F, CF, statusEnum, paths, catRef } = schema();
    return ok({ articleModel: Article.modelName, categoryModel: Category?.modelName || "(none: free-text categories)", categoryIsReference: catRef, detectedFields: F, categoryFields: CF, allowedStatus: statusEnum, allArticleFields: paths });
  }));

  s.registerTool("list_categories", { description: "List news categories.", inputSchema: {}, annotations: ro },
    wrap(async () => {
      const { Article, Category, CF, F } = schema();
      if (Category) return ok((await Category.find().lean()).map((c) => ({ id: String(c._id), name: c[CF.name], slug: CF.slug ? c[CF.slug] : undefined })));
      return ok(F.category ? await Article.distinct(F.category) : []);
    }));

  s.registerTool("create_category", {
    description: "Add a new category (only if the site has a Category model).",
    inputSchema: { name: z.string().min(2), slug: z.string().optional() },
  }, wrap(async ({ name, slug }) => {
    const { Category, CF } = schema();
    if (!Category) return fail("Categories are free text on this site; just use the new name when creating an article.");
    const doc = { [CF.name]: name };
    if (CF.slug) doc[CF.slug] = slug || slugify(name);
    return ok({ created: await Category.create(doc) });
  }));

  s.registerTool("list_articles", {
    description: "List or search articles, newest first.",
    inputSchema: {
      search: z.string().optional().describe("Text in the title"),
      status: z.enum(["published", "draft", "archived", "any"]).optional(),
      category: z.string().optional(),
      isBreaking: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      limit: z.number().int().min(1).max(100).optional(),
      page: z.number().int().min(1).optional(),
    }, annotations: ro,
  }, wrap(async ({ search, status, category, isBreaking, isFeatured, limit = 20, page = 1 }) => {
    const { Article, F, statusEnum } = schema();
    const q = {};
    if (search && F.title) q[F.title] = new RegExp(esc(search), "i");
    if (category && F.category) q[F.category] = await resolveCategory(category).then((v) => (Array.isArray(v) ? { $in: v } : v));
    if (isBreaking !== undefined && F.isBreaking) q[F.isBreaking] = isBreaking;
    if (isFeatured !== undefined && F.isFeatured) q[F.isFeatured] = isFeatured;
    if (status && status !== "any") {
      if (F.status) {
        const v = statusEnum.length ? STATUS_WORDS[status].find((w) => statusEnum.includes(w)) : status;
        q[F.status] = v ?? status;
      } else if (F.publishedFlag) q[F.publishedFlag] = status === "published";
    }
    const [total, docs] = await Promise.all([
      Article.countDocuments(q),
      Article.find(q).sort({ [F.publishedAt || "_id"]: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ]);
    return ok({ total, page, results: await Promise.all(docs.map(brief)) });
  }));

  s.registerTool("get_article", {
    description: "Get one full article by slug or id.",
    inputSchema: { ref: z.string().describe("Slug or id") }, annotations: ro,
  }, wrap(async ({ ref }) => {
    const d = await findArticle(ref);
    if (!d) return fail("Article not found");
    const o = d.toObject();
    return ok({ ...(await brief(o)), full: o });
  }));

  s.registerTool("create_article", {
    description: "Create a news article. Saved as draft unless publish is true.",
    inputSchema: {
      ...fields,
      title: z.string().min(3),
      slug: z.string().optional().describe("Lowercase English slug with hyphens; auto-made from title if omitted"),
      publish: z.boolean().optional(),
    },
  }, wrap(async ({ slug, publish, extra, ...input }) => {
    const { Article, F } = schema();
    const doc = new Article(await buildUpdate(input, extra));
    if (F.slug) doc[F.slug] = await uniqueSlug(slugify(slug || input.title));
    applyStatus(doc, publish ? "published" : "draft");
    await doc.save();
    return ok({ created: await brief(doc) });
  }));

  s.registerTool("update_article", {
    description: "Edit an article (by slug or id). Only fields you send change.",
    inputSchema: { ref: z.string().describe("Current slug or id"), slug: z.string().optional().describe("New slug"), ...fields },
  }, wrap(async ({ ref, slug, extra, ...input }) => {
    const { F } = schema();
    const d = await findArticle(ref);
    if (!d) return fail("Article not found");
    d.set(await buildUpdate(input, extra));
    if (slug && F.slug) d[F.slug] = await uniqueSlug(slugify(slug), d._id);
    await d.save();
    return ok({ updated: await brief(d) });
  }));

  s.registerTool("set_status", {
    description: "Publish, unpublish (draft) or archive an article (archive = hidden, recoverable).",
    inputSchema: { ref: z.string(), status: z.enum(["published", "draft", "archived"]) },
  }, wrap(async ({ ref, status }) => {
    const d = await findArticle(ref);
    if (!d) return fail("Article not found");
    applyStatus(d, status);
    await d.save();
    return ok({ updated: await brief(d) });
  }));

  s.registerTool("set_highlight", {
    description: "Turn breaking-news ticker and/or featured on or off.",
    inputSchema: { ref: z.string(), isBreaking: z.boolean().optional(), isFeatured: z.boolean().optional() },
  }, wrap(async ({ ref, isBreaking, isFeatured }) => {
    const d = await findArticle(ref);
    if (!d) return fail("Article not found");
    d.set(await buildUpdate({ isBreaking, isFeatured }));
    await d.save();
    return ok({ updated: await brief(d) });
  }));

  s.registerTool("delete_article", {
    description: "PERMANENTLY delete an article. Prefer set_status 'archived' unless the user explicitly asks for permanent deletion.",
    inputSchema: { ref: z.string(), confirm: z.literal(true) },
    annotations: { destructiveHint: true },
  }, wrap(async ({ ref }) => {
    const d = await findArticle(ref);
    if (!d) return fail("Article not found");
    const b = await brief(d);
    await d.deleteOne();
    return ok({ deleted: b });
  }));

  s.registerTool("site_stats", {
    description: "Article counts and the 5 most-viewed articles.",
    inputSchema: {}, annotations: ro,
  }, wrap(async () => {
    const { Article, F } = schema();
    const total = await Article.countDocuments();
    const byStatus = F.status
      ? await Article.aggregate([{ $group: { _id: `$${F.status}`, n: { $sum: 1 } } }])
      : F.publishedFlag ? await Article.aggregate([{ $group: { _id: `$${F.publishedFlag}`, n: { $sum: 1 } } }]) : [];
    const top = F.views ? await Article.find().sort({ [F.views]: -1 }).limit(5).lean() : [];
    return ok({ total, byStatus: Object.fromEntries(byStatus.map((x) => [String(x._id), x.n])), mostViewed: await Promise.all(top.map(brief)) });
  }));

  return s;
}

// ─── HTTP endpoint ───────────────────────────────────────────────────────────
const router = express.Router();
const same = (a = "", b = "") => {
  const A = Buffer.from(String(a)), B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
};
const getSecret = () => process.env.MCP_SECRET || MCP_SECRET;
const isSecretOk = () => {
  const s = getSecret();
  return Boolean(s && s.length >= 24 && !s.startsWith("PASTE_"));
};

async function handle(req, res) {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => { transport.close(); server.close(); });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (e) {
    console.error("[MCP]", e);
    if (!res.headersSent) res.status(500).json({ jsonrpc: "2.0", error: { code: -32603, message: "Internal error" }, id: null });
  }
}

const json = express.json({ limit: "5mb" });
// claude.ai custom connector:  /mcp/<secret>
router.post("/mcp/:key", json, (req, res) => (isSecretOk() && same(req.params.key, getSecret()) ? handle(req, res) : res.status(404).end()));
// Claude Code / other clients:  /mcp  with  Authorization: Bearer <secret>
router.post("/mcp", json, (req, res) => {
  const t = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  return isSecretOk() && same(t, getSecret()) ? handle(req, res) : res.status(401).json({ error: "Unauthorized" });
});
router.all(["/mcp", "/mcp/:key"], (_req, res) => res.status(405).json({ error: "Method not allowed" }));

module.exports = router;
module.exports.default = router;
