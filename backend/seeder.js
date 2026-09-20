import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Article from "./models/Article.js";
import BreakingNews from "./models/BreakingNews.js";

dotenv.config();

const users = [
  {
    name: "ਮੁੱਖ ਪ੍ਰਬੰਧਕ (Admin)",
    email: "admin@punjabfiles.com",
    password: "AdminPassword123!",
    role: "admin",
    isActive: true
  },
  {
    name: "ਸੰਪਾਦਕੀ ਡੈਸਕ (Chief Editor)",
    email: "editor@punjabfiles.com",
    password: "EditorPassword123!",
    role: "editor",
    isActive: true
  },
  {
    name: "ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ (Field Reporter)",
    email: "reporter@punjabfiles.com",
    password: "ReporterPassword123!",
    role: "reporter",
    isActive: true
  }
];

const initialArticles = [
  {
    title: "ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ: ਵਿਰਾਸਤੀ ਮਾਰਗ ਦੇ ਨਵੀਨੀਕਰਨ ਪ੍ਰਾਜੈਕਟ ਨੂੰ ਮਨਜ਼ੂਰੀ, ਸ਼ਰਧਾਲੂਆਂ ਲਈ ਨਵੀਆਂ ਸਹੂਲਤਾਂ",
    slug: "amritsar-heritage-street-revamp-project",
    category: "punjab",
    punjabRegion: "majha",
    language: "pa",
    authorName: "ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ",
    featuredImage: "/img/index_800x400-image01.jpg",
    excerpt: "ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਆਉਣ ਵਾਲੇ ਦੇਸ਼-ਵਿਦੇਸ਼ ਦੇ ਸ਼ਰਧਾਲੂਆਂ ਦੀ ਸਹੂਲਤ ਲਈ ਵਿਸ਼ੇਸ਼ ਪ੍ਰਬੰਧ ਮੁਕੰਮਲ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ।",
    content: `ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਵਿਰਾਸਤੀ ਮਾਰਗ (Heritage Street) ਦੇ ਨਵੀਨੀਕਰਨ ਲਈ ਪੰਜਾਬ ਸਰਕਾਰ ਅਤੇ ਸਥਾਨਕ ਪ੍ਰਸ਼ਾਸਨ ਵੱਲੋਂ ਨਵੇਂ ਪ੍ਰੋਜੈਕਟ ਨੂੰ ਹਰੀ ਝੰਡੀ ਦੇ ਦਿੱਤੀ ਗਈ ਹੈ। ਇਸ ਪ੍ਰੋਜੈਕਟ ਤਹਿਤ ਪੈਦਲ ਚੱਲਣ ਵਾਲੇ ਸ਼ਰਧਾਲੂਆਂ ਲਈ ਛਾਂਦਾਰ ਰਸਤੇ, ਸਾਫ਼ ਪੀਣ ਵਾਲੇ ਪਾਣੀ ਦੇ ਕੂਲਰ, ਆਧੁਨਿਕ ਬੈਠਣ ਵਾਲੇ ਬੈਂਚ ਅਤੇ ਵਿਸ਼ੇਸ਼ ਸੂਚਨਾ ਕੇਂਦਰ ਸਥਾਪਤ ਕੀਤੇ ਜਾਣਗੇ।\n\nਜ਼ਿਲ੍ਹਾ ਪ੍ਰਸ਼ਾਸਨ ਦੇ ਅਧਿਕਾਰੀਆਂ ਨੇ ਦੱਸਿਆ ਕਿ ਸ਼ਹਿਰ ਦੀ ਟ੍ਰੈਫਿਕ ਵਿਵਸਥਾ ਨੂੰ ਸੁਚਾਰੂ ਬਣਾਉਣ ਲਈ ਈ-ਰਿਕਸ਼ਾ ਲਈ ਵਿਸ਼ੇਸ਼ ਲੇਨ ਤਿਆਰ ਕੀਤੀ ਜਾਵੇਗੀ।`,
    isBreaking: true,
    views: 2450,
    status: "published",
    publishedAt: new Date("2026-09-10T03:45:00Z")
  },
  {
    title: "ਲੁਧਿਆਣਾ ਤੇ ਬਠਿੰਡਾ: ਨਵੀਂ ਉਦਯੋਗਿਕ ਨੀਤੀ ਨਾਲ ਹਜ਼ਾਰਾਂ ਨੌਜਵਾਨਾਂ ਲਈ ਰੁਜ਼ਗਾਰ ਦੇ ਖੁੱਲ੍ਹਣਗੇ ਰਾਹ",
    slug: "ludhiana-bathinda-new-industrial-policy-jobs",
    category: "punjab",
    punjabRegion: "malwa",
    language: "pa",
    authorName: "ਅਮਨਦੀਪ ਕੌਰ",
    featuredImage: "/img/index_800x400-image02.jpg",
    excerpt: "ਟੈਕਸਟਾਈਲ ਅਤੇ ਆਟੋ ਪਾਰਟਸ ਸਨਅਤਾਂ ਨੂੰ ਨਿਵੇਸ਼ ਲਈ ਵਿਸ਼ੇਸ਼ ਛੋਟਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ ਦੇਣ ਦਾ ਵੱਡਾ ਫ਼ੈਸਲਾ।",
    content: `ਪੰਜਾਬ ਵਿੱਚ ਸਨਅਤੀ ਵਿਕਾਸ ਨੂੰ ਹੁਲਾਰਾ ਦੇਣ ਲਈ ਨਵੀਂ ਉਦਯੋਗਿਕ ਨੀਤੀ ਨੂੰ ਲਾਗੂ ਕੀਤਾ ਗਿਆ ਹੈ। ਇਸ ਨੀਤੀ ਦਾ ਸਭ ਤੋਂ ਵੱਧ ਲਾਭ ਮਾਲਵਾ ਖੇਤਰ ਦੇ ਲੁਧਿਆਣਾ ਅਤੇ ਬਠਿੰਡਾ ਜ਼ਿਲ੍ਹਿਆਂ ਨੂੰ ਮਿਲਣ ਦੀ ਉਮੀਦ ਹੈ।\n\nਉਦਯੋਗ ਮੰਤਰੀ ਨੇ ਕਿਹਾ ਕਿ ਆਉਣ ਵਾਲੇ 6 ਮਹੀਨਿਆਂ ਦੌਰਾਨ ਸੂਬੇ ਵਿੱਚ 25,000 ਤੋਂ ਵੱਧ ਨੌਜਵਾਨਾਂ ਨੂੰ ਸਿੱਧੇ ਅਤੇ ਅਸਿੱਧੇ ਤੌਰ 'ਤੇ ਨੌਕਰੀਆਂ ਮਿਲਣਗੀਆਂ।`,
    isBreaking: false,
    views: 2180,
    status: "published",
    publishedAt: new Date("2026-09-10T03:20:00Z")
  },
  {
    title: "ਜਲੰਧਰ: ਸਪੋਰਟਸ ਇੰਡਸਟਰੀ ਲਈ ਵਿਸ਼ੇਸ਼ ਕਲੱਸਟਰ ਪ੍ਰਾਜੈਕਟ ਸ਼ੁਰੂ, ਕੌਮਾਂਤਰੀ ਨਿਰਯਾਤ ਵਿੱਚ ਵਾਧਾ",
    slug: "jalandhar-sports-industry-cluster-project",
    category: "punjab",
    punjabRegion: "doaba",
    language: "pa",
    authorName: "ਜਸਵੀਰ ਸਿੰਘ ਸੰਧੂ",
    featuredImage: "/img/index_800x400-image03.jpg",
    excerpt: "ਵਿਸ਼ਵ ਪ੍ਰਸਿੱਧ ਖੇਡ ਸਮਾਨ ਬਣਾਉਣ ਵਾਲੇ ਨਿਰਮਾਤਾਵਾਂ ਨੂੰ ਵਿਸ਼ਵ ਪੱਧਰੀ ਟੈਸਟਿੰਗ ਲੈਬ ਅਤੇ ਕੱਚੇ ਮਾਲ ਦੀ ਸੁਵਿਧਾ ਮਿਲੇਗੀ।",
    content: `ਦੋਆਬਾ ਦੇ ਪ੍ਰਮੁੱਖ ਸ਼ਹਿਰ ਜਲੰਧਰ ਵਿੱਚ ਸਪੋਰਟਸ ਸਮਾਨ ਬਣਾਉਣ ਵਾਲੇ ਉਦਯੋਗਾਂ ਲਈ ਨਵਾਂ ਅਤਿ-ਆਧੁਨਿਕ ਟੈਸਟਿੰਗ ਕਲੱਸਟਰ ਸਥਾਪਤ ਕੀਤਾ ਗਿਆ ਹੈ। ਇਸ ਪ੍ਰਾਜੈਕਟ ਨਾਲ ਜਲੰਧਰ ਤੋਂ ਕ੍ਰਿਕਟ ਬੈਟ, ਫੁੱਟਬਾਲ, ਹਾਕੀ ਸਟਿਕਸ ਅਤੇ ਹੋਰ ਖੇਡ ਉਪਕਰਨਾਂ ਦਾ ਕੌਮਾਂਤਰੀ ਨਿਰਯਾਤ ਦੁੱਗਣਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।`,
    isBreaking: false,
    views: 1940,
    status: "published",
    publishedAt: new Date("2026-09-10T02:40:00Z")
  },
  {
    title: "ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਤੋਂ ਅੱਜ ਦਾ ਪਵਿੱਤਰ ਮੁੱਖਵਾਕ: ਗੁਰੂ ਕਿਰਪਾ ਨਾਲ ਜੀਵਨ ਵਿੱਚ ਆਨੰਦ",
    slug: "sri-darbar-sahib-amrit-vele-da-mukhwak-today",
    category: "religion",
    language: "pa",
    authorName: "ਸੰਪਾਦਕੀ ਧਰਮ ਡੈਸਕ",
    featuredImage: "/img/darbar-sahib-mukhwak.jpg",
    excerpt: "ਸੋਰਠਿ ਮਹਲਾ ੫ ਘਰੁ ੨ ਚਉਪਦੇ ॥ ਗੁਰੁ ਪੂਰਾ ਭੇਟਿਆ ਵਡਭਾਗੀ ਮਨਹਿ ਭਇਆ ਪਰਗਾਸਾ ॥ ਅੰਗ ੬੫੪",
    content: `ਅੱਜ ਅੰਮ੍ਰਿਤ ਵੇਲੇ ਸੱਚਖੰਡ ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ ਤੋਂ ਆਇਆ ਪਵਿੱਤਰ ਮੁੱਖ ਵਾਕ (ਹੁਕਮਨਾਮਾ ਸਾਹਿਬ) ਸੋਰਠਿ ਮਹਲਾ ੫, ਪਵਿੱਤਰ ਅੰਗ ੬੫੪ 'ਤੇ ਸੁਸ਼ੋਭਿਤ ਹੈ।\n\nਸੋਰਠਿ ਮਹਲਾ ੫ ਘਰੁ ੨ ਚਉਪਦੇ\nੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥\nਗੁਰੁ ਪੂਰਾ ਭੇਟਿਆ ਵਡਭਾਗੀ ਮਨਹਿ ਭਇਆ ਪਰਗਾਸਾ ॥\nਕੋਇ ਨ ਪਹੁਚਨਹਾਰਾ ਦੂਜਾ ਅਪਨੇ ਠਾਕੁਰ ਕਾ ਭਰਵਾਸਾ ॥੧॥\nਅਪਨੇ ਸੇਵਕ ਕੀ ਆਪੇ ਰਾਖੈ ਨਿਮਖ ਨ ਬਿਸਰੈ ਸਾਸਾ ॥\nਹਰਿ ਕਾ ਨਾਮੁ ਜਪਹੁ ਮੇਰੇ ਮੀਤਾ ਨਾਨਕ ਕੀ ਅਰਦਾਸਾ ॥੨॥`,
    isBreaking: false,
    views: 3120,
    status: "published",
    publishedAt: new Date("2026-09-10T01:00:00Z")
  },
  {
    title: "ਸ੍ਰੀ ਅਨੰਦਪੁਰ ਸਾਹਿਬ ਤੇ ਕੀਰਤਪੁਰ ਸਾਹਿਬ: ਇਤਿਹਾਸਕ ਗੁਰਦੁਆਰਾ ਸਾਹਿਬਾਨ ਦੇ ਸੁੰਦਰੀਕਰਨ ਦਾ ਕਾਰਜ ਆਰੰਭ",
    slug: "anandpur-sahib-historic-gurdwaras-restoration",
    category: "religion",
    language: "pa",
    authorName: "ਤਰਲੋਚਨ ਸਿੰਘ",
    featuredImage: "/img/index_800x400-image04.jpg",
    excerpt: "ਸ਼੍ਰੋਮਣੀ ਗੁਰਦੁਆਰਾ ਪ੍ਰਬੰਧਕ ਕਮੇਟੀ ਵੱਲੋਂ ਪੁਰਾਤਨ ਵਿਰਾਸਤੀ ਇਮਾਰਤਸਾਜ਼ੀ ਦੀ ਸਾਂਭ-ਸੰਭਾਲ ਲਈ ਮਾਹਿਰ ਟੀਮਾਂ ਤਾਇਨਾਤ।",
    content: `ਖਾਲਸੇ ਦੀ ਪਵਿੱਤਰ ਜਨਮ ਭੂਮੀ ਤਖ਼ਤ ਸ੍ਰੀ ਕੇਸਗੜ੍ਹ ਸਾਹਿਬ, ਸ੍ਰੀ ਅਨੰਦਪੁਰ ਸਾਹਿਬ ਵਿਖੇ ਸ਼ਰਧਾਲੂਆਂ ਦੀ ਆਮਦ ਨੂੰ ਮੁੱਖ ਰੱਖਦਿਆਂ ਵਿਸ਼ੇਸ਼ ਵਿਕਾਸ ਕਾਰਜ ਸ਼ੁਰੂ ਕੀਤੇ ਗਏ ਹਨ।`,
    isBreaking: false,
    views: 1820,
    status: "published",
    publishedAt: new Date("2026-09-09T18:00:00Z")
  },
  {
    title: "ਕੌਮਾਂਤਰੀ ਪੰਜਾਬੀ ਡਾਇਸਪੋਰਾ: ਕੈਨੇਡਾ ਤੇ ਯੂਕੇ ਵਿੱਚ ਪੰਜਾਬੀ ਨੌਜਵਾਨਾਂ ਨੇ ਮਾਰੀਆਂ ਮੱਲਾਂ",
    slug: "punjabi-diaspora-achievements-canada-uk",
    category: "world",
    language: "pa",
    authorName: "ਹਰਪ੍ਰੀਤ ਕੌਰ ਲੰਡਨ",
    featuredImage: "/img/index_800x400-image05.jpg",
    excerpt: "ਵਿਦੇਸ਼ਾਂ ਵਿੱਚ ਵਸਦੇ ਪੰਜਾਬੀ ਵਿਗਿਆਨੀਆਂ ਅਤੇ ਉੱਦਮੀਆਂ ਨੇ ਸਿਲੀਕਾਨ ਵੈਲੀ ਅਤੇ ਬ੍ਰਿਟਿਸ਼ ਪਾਰਲੀਮੈਂਟ ਵਿੱਚ ਮਾਣ ਵਧਾਇਆ।",
    content: `ਵਿਦੇਸ਼ਾਂ ਵਿੱਚ ਵਸਦੇ ਪੰਜਾਬੀਆਂ ਨੇ ਇੱਕ ਵਾਰ ਫਿਰ ਆਪਣੀ ਮਿਹਨਤ ਅਤੇ ਕਾਬਲੀਅਤ ਦਾ ਲੋਹਾ ਮਨਵਾਇਆ ਹੈ। ਕੈਨੇਡਾ ਦੇ ਟੋਰਾਂਟੋ ਵਿੱਚ ਹੋਏ ਸਾਲਾਨਾ ਉੱਦਮੀ ਸੰਮੇਲਨ ਦੌਰਾਨ ਪੰਜਾਬੀ ਨੌਜਵਾਨਾਂ ਨੂੰ ਸਨਮਾਨਿਤ ਕੀਤਾ ਗਿਆ।`,
    isBreaking: false,
    views: 1650,
    status: "published",
    publishedAt: new Date("2026-09-09T15:00:00Z")
  },
  {
    title: "‘ਖੇਡਾਂ ਵਤਨ ਪੰਜਾਬ ਦੀਆਂ’ ਦਾ ਚੌਥਾ ਸੀਜ਼ਨ ਧੂਮਧਾਮ ਨਾਲ ਸ਼ੁਰੂ, ਹਜ਼ਾਰਾਂ ਖਿਡਾਰੀ ਮੈਦਾਨ ਵਿੱਚ",
    slug: "khedan-watan-punjab-diyan-season-4",
    category: "sport",
    language: "pa",
    authorName: "ਬਲਵਿੰਦਰ ਸਿੰਘ ਖੇਡ ਡੈਸਕ",
    featuredImage: "/img/index_800x400-image06.jpg",
    excerpt: "ਪਿੰਡਾਂ ਤੋਂ ਲੈ ਕੇ ਸੂਬਾ ਪੱਧਰ ਤੱਕ ਕਬੱਡੀ, ਕੁਸ਼ਤੀ, ਅਥਲੈਟਿਕਸ ਅਤੇ ਵਾਲੀਬਾਲ ਦੇ ਸ਼ਾਨਦਾਰ ਮੁਕਾਬਲੇ।",
    content: `ਪੰਜਾਬ ਸਰਕਾਰ ਦੇ ਖੇਡ ਵਿਭਾਗ ਵੱਲੋਂ ਕਰਵਾਈਆਂ ਜਾ ਰਹੀਆਂ ‘ਖੇਡਾਂ ਵਤਨ ਪੰਜਾਬ ਦੀਆਂ’ ਦੇ ਚੌਥੇ ਸੀਜ਼ਨ ਦਾ ਉਦਘਾਟਨ ਸ਼ਾਨਦਾਰ ਮਾਰਚ ਪਾਸਟ ਨਾਲ ਹੋਇਆ। ਇਸ ਵਾਰ 30 ਤੋਂ ਵੱਧ ਖੇਡਾਂ ਸ਼ਾਮਲ ਕੀਤੀਆਂ ਗਈਆਂ ਹਨ।`,
    isBreaking: false,
    views: 1530,
    status: "published",
    publishedAt: new Date("2026-09-09T17:00:00Z")
  },
  {
    title: "ਪੰਜਾਬ ਵਿਧਾਨ ਸਭਾ ਸੈਸ਼ਨ: ਲੋਕ ਹਿੱਤ ਦੇ ਅਹਿਮ ਬਿੱਲ ਪਾਸ, ਨਵੇਂ ਪ੍ਰੋਜੈਕਟਾਂ ਨੂੰ ਮਨਜ਼ੂਰੀ",
    slug: "punjab-vidhan-sabha-public-welfare-bills-passed",
    category: "politics",
    language: "pa",
    authorName: "ਰਾਜਨੀਤਿਕ ਵਿਸ਼ਲੇਸ਼ਕ",
    featuredImage: "/img/index_800x400-image07.jpg",
    excerpt: "ਸੂਬੇ ਦੇ ਵਿਕਾਸ ਕਾਰਜਾਂ ਅਤੇ ਨੌਜਵਾਨਾਂ ਲਈ ਰੁਜ਼ਗਾਰ ਦੇ ਨਵੇਂ ਮੌਕੇ ਪੈਦਾ ਕਰਨ ਲਈ ਵਿਸ਼ੇਸ਼ ਬਜਟ ਅਲਾਟ ਕੀਤਾ ਗਿਆ।",
    content: `ਪੰਜਾਬ ਵਿਧਾਨ ਸਭਾ ਦੇ ਮੌਨਸੂਨ ਸੈਸ਼ਨ ਦੌਰਾਨ ਕਿਸਾਨਾਂ ਦੀ ਭਲਾਈ, ਨਹਿਰੀ ਪਾਣੀ ਦੇ ਵਿਸਥਾਰ ਅਤੇ ਸਿਹਤ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਨ ਸੰਬੰਧੀ ਕਈ ਅਹਿਮ ਬਿੱਲਾਂ ਨੂੰ ਸਰਬਸੰਮਤੀ ਨਾਲ ਮਨਜ਼ੂਰੀ ਦਿੱਤੀ ਗਈ।`,
    isBreaking: false,
    views: 1720,
    status: "published",
    publishedAt: new Date("2026-09-08T16:00:00Z")
  },
  {
    title: "ਗੁਰਦਾਸਪੁਰ ਤੇ ਤਰਨਤਾਰਨ: ਸਰਹੱਦੀ ਖੇਤਰਾਂ ਦੇ ਕਿਸਾਨਾਂ ਲਈ ਨਹਿਰੀ ਪਾਣੀ ਦੀ ਸਪਲਾਈ ਬਹਾਲ",
    slug: "gurdaspur-tarn-taran-canal-water-restored",
    category: "punjab",
    punjabRegion: "majha",
    language: "pa",
    authorName: "ਸੁਖਦੇਵ ਸਿੰਘ ਤਰਨਤਾਰਨ",
    featuredImage: "/img/index_800x400-image08.jpg",
    excerpt: "ਨਹਿਰੀ ਵਿਭਾਗ ਵੱਲੋਂ ਟੇਲਾਂ ਤੱਕ ਪਾਣੀ ਪਹੁੰਚਾਉਣ ਲਈ ਵਿਸ਼ੇਸ਼ ਨਿਗਰਾਨ ਟੀਮਾਂ ਤਾਇਨਾਤ।",
    content: `ਸਰਹੱਦੀ ਕਿਸਾਨਾਂ ਦੀ ਲੰਮੇ ਸਮੇਂ ਤੋਂ ਚੱਲੀ ਆ ਰਹੀ ਮੰਗ ਨੂੰ ਪੂਰਾ ਕਰਦਿਆਂ ਨਹਿਰੀ ਵਿਭਾਗ ਨੇ ਅੱਪਰ ਬਾਰੀ ਦੁਆਬ ਨਹਿਰ (UBDC) ਰਾਹੀਂ ਟੇਲਾਂ ਤੱਕ ਪਾਣੀ ਪਹੁੰਚਾਉਣਾ ਯਕੀਨੀ ਬਣਾਇਆ ਹੈ।`,
    isBreaking: false,
    views: 1410,
    status: "published",
    publishedAt: new Date("2026-09-08T11:00:00Z")
  },
  {
    title: "ਪਟਿਆਲਾ ਤੇ ਸੰਗਰੂਰ: ਖੇਤੀਬਾੜੀ ਖੋਜ ਕੇਂਦਰ ਵੱਲੋਂ ਸਾਉਣੀ ਦੀਆਂ ਫ਼ਸਲਾਂ ਲਈ ਨਵੀਂ ਐਡਵਾਈਜ਼ਰੀ ਜਾਰੀ",
    slug: "patiala-sangrur-pau-kharif-crops-advisory",
    category: "punjab",
    punjabRegion: "malwa",
    language: "pa",
    authorName: "ਡਾ. ਕੁਲਦੀਪ ਸਿੰਘ ਪੀ.ਏ.ਯੂ.",
    featuredImage: "/img/index_800x400-image09.jpg",
    excerpt: "ਮਾਹਿਰਾਂ ਨੇ ਕਿਸਾਨਾਂ ਨੂੰ ਘੱਟ ਪਾਣੀ ਵਾਲੀਆਂ ਕਿੱਸਮਾਂ ਅਪਣਾਉਣ ਅਤੇ ਤੁਪਕਾ ਸਿੰਜਾਈ ਦੀ ਵਰਤੋਂ ਕਰਨ ਦੀ ਸਲਾਹ ਦਿੱਤੀ।",
    content: `ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਯੂਨੀਵਰਸਿਟੀ (PAU) ਲੁਧਿਆਣਾ ਅਤੇ ਪਟਿਆਲਾ ਖੇਤੀ ਖੋਜ ਕੇਂਦਰ ਨੇ ਕਿਸਾਨਾਂ ਲਈ ਮੌਸਮ ਵਿੱਚ ਆ ਰਹੇ ਬਦਲਾਵਾਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦਿਆਂ ਵਿਸ਼ੇਸ਼ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ ਜਾਰੀ ਕੀਤੇ ਹਨ।`,
    isBreaking: false,
    views: 1290,
    status: "published",
    publishedAt: new Date("2026-09-08T13:00:00Z")
  },
  {
    title: "ਹੁਸ਼ਿਆਰਪੁਰ ਤੇ ਕਪੂਰਥਲਾ: ਵਾਤਾਵਰਨ ਸੰਭਾਲ ਮੁਹਿੰਮ ਤਹਿਤ ਲੱਖਾਂ ਬੂਟੇ ਲਗਾਉਣ ਦਾ ਟੀਚਾ",
    slug: "hoshiarpur-kapurthala-green-punjab-mission",
    category: "punjab",
    punjabRegion: "doaba",
    language: "pa",
    authorName: "ਮਨਪ੍ਰੀਤ ਕੌਰ",
    featuredImage: "/img/index_800x400-image10.jpg",
    excerpt: "ਪਿੰਡਾਂ ਅਤੇ ਨਹਿਰਾਂ ਦੇ ਕਿਨਾਰੇ ਹਰਿਆਵਲ ਵਧਾਉਣ ਲਈ ਸਮਾਜ ਸੇਵੀ ਸੰਸਥਾਵਾਂ ਅਤੇ ਵਿਦਿਆਰਥੀਆਂ ਦਾ ਵੱਡਾ ਸਹਿਯੋਗ।",
    content: `ਸ਼ਿਵਾਲਿਕ ਦੀਆਂ ਪਹਾੜੀਆਂ ਦੀ ਗੋਦ ਵਿੱਚ ਵਸੇ ਹੁਸ਼ਿਆਰਪੁਰ ਅਤੇ ਇਤਿਹਾਸਕ ਸ਼ਹਿਰ ਕਪੂਰਥਲਾ ਵਿੱਚ ਵਣ ਵਿਭਾਗ ਵੱਲੋਂ ‘ਗ੍ਰੀਨ ਪੰਜਾਬ ਮਿਸ਼ਨ’ ਤਹਿਤ ਵਿਸ਼ਾਲ ਬੂਟੇ ਲਗਾਉਣ ਦੀ ਮੁਹਿੰਮ ਵਿੱਢੀ ਗਈ ਹੈ।`,
    isBreaking: false,
    views: 1150,
    status: "published",
    publishedAt: new Date("2026-09-07T10:00:00Z")
  },
  {
    title: "ਪੇਂਡੂ ਸਿਹਤ ਸੁਧਾਰ ਮਿਸ਼ਨ: ਹਰ ਪਿੰਡ ਵਿੱਚ ਮੁਫ਼ਤ ਮੈਡੀਕਲ ਕੈਂਪ ਅਤੇ ਦਵਾਈਆਂ ਦੀ ਸਹੂਲਤ",
    slug: "rural-health-mission-punjab-mobile-vans",
    category: "health",
    language: "pa",
    authorName: "ਸਿਹਤ ਰਿਪੋਰਟਰ",
    featuredImage: "/img/index_800x400-image14.jpg",
    excerpt: "ਸਿਹਤ ਵਿਭਾਗ ਵੱਲੋਂ ਮੋਬਾਈਲ ਵੈਨਾਂ ਰਾਹੀਂ ਪਿੰਡ-ਪਿੰਡ ਜਾ ਕੇ ਮਰੀਜ਼ਾਂ ਦੀ ਮੁਫ਼ਤ ਜਾਂਚ ਅਤੇ ਟੈਸਟ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ।",
    content: `ਪੰਜਾਬ ਦੇ ਦੂਰ-ਦੁਰਾਡੇ ਪਿੰਡਾਂ ਵਿੱਚ ਮਿਆਰੀ ਸਿਹਤ ਸਹੂਲਤਾਂ ਪਹੁੰਚਾਉਣ ਲਈ ਸਰਕਾਰ ਵੱਲੋਂ 100 ਨਵੀਆਂ ਮੋਬਾਈਲ ਹੈਲਥ ਕਲੀਨਿਕ ਵੈਨਾਂ ਨੂੰ ਰਵਾਨਾ ਕੀਤਾ ਗਿਆ ਹੈ।`,
    isBreaking: false,
    views: 1380,
    status: "published",
    publishedAt: new Date("2026-09-07T12:00:00Z")
  }
];

