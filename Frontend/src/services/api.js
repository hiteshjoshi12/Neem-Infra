const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to make API requests with Authorization header
 */
async function request(endpoint, options = {}) {
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
    console.warn(`[API] Error on ${endpoint}:`, error.message);
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
