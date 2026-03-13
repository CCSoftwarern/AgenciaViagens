import { create } from "domain";
import { projectId, publicAnonKey } from "./supabase/info";
import { Client } from "../types/client";
import { createClient } from "@supabase/supabase-js";



const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0c7f2afa`;
const RPC_URL = `https://${projectId}.supabase.co/rest/v1/rpc`;

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


async function fetchAPIRPC(endpoint: string, options: FetchOptions = {}) {
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
  const response = await fetch(`${RPC_URL}${endpoint}`, {
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

// cruises
export const cruisesAPI = {
  getAll: () => fetchAPI("/cruises"),
  getById: (id: string) => fetchAPI(`/cruises/${id}`),

  create: (cruise: any) =>
    fetchAPI("/cruises", {
      method: "POST",
      body: JSON.stringify(cruise),
      requireAuth: true,
    }),
  update: (id: string, cruise: any) =>
    fetchAPI(`/cruises/${id}`, {
      method: "PUT",
      body: JSON.stringify(cruise),
      requireAuth: true,
    }),
  delete: (id: string) =>
    fetchAPI(`/cruises/${id}`, {
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
  getAll: () => fetchAPI("/contacts"),

  submit: (contactData: any) =>
    fetchAPI("/contact", {
      method: "POST",
      body: JSON.stringify(contactData),
    }),

  delete: (id: string) =>
    fetchAPI(`/contacts/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),

};
//Dados da agencia
export const agencyAPI = {
  getInfo: () => fetchAPI("/agencyinfos"),
  getById: (id: string) => fetchAPI(`/agencyinfo/${id}`),

  create: (agencyInfo: any) =>
    fetchAPI("/agencyinfos", {
      method: "POST",
      body: JSON.stringify(agencyInfo),
      requireAuth: true,
    }),

  update: (id: string, agencyInfo: any) =>
    fetchAPI(`/agencyinfos/${id}`, {
      method: "PUT",
      body: JSON.stringify(agencyInfo),
      requireAuth: true,
    }),

  delete: (id: string) =>
    fetchAPI(`/agencyinfos/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),
};

// Clients
export const clientsAPI = {
  // 🔎 Sempre retorna ARRAY
  async getAll(): Promise<Client[]> {
    const data = await fetchAPI("/clientes");

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.clientes)) return data.clientes;
    if (Array.isArray(data?.data)) return data.data;

    return []; // fallback seguro
  },

  // 🔍 Buscar por ID
  async getById(id: string): Promise<Client | null> {
    const data = await fetchAPI(`/clientes/${id}`);
    return data ?? null;
  },

  // ➕ Criar
  async create(client: Client): Promise<Client> {
    return await fetchAPIRPC("/inserir_cliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpbWtocnpmcG1seHljdGJzc3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTUxNjIsImV4cCI6MjA3ODM3MTE2Mn0.2VCwf9JqERtFeMg6djyGbgAfUUe30gBrW9f03u9y_90",
        "Authorization": `Bearer ${publicAnonKey}`,
        Prefer: "return=representation"
      },
      body: JSON.stringify(client)
    });
  },

  // ✏️ Atualizar
  async update(client: Partial<Client>): Promise<Client> {
    return await fetchAPIRPC("/atualizar_cliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpbWtocnpmcG1seHljdGJzc3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTUxNjIsImV4cCI6MjA3ODM3MTE2Mn0.2VCwf9JqERtFeMg6djyGbgAfUUe30gBrW9f03u9y_90",
        "Authorization": `Bearer ${publicAnonKey}`,
        Prefer: "return=representation"
      },
      body: JSON.stringify(client)
    });
  },

  // 🗑️ Deletar
  async delete(id: string): Promise<{ success: boolean }> {
    return await fetchAPI(`/clientes/${id}`, {
      method: "DELETE",
      requireAuth: true,
    });
  },
};
export const salesAPI = {
  getAll: (filters?: {
    dt_venda_inicio?: string;
    dt_venda_fim?: string;
  }) => {
    // Remove chaves que não tem valor (undefined ou string vazia)
    const cleanFilters = Object.fromEntries(
      Object.entries(filters || {}).filter(([_, v]) => v != null && v !== "")
    );

    const query = new URLSearchParams(cleanFilters).toString();
    return fetchAPI(`/sales${query ? `?${query}` : ""}`);
  },
  getById: (id: string) => fetchAPI(`/sales/${id}`),

  create: (sale: any) =>
    fetchAPI("/sales", {
      method: "POST",
      body: JSON.stringify(sale),
      requireAuth: true,
    }),

  update: (id: string, sale: any) =>
    fetchAPI(`/sales/${id}`, {
      method: "PUT",
      body: JSON.stringify(sale),
      requireAuth: true,
    }),

  delete: (id: string) =>
    fetchAPI(`/sales/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),
};



// export const clientesAPI = {
//   async create(client: Client): Promise<Client> {
//   return await fetchAPI("/rest/v1/clientes", {
//     method: "POST",
//     body: JSON.stringify(client)
//   });
// },
//   async update(client: Partial<Client>): Promise<Client> {
//     return await fetchAPI(`/rest/v1/clientes`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Prefer: "return=representation"
//       },
//       body: JSON.stringify(client)
//     });
//   }
// }


// //sales
// export const salesAPI = {
//   getAll: () => fetchAPI("/sales"),
//   getById: (id: string) => fetchAPI(`/sales/${id}`),

//   create: (sale: any) =>
//     fetchAPI("/sales", {
//       method: "POST",
//       body: JSON.stringify(sale),
//       requireAuth: true,
//     }),
//     update: (id: string, sale: any) =>
//     fetchAPI(`/sales/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(sale),
//       requireAuth: true,
//     }),
//     delete: (id: string) =>
//     fetchAPI(`/sales/${id}`, {
//       method: "DELETE",
//       requireAuth: true,
//     }),
//   };



