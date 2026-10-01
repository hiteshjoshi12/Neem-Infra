const isBrowser = typeof window !== 'undefined';
const isLocalhost =
  isBrowser &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local'));

const envApiUrl = import.meta.env.VITE_API_URL;

// Determine safe API base URL
let API_BASE_URL = '';

if (envApiUrl) {
  // If envApiUrl is defined but points to localhost on a remote host (e.g. vercel.app),
  // ignore localhost to prevent Chrome's "Access other apps and services on this device" (Private Network Access) prompt.
  if (!isLocalhost && (envApiUrl.includes('localhost') || envApiUrl.includes('127.0.0.1'))) {
    API_BASE_URL = '';
  } else {
    API_BASE_URL = envApiUrl.replace(/\/+$/, '');
  }
} else if (isLocalhost) {
  // Local development default: connect to local Node backend
  API_BASE_URL = 'http://localhost:5000/api';
} else {
  // In production without an explicitly deployed backend URL, leave empty.
  // We NEVER probe http://localhost from a public domain (like vercel.app),
  // which prevents Chrome from displaying the Private Network Access security prompt.
  API_BASE_URL = '';
}

/**
 * Helper to make API requests with Authorization header
 */
async function request(endpoint, options = {}) {
  // If no API URL is configured (e.g. production site without deployed backend URL),
  // reject cleanly without making an unauthorized cross-network request.
  if (!API_BASE_URL) {
    throw new Error('API server not configured in this environment.');
  }

  const token = localStorage.getItem('saudagar_admin_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
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

export const api = {
  // Authentication
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getMe: () => request('/auth/me'),

  // Sections CMS
  getSections: () => request('/sections'),

  getSection: (sectionKey) => request(`/sections/${sectionKey}`),

  updateSection: (sectionKey, data, title) =>
    request(`/sections/${sectionKey}`, {
      method: 'PUT',
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

  deleteInquiry: (id) =>
    request(`/inquiries/${id}`, {
      method: 'DELETE'
    })
};

export default api;
