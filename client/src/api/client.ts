export const BASE_URL = 'http://localhost:5081';

export async function request<T>(url: string, options?: RequestInit): Promise<T> {
    
  const response = await fetch(`${BASE_URL}${url}`, options);
  if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
    
  return response.json();
}