const initialBreaking = [
  { tag: "ਪੰਜਾਬ", text: "ਪੰਜਾਬ ਫਾਈਲਜ਼ ’ਤੇ 24 ਘੰਟੇ ਲਾਈਵ ਅੱਪਡੇਟ ਅਤੇ ਤਾਜ਼ਾ ਜ਼ਮੀਨੀ ਖ਼ਬਰਾਂ ਦਾ ਸਿਲਸਿਲਾ ਜਾਰੀ।", priority: 5 },
  { tag: "ਮਾਝਾ", text: "ਸ੍ਰੀ ਅੰਮ੍ਰਿਤਸਰ ਸਾਹਿਬ ਵਿਖੇ ਵਿਰਾਸਤੀ ਮਾਰਗ ਦੇ ਨਵੀਨੀਕਰਨ ਪ੍ਰਾਜੈਕਟ ਨੂੰ ਹਰੀ ਝੰਡੀ।", priority: 4 },
  { tag: "ਮਾਲਵਾ", text: "ਲੁਧਿਆਣਾ ਅਤੇ ਬਠਿੰਡਾ ਵਿੱਚ ਉਦਯੋਗਿਕ ਵਿਕਾਸ ਅਤੇ ਰੁਜ਼ਗਾਰ ਲਈ ਨਵੀਂ ਵਿਸ਼ੇਸ਼ ਨੀਤੀ ਦਾ ਐਲਾਨ।", priority: 3 },
  { tag: "ਦੋਆਬਾ", text: "ਜਲੰਧਰ ਅਤੇ ਹੁਸ਼ਿਆਰਪੁਰ ਵਿੱਚ ਖੇਡ ਉਦਯੋਗ ਨੂੰ ਹੁਲਾਰਾ ਦੇਣ ਲਈ ਵਿਸ਼ੇਸ਼ ਗ੍ਰਾਂਟ ਮਨਜ਼ੂਰ।", priority: 2 },
  { tag: "ਧਰਮ", text: "ਸ੍ਰੀ ਦਰਬਾਰ ਸਾਹਿਬ ਤੋਂ ਰੋਜ਼ਾਨਾ ਅੰਮ੍ਰਿਤ ਵੇਲੇ ਦਾ ਮੁੱਖ ਵਾਕ ਵੈੱਬਸਾਈਟ ’ਤੇ ਉਪਲਬਧ।", priority: 1 }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Seeding...");

    // 1. Seed Users
    console.log("Seeding Users...");
    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(` Created user: ${u.email} (${u.role})`);
      } else {
        console.log(` User ${u.email} already exists.`);
      }
    }

    const adminUser = await User.findOne({ role: "admin" });

    // 2. Seed Articles
    console.log("Seeding Articles...");
    for (const art of initialArticles) {
      const exists = await Article.findOne({ slug: art.slug });
      if (!exists) {
        await Article.create({
          ...art,
          author: adminUser ? adminUser._id : undefined
        });
        console.log(` Created article: ${art.slug}`);
      } else {
        console.log(` Article ${art.slug} already exists.`);
      }
    }

    // 3. Seed Breaking News
    console.log("Seeding Breaking News...");
    for (const brk of initialBreaking) {
      const exists = await BreakingNews.findOne({ text: brk.text });
      if (!exists) {
        await BreakingNews.create(brk);
        console.log(` Created breaking news item: [${brk.tag}]`);
      }
    }

    console.log("\n==========================================");
    console.log(" ALL DATA SEEDED SUCCESSFULLY TO MONGODB! ");
    console.log("==========================================");
    console.log("Default Login Credentials:");
    console.log("  Super Admin : admin@punjabfiles.com    / AdminPassword123!");
    console.log("  Editor      : editor@punjabfiles.com   / EditorPassword123!");
    console.log("  Reporter    : reporter@punjabfiles.com / ReporterPassword123!");
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedData();
