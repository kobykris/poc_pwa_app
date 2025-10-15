export const baseUrl = import.meta.env.VITE_API_URL

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T
}