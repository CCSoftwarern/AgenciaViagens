import { projectId, publicAnonKey } from "./supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0c7f2afa`;

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { requireAuth = false, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  if (requireAuth) {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  } else {
    headers.Authorization = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth
export const authAPI = {
  signup: (email: string, password: string, name: string) =>
    fetchAPI("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  getCurrentUser: () =>
    fetchAPI("/auth/user", { requireAuth: true }),
};

// Promotions
export const promotionsAPI = {
  getAll: () => fetchAPI("/promotions"),
  
  getById: (id: string) => fetchAPI(`/promotions/${id}`),
  
  create: (promotion: any) =>
    fetchAPI("/promotions", {
      method: "POST",
      body: JSON.stringify(promotion),
      requireAuth: true,
    }),
  
  update: (id: string, promotion: any) =>
    fetchAPI(`/promotions/${id}`, {
      method: "PUT",
      body: JSON.stringify(promotion),
      requireAuth: true,
    }),
  
  delete: (id: string) =>
    fetchAPI(`/promotions/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),
};

// Services
export const servicesAPI = {
  getAll: () => fetchAPI("/services"),
  
  getById: (id: string) => fetchAPI(`/services/${id}`),
  
  create: (service: any) =>
    fetchAPI("/services", {
      method: "POST",
      body: JSON.stringify(service),
      requireAuth: true,
    }),
  
  update: (id: string, service: any) =>
    fetchAPI(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(service),
      requireAuth: true,
    }),
  
  delete: (id: string) =>
    fetchAPI(`/services/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),
};

// Contact
export const contactAPI = {
  submit: (contactData: any) =>
    fetchAPI("/contact", {
      method: "POST",
      body: JSON.stringify(contactData),
    }),
};
