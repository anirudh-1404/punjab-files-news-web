import mongoose from "mongoose";
import Article from "../models/Article.js";
import { generateEnglishSlug } from "../utils/slugUtils.js";

async function autoMigrateSlugs() {
  try {
    const articles = await Article.find({ slug: { $regex: /[^\x00-\x7F]/ } });
    for (const art of articles) {
      const oldSlug = art.slug;
      const tsMatch = String(oldSlug).match(/-(\d{10,14})$/);
      let newSlug;
      if (tsMatch) {
        const base = generateEnglishSlug(art.title).replace(/-\w+$/, "");
        newSlug = `${base}-${tsMatch[1]}`;
      } else {
        newSlug = generateEnglishSlug(art.title);
      }
      art.slug = newSlug;
      await art.save({ validateBeforeSave: false });
      console.log(`[Slug Migration] Migrated "${oldSlug}" -> "${newSlug}"`);
    }
  } catch (err) {
    // Non-fatal background migration
  }
}

export const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to database");
    autoMigrateSlugs();
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};