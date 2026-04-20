// Usamos o prefixo /api que será interceptado pelo Next.js Rewrites
const API_URL = "/api";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Garante que o endpoint comece com barra
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${cleanEndpoint}`;

  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const contentType = response.headers.get("content-type");
    let data: any = null;
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = (typeof data === 'object' && data?.message) || data || `Erro ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error: any) {
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      throw new Error("Não foi possível conectar ao servidor. Verifique se a API está ativa.");
    }
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    apiFetch<T>(endpoint, { ...options, method: "GET" }),
  
  post: <T>(endpoint: string, body: any, options: RequestInit = {}) => {
    const isFormData = body instanceof FormData;
    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    };

    return apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
      headers,
    });
  },
  
  put: <T>(endpoint: string, body: any, options: RequestInit = {}) => {
    const isFormData = body instanceof FormData;
    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    };

    return apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
      headers,
    });
  },
  
  delete: <T>(endpoint: string, options?: RequestInit) => 
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
