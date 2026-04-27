const API_URL = import.meta.env.VITE_MOCKAROO_API_URL;
const API_KEY = import.meta.env.VITE_MOCKAROO_API_KEY;

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'GET',
      ...options,
      headers: {
        'Accept': 'application/json',
        'X-API-Key': API_KEY,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} en ${endpoint}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error(`[ApiClient Error - ${endpoint}]:`, error);
    throw error;
  }
}