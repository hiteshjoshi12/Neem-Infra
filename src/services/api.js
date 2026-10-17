const isBrowser = typeof window !== 'undefined';
const isLocalhost =
  isBrowser &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local'));

const envApiUrl = process.env.NEXT_PUBLIC_API_URL;

// Determine safe API base URL
let API_BASE_URL = '/api';

/**
 * Helper to make API requests with Authorization header
 */
const pendingGetRequests = new Map();

async function executeRequest(endpoint, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('API server not configured in this environment.');
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('saudagar_admin_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: 'no-store',
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    if (isLocalhost) {
      console.warn(`[API] Error on ${endpoint}:`, error.message);
    }
    throw error;
  }
}

async function request(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();

  // Deduplicate simultaneous identical in-flight GET requests (e.g. React StrictMode or sibling components)
  if (method === 'GET' && isBrowser) {
    if (pendingGetRequests.has(endpoint)) {
      return pendingGetRequests.get(endpoint);
    }
    const promise = (async () => {
      try {
        return await executeRequest(endpoint, options);
      } finally {
        setTimeout(() => {
          pendingGetRequests.delete(endpoint);
        }, 150);
      }
    })();
    pendingGetRequests.set(endpoint, promise);
    return promise;
  }

  return executeRequest(endpoint, options);
}

export const api = {
  // Authentication
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getMe: () => request('/auth/me'),

  // Sections & Pages CMS
  getSections: (fresh = false) =>
    request(`/sections${fresh ? '?fresh=1' : ''}`, { cache: 'no-store' }),

  getSection: (sectionKey) =>
    request(`/sections/${sectionKey}?t=${Date.now()}`, { cache: 'no-store' }),

  updateSection: (sectionKey, data, title) =>
    request(`/sections/${sectionKey}`, {
      method: 'PUT',
      cache: 'no-store',
      body: JSON.stringify({ data, title })
    }),

  getPages: () => request(`/pages?t=${Date.now()}`, { cache: 'no-store' }),

  getPage: (pageKey) => request(`/pages/${pageKey}?t=${Date.now()}`, { cache: 'no-store' }),

  updatePage: (pageKey, data, title) =>
    request(`/pages/${pageKey}`, {
      method: 'PUT',
      cache: 'no-store',
      body: JSON.stringify({ data, title })
    }),

  // Properties CRUD
  getProperties: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/properties${query ? `?${query}` : ''}`);
  },

  getProperty: (id) => request(`/properties/${id}`),

  createProperty: (propertyData) =>
    request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData)
    }),

  updateProperty: (id, propertyData) =>
    request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData)
    }),

  deleteProperty: (id) =>
    request(`/properties/${id}`, {
      method: 'DELETE'
    }),

  // Testimonials CRUD
  getTestimonials: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/testimonials${query ? `?${query}` : ''}`);
  },

  createTestimonial: (testimonialData) =>
    request('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData)
    }),

  updateTestimonial: (id, testimonialData) =>
    request(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialData)
    }),

  deleteTestimonial: (id) =>
    request(`/testimonials/${id}`, {
      method: 'DELETE'
    }),

  // Inquiries / Leads
  createInquiry: (inquiryData) =>
    request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData)
    }),

  getInquiries: () => request('/inquiries'),

  updateInquiry: (id, inquiryData) =>
    request(`/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(inquiryData)
    }),

  deleteInquiry: (id) =>
    request(`/inquiries/${id}`, {
      method: 'DELETE'
    }),

  // Blog CRUD
  getBlogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/blog${query ? `?${query}` : ''}`);
  },
  getBlog: (id) => request(`/blog/${id}`),
  createBlog: (blogData) =>
    request('/blog', {
      method: 'POST',
      body: JSON.stringify(blogData)
    }),
  updateBlog: (id, blogData) =>
    request(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData)
    }),
  deleteBlog: (id) =>
    request(`/blog/${id}`, {
      method: 'DELETE'
    }),

  // Taxonomies
  getTaxonomies: () => request('/taxonomies'),
  createTag: (tagData) =>
    request('/taxonomies/tags', {
      method: 'POST',
      body: JSON.stringify(tagData)
    }),

  // Locations (Market Intelligence Corridors)
  getLocations: () => request('/locations'),
  getLocation: (id) => request(`/locations/${id}`),
  createLocation: (locationData) =>
    request('/locations', {
      method: 'POST',
      body: JSON.stringify(locationData)
    }),
  updateLocation: (id, locationData) =>
    request(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(locationData)
    }),
  deleteLocation: (id) =>
    request(`/locations/${id}`, {
      method: 'DELETE'
    })
};

export default api;

