import React, { useState, useEffect } from "react";
import { articleAPI, uploadAPI, categoryAPI } from "../../services/api";
import { transliterateGurmukhiToEnglish } from "../../services/slugUtils";
import RichTextEditor from "./RichTextEditor";

const LANG_OPTIONS = [
  { key: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { key: "hi", label: "हिंदी (Hindi)" },
  { key: "en", label: "English" }
];

const PUNJAB_REGIONS = [
  { value: "majha", label: "ਮਾਝਾ (Majha - ਅੰਮ੍ਰਿਤਸਰ, ਗੁਰਦਾਸਪੁਰ, ਤਰਨਤਾਰਨ, ਪਠਾਨਕੋਟ)" },
  { value: "malwa", label: "ਮਾਲਵਾ (Malwa - ਲੁਧਿਆਣਾ, ਬਠਿੰਡਾ, ਪਟਿਆਲਾ, ਸੰਗਰੂਰ)" },
  { value: "doaba", label: "ਦੋਆਬਾ (Doaba - ਜਲੰਧਰ, ਹੁਸ਼ਿਆਰਪੁਰ, ਕਪੂਰਥਲਾ, ਨਵਾਂਸ਼ਹਿਰ)" }
];

export default function EditArticleModal({
  isOpen,
  article,
  currentUser,
  onClose,
  onSaved
}) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "punjab",
    punjabRegion: "majha",
    language: "pa",
    featuredImage: "",
    status: "published",
    isBreaking: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isStaffPrivileged = Boolean(currentUser?.role === "admin" || currentUser?.role === "editor");

  // Load categories
  useEffect(() => {
    let isMounted = true;
    categoryAPI
      .getAll()
      .then((res) => {
        if (isMounted && res && res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Pre-fill form when article changes
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        slug: article.slug || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        category: article.category || "punjab",
        punjabRegion: article.punjabRegion || "majha",
        language: article.language || "pa",
        featuredImage: article.featuredImage || "",
        status: article.status || (isStaffPrivileged ? "published" : "pending_editor"),
        isBreaking: Boolean(article.isBreaking)
      });
      setErrorMsg("");
    }
  }, [article, isStaffPrivileged]);

  if (!isOpen || !article) return null;

  const handleTitleChange = (val) => {
    const updated = { ...formData, title: val };
    if (!formData.slug || formData.slug === transliterateGurmukhiToEnglish(formData.title)) {
      updated.slug = transliterateGurmukhiToEnglish(val);
    }
    setFormData(updated);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("ਸਿਰਫ਼ ਫ਼ੋਟੋਆਂ (JPG, PNG, WEBP) ਹੀ ਅਪਲੋਡ ਕੀਤੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ।");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("ਫ਼ੋਟੋ ਦਾ ਸਾਈਜ਼ 15MB ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੋਣਾ ਚਾਹੀਦਾ।");
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg("");
      const res = await uploadAPI.uploadMedia(file, "images");
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, featuredImage: res.url }));
      }
    } catch (err) {
      setErrorMsg("ਫ਼ੋਟੋ ਅਪਲੋਡ ਫੇਲ੍ਹ ਹੋਈ: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg("ਕਿਰਪਾ ਕਰਕੇ ਖ਼ਬਰ ਦਾ ਸਿਰਲੇਖ ਦਰਜ ਕਰੋ (Title is required)।");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg("");

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug?.trim() || undefined,
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        category: formData.category,
        punjabRegion: formData.category === "punjab" ? formData.punjabRegion : null,
        language: formData.language,
        featuredImage: formData.featuredImage.trim(),
        isBreaking: formData.isBreaking
      };

      if (isStaffPrivileged) {
        payload.status = formData.status;
      }

      const res = await articleAPI.updateArticle(article._id, payload);

      window.dispatchEvent(new Event("punjab_articles_updated"));
      window.dispatchEvent(new Event("punjab_breaking_updated"));

      if (onSaved) {
        onSaved(res.article || res.data || { ...article, ...payload });
      }
      onClose();
    } catch (err) {
      setErrorMsg("ਖ਼ਬਰ ਅੱਪਡੇਟ ਕਰਨ ਵਿੱਚ ਗਲਤੀ: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="admin-edit-modal-overlay"
      data-lenis-prevent="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "16px"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        className="admin-edit-modal-card"
        data-lenis-prevent="true"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          maxWidth: "800px",
          width: "100%",
          height: "88vh",
          maxHeight: "880px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          border: "1px solid #cbd5e1",
          overflow: "hidden",
          margin: "auto"
        }}
      >
        {/* Pinned Top Header */}
        <div
          style={{
            backgroundColor: "#1c2d5a",
            padding: "14px 22px",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <i className="fa fa-pencil-square-o" style={{ fontSize: "18px", color: "#ebb10d" }}></i>
            <span
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: "800",
                color: "#ffffff",
                display: "inline-block",
                lineHeight: 1.3
              }}
            >
              ਖ਼ਬਰ ਸੋਧੋ (Edit News Article)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#ffffff",
              fontSize: "20px",
              cursor: isSaving ? "not-allowed" : "pointer",
              lineHeight: 1,
              padding: "4px"
            }}
            title="ਬੰਦ ਕਰੋ (Close)"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            boxSizing: "border-box"
          }}
        >
          {errorMsg && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                padding: "10px 14px",
                borderRadius: "6px",
                marginBottom: "16px",
                fontSize: "13px",
                fontWeight: "700"
              }}
            >
              <i className="fa fa-exclamation-circle" style={{ marginRight: "6px" }}></i>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Row 1: Language & Category */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                  ਭਾਸ਼ਾ (Language) *
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: "600" }}
                >
                  {LANG_OPTIONS.map((l) => (
                    <option key={l.key} value={l.key}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                  ਕੈਟੇਗਰੀ (Category) *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: "600" }}
                >
                  <option value="punjab">ਪੰਜਾਬ (Punjab Special)</option>
                  <option value="religion">ਧਰਮ ਤੇ ਵਿਰਾਸਤ (Religion)</option>
                  <option value="national">ਦੇਸ਼-ਵਿਦੇਸ਼ (National & World)</option>
                  <option value="sports">ਖੇਡਾਂ (Sports)</option>
                  <option value="health">ਸਿਹਤ (Health)</option>
                  <option value="travel">ਸੈਰ-ਸਪਾਟਾ (Travel)</option>
                  <option value="entertainment">ਮਨੋਰੰਜਨ (Entertainment)</option>
                  <option value="business">ਕਾਰੋਬਾਰ (Business)</option>
                  {categories.map((c) => (
                    <option key={c._id || c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 1.5: Punjab Region if category is punjab */}
            {formData.category === "punjab" && (
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                  ਪੰਜਾਬ ਖੇਤਰ (Punjab Region Sub-category)
                </label>
                <select
                  value={formData.punjabRegion || "majha"}
                  onChange={(e) => setFormData({ ...formData, punjabRegion: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: "600" }}
                >
                  {PUNJAB_REGIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Title */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                ਸਿਰਲੇਖ (Article Headline) *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="ਖ਼ਬਰ ਦਾ ਮੁੱਖ ਸਿਰਲੇਖ ਇੱਥੇ ਲਿਖੋ..."
                style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", fontWeight: "700", boxSizing: "border-box" }}
              />
            </div>

            {/* English URL Slug */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                ਅੰਗਰੇਜ਼ੀ URL ਸਲੱਗ (English URL Slug)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="news-headline-slug"
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", color: "#475569", boxSizing: "border-box" }}
              />
              <span style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginTop: "3px" }}>
                URL: /news/{formData.slug || "headline"}
              </span>
            </div>

            {/* Featured Image Section */}
            <div style={{ marginBottom: "16px", padding: "14px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#334155", marginBottom: "8px" }}>
                ਮੁੱਖ ਫ਼ੋਟੋ (Featured Image)
              </label>
              <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                <img
                  src={formData.featuredImage || "/img/index_800x400-image01.jpg"}
                  alt="Preview"
                  style={{ width: "90px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #cbd5e1", flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: "220px" }}>
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="https://... ਜਾਂ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨ ਤੋਂ ਨਵੀਂ ਫ਼ੋਟੋ ਅਪਲੋਡ ਕਰੋ"
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid #cbd5e1", fontSize: "12.5px", marginBottom: "6px", boxSizing: "border-box" }}
                  />
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <label
                      style={{
                        backgroundColor: "#1c2d5a",
                        color: "#ffffff",
                        padding: "6px 12px",
                        borderRadius: "5px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: isUploading ? "not-allowed" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <i className={`fa ${isUploading ? "fa-spinner fa-spin" : "fa-upload"}`}></i>
                      <span>{isUploading ? "ਅਪਲੋਡ ਹੋ ਰਹੀ ਹੈ..." : "ਫ਼ੋਟੋ ਬਦਲੋ (Upload Photo)"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </label>

                    {formData.featuredImage && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, featuredImage: "" })}
                        style={{
                          backgroundColor: "#fee2e2",
                          border: "1px solid #fca5a5",
                          color: "#b91c1c",
                          padding: "6px 10px",
                          borderRadius: "5px",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        <i className="fa fa-trash"></i> ਹਟਾਓ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Short Excerpt */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                ਸੰਖੇਪ ਵੇਰਵਾ (Short Excerpt - 1-2 lines for card summary)
              </label>
              <textarea
                rows="2"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="ਮੁੱਖ ਲਾਈਨ ਜੋ ਕਾਰਡ ਉੱਤੇ ਨਜ਼ਰ ਆਵੇਗੀ..."
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            {/* Full Content */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                ਪੂਰੀ ਖ਼ਬਰ ਦਾ ਵੇਰਵਾ (Full Article Content)
              </label>
              <RichTextEditor
                value={formData.content || ""}
                onChange={(val) => setFormData({ ...formData, content: val })}
                placeholder="ਇੱਥੇ ਖ਼ਬਰ ਦਾ ਪੂਰਾ ਵੇਰਵਾ ਲਿਖੋ..."
                minHeight="200px"
              />
            </div>

            {/* Row: Status (if Editor/Admin) & Breaking News Toggle */}
            <div style={{ display: "grid", gridTemplateColumns: isStaffPrivileged ? "1fr 1fr" : "1fr", gap: "12px", marginBottom: "14px" }}>
              {isStaffPrivileged && (
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                    ਖ਼ਬਰ ਦੀ ਸਥਿਤੀ (Article Status)
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: "700" }}
                  >
                    <option value="published">ਲਾਈਵ ਪ੍ਰਕਾਸ਼ਿਤ (Published Live)</option>
                    <option value="pending_admin">ਅੰਤਿਮ ਪ੍ਰਵਾਨਗੀ ਲਈ (Pending Admin)</option>
                    <option value="pending_editor">ਸੰਪਾਦਕੀ ਸਮੀਖਿਆ ਲਈ (Pending Editor)</option>
                    <option value="draft">ਡਰਾਫਟ (Draft)</option>
                    <option value="rejected">ਰੱਦ (Rejected)</option>
                  </select>
                </div>
              )}

              {/* Breaking News Toggle */}
              <div
                style={{
                  backgroundColor: formData.isBreaking ? "#fff1f2" : "#f8fafc",
                  border: formData.isBreaking ? "1.5px solid #fecdd3" : "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  marginTop: isStaffPrivileged ? "20px" : "0"
                }}
                onClick={() => setFormData((prev) => ({ ...prev, isBreaking: !prev.isBreaking }))}
              >
                <input
                  type="checkbox"
                  id="modalEditIsBreaking"
                  checked={formData.isBreaking}
                  onChange={(e) => setFormData({ ...formData, isBreaking: e.target.checked })}
                  style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#b71c1c", margin: 0 }}
                  onClick={(e) => e.stopPropagation()}
                />
                <label
                  htmlFor="modalEditIsBreaking"
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: "700",
                    color: formData.isBreaking ? "#9f1239" : "#334155",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="fa fa-bolt" style={{ color: "#b71c1c" }}></i>
                  <span>ਬਰੇਕਿੰਗ ਨਿਊਜ਼ ਟਿੱਕਰ (Breaking News Ticker)</span>
                </label>
              </div>
            </div>

            {!isStaffPrivileged && (
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
                * ਸੋਧਣ ਤੋਂ ਬਾਅਦ ਖ਼ਬਰ ਸਮੀਖਿਆ ਲਈ ਦਰਜ ਹੋ ਜਾਵੇਗੀ। (After saving, your edited article will be submitted for editorial review).
              </p>
            )}
          </form>
        </div>

        {/* Pinned Bottom Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            borderTop: "1px solid #e2e8f0",
            padding: "12px 24px",
            backgroundColor: "#f8fafc",
            flexShrink: 0,
            alignItems: "center"
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            style={{
              backgroundColor: "#ffffff",
              color: "#475569",
              border: "1px solid #cbd5e1",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: isSaving ? "not-allowed" : "pointer"
            }}
          >
            ਵਾਪਸ (Cancel)
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            style={{
              backgroundColor: "#16a34a",
              color: "#ffffff",
              border: "none",
              padding: "8px 20px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "800",
              cursor: isSaving ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 4px rgba(22, 163, 74, 0.25)"
            }}
          >
            {isSaving ? <i className="fa fa-spinner fa-spin"></i> : <i className="fa fa-check"></i>}
            <span>{isSaving ? "ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ..." : "ਬਦਲਾਅ ਸੇਵ ਕਰੋ (Save Changes)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
