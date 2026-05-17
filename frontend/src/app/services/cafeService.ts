const API_URL = 'http://localhost:3000/api';

export interface Cafe {
  id: number;
  name_vn: string;
  name_jp: string;
  description_vn?: string;
  description_jp?: string;
  address: string;
  phone_number: string;
  opening_time?: string;
  closing_time?: string;
  avatar_url?: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface CafeResponse {
  success: boolean;
  message?: string;
  data?: Cafe | Cafe[];
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to get headers with auth
const getHeaders = (contentType = true) => {
  const headers: HeadersInit = {};
  if (contentType) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// 1. Get all cafes
export const getAllCafes = async (): Promise<Cafe[] | null> => {
  try {
    const response = await fetch(`${API_URL}/cafes`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to fetch cafes');
      return null;
    }

    const result = await response.json();
    return Array.isArray(result.data) ? result.data : result.data ? [result.data] : [];
  } catch (error) {
    console.error('Error fetching cafes:', error);
    return null;
  }
};

// 2. Get cafe by ID
export const getCafeById = async (cafeId: number): Promise<Cafe | null> => {
  try {
    const response = await fetch(`${API_URL}/cafes/${cafeId}`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to fetch cafe');
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error fetching cafe:', error);
    return null;
  }
};

// 3. Search cafes by name
export const searchCafes = async (query: string): Promise<Cafe[] | null> => {
  try {
    const response = await fetch(`${API_URL}/cafes/search?q=${encodeURIComponent(query)}`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to search cafes');
      return null;
    }

    const result = await response.json();
    return Array.isArray(result.data) ? result.data : result.data ? [result.data] : [];
  } catch (error) {
    console.error('Error searching cafes:', error);
    return null;
  }
};

// 4. Create cafe (owner only)
export const createCafe = async (cafeData: Partial<Cafe>): Promise<Cafe | null> => {
  try {
    const response = await fetch(`${API_URL}/cafes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cafeData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Cafe creation failed:', error);
      return null;
    }

    const result: CafeResponse = await response.json();
    return (result.data as Cafe) || null;
  } catch (error) {
    console.error('Error creating cafe:', error);
    return null;
  }
};

// 5. Update cafe (owner only)
export const updateCafe = async (cafeId: number, cafeData: Partial<Cafe>): Promise<Cafe | null> => {
  try {
    const response = await fetch(`${API_URL}/cafes/${cafeId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(cafeData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Cafe update failed:', error);
      return null;
    }

    const result: CafeResponse = await response.json();
    return (result.data as Cafe) || null;
  } catch (error) {
    console.error('Error updating cafe:', error);
    return null;
  }
};

// 6. Delete cafe (owner only)
export const deleteCafe = async (cafeId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/cafes/${cafeId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Cafe deletion failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting cafe:', error);
    return false;
  }
};

// 7. Get cafes by owner
export const getCafesByOwner = async (ownerId: number): Promise<Cafe[] | null> => {
  try {
    const response = await fetch(`${API_URL}/cafes?owner_id=${ownerId}`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to fetch owner cafes');
      return null;
    }

    const result = await response.json();
    return Array.isArray(result.data) ? result.data : result.data ? [result.data] : [];
  } catch (error) {
    console.error('Error fetching owner cafes:', error);
    return null;
  }
};
