/**
 * Centralized API Client Service for Punjab Files News Portal
 * Connects Frontend directly to Node.js/Express MongoDB Backend
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const TOKEN_KEY = 'punjab_files_auth_token';
const USER_KEY = 'punjab_files_auth_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getSavedUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const setSavedUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeSavedUser = () => localStorage.removeItem(USER_KEY);

// Base fetch wrapper with automatic JWT injection
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// -------------------------------------------------------------
// 1. AUTH & SESSION APIS
// -------------------------------------------------------------
export const authAPI = {
  login: async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      setToken(data.token);
      setSavedUser(data.user);
    }
    return data;
  },

  getMe: async () => {
    const data = await apiFetch('/auth/me');
    if (data.user) {
      setSavedUser(data.user);
    }
    return data;
  },

  logout: () => {
    removeToken();
    removeSavedUser();
  }
};

// -------------------------------------------------------------
// 2. ARTICLES & EDITORIAL APIS
// -------------------------------------------------------------
export const articleAPI = {
  // Public
  getPublished: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.punjabRegion && params.punjabRegion !== 'all') query.append('punjabRegion', params.punjabRegion);
    if (params.language && params.language !== 'all') query.append('language', params.language);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiFetch(`/articles${queryString}`);
    return {
      ...res,
      data: res.data || res.articles || []
    };
  },

  getBySlug: async (slug) => {
    const safeSlug = encodeURIComponent(slug || '');
    const res = await apiFetch(`/articles/detail/${safeSlug}`);
    return {
      ...res,
      data: res.data || res.article || null
    };
  },

  getReadersChoice: async () => {
    const res = await apiFetch('/articles/readers-choice');
    return {
      ...res,
      data: res.data || res.articles || []
    };
  },

  // Staff / Editorial
  createArticle: async (articleData) => {
    const res = await apiFetch('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData)
    });
    return {
      ...res,
      data: res.data || res.article || null
    };
  },

  getMyArticles: async () => {
    const res = await apiFetch('/articles/staff/my-articles');
    return {
      ...res,
      data: res.data || res.articles || []
    };
  },

  getPendingArticles: async () => {
    const res = await apiFetch('/articles/staff/pending');
    return {
      ...res,
      data: res.data || res.articles || []
    };
  },

  getReviewDeskArticles: async (params = 'all') => {
    let query = '';
    if (typeof params === 'string') {
      query = params && params !== 'all' ? `?status=${params}` : '';
    } else if (params && typeof params === 'object') {
      const searchParams = new URLSearchParams();
      if (params.status && params.status !== 'all') searchParams.append('status', params.status);
      if (params.category && params.category !== 'all') searchParams.append('category', params.category);
      if (params.punjabRegion && params.punjabRegion !== 'all') searchParams.append('punjabRegion', params.punjabRegion);
      if (params.language && params.language !== 'all') searchParams.append('language', params.language);
      if (params.search) searchParams.append('search', params.search);
      if (params.sort) searchParams.append('sort', params.sort);
      query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    }
    const res = await apiFetch(`/articles/staff/review-desk${query}`);
    return {
      ...res,
      data: res.data || res.articles || [],
      counts: res.counts || { pending: 0, published: 0, rejected: 0, total: 0 }
    };
  },

  updateStatus: async (id, status, rejectionReason = null) => {
    const res = await apiFetch(`/articles/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, rejectionReason })
    });
    return {
      ...res,
      data: res.data || res.article || null
    };
  },

  updateArticle: async (id, updateData) => {
    const res = await apiFetch(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    return {
      ...res,
      data: res.data || res.article || null
    };
  },

  deleteArticle: (id) => {
    return apiFetch(`/articles/${id}`, {
      method: 'DELETE'
    });
  }
};

// -------------------------------------------------------------
// 3. BREAKING NEWS APIS
// -------------------------------------------------------------
export const breakingAPI = {
  getBreaking: () => apiFetch('/breaking'),

  createBreaking: (item) => {
    return apiFetch('/breaking', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  updateBreaking: (id, item) => {
    return apiFetch(`/breaking/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    });
  },

  deleteBreaking: (id) => {
    return apiFetch(`/breaking/${id}`, {
      method: 'DELETE'
    });
  }
};

// -------------------------------------------------------------
// 4. ADMIN USER MANAGEMENT APIS
// -------------------------------------------------------------
export const userAPI = {
  getUsers: () => apiFetch('/users'),

  registerStaff: (userData) => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  updateRole: (id, role) => {
    return apiFetch(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  },

  updateStatus: (id, isActive) => {
    return apiFetch(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive })
    });
  },

  updateDirectPublish: (id, canDirectPublish) => {
    return apiFetch(`/users/${id}/direct-publish`, {
      method: 'PUT',
      body: JSON.stringify({ canDirectPublish })
    });
  },

  deleteUser: (id) => {
    return apiFetch(`/users/${id}`, {
      method: 'DELETE'
    });
  }
};

// -------------------------------------------------------------
// 5. CLOUDINARY MEDIA UPLOAD API (PHOTOS & VIDEOS)
// -------------------------------------------------------------
export const uploadAPI = {
  uploadMedia: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file); // 'image' field is parsed by multer memory storage

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Media upload failed');
    }

    return data;
  },
  uploadImage: async (file) => {
    return uploadAPI.uploadMedia(file);
  }
};

// -------------------------------------------------------------
// 6. DAILY MUKHWAK (HUKAMNAMA SAHIB) API
// -------------------------------------------------------------
export const mukhwakAPI = {
  // Public - get active mukhwak for homepage
  getActive: async () => {
    const res = await apiFetch('/mukhwak/today');
    return res.data || null;
  },

  // Protected - get all mukhwaks for admin / editor
  getAll: async () => {
    const res = await apiFetch('/mukhwak');
    return res.data || [];
  },

  // Create new mukhwak
  create: async (mukhwakData) => {
    return apiFetch('/mukhwak', {
      method: 'POST',
      body: JSON.stringify(mukhwakData)
    });
  },

  // Update existing mukhwak
  update: async (id, mukhwakData) => {
    return apiFetch(`/mukhwak/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mukhwakData)
    });
  },

  // Set as live active mukhwak on homepage
  setActive: async (id) => {
    return apiFetch(`/mukhwak/${id}/set-active`, {
      method: 'PUT'
    });
  },

  // Delete mukhwak
  delete: async (id) => {
    return apiFetch(`/mukhwak/${id}`, {
      method: 'DELETE'
    });
  }
};

