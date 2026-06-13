import { API_URL, getHeaders } from './apiClient';

// Helper function to format date safely
export const formatPromotionDate = (dateString: string, language: 'jp' | 'vn' = 'vn'): string => {
  if (!dateString) return 'N/A';
  
  try {
    // Parse YYYY-MM-DD format safely without timezone issues
    const [year, month, day] = dateString.split('-');
    
    if (!year || !month || !day) {
      return 'Invalid Date';
    }
    
    if (language === 'jp') {
      // Return YYYY/MM/DD format for Japanese
      return `${year}/${month}/${day}`;
    } else {
      // Return localized format for Vietnamese
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('vi-VN');
    }
  } catch (error) {
    return 'Invalid Date';
  }
};

export interface PromotionData {
  cafe_id: number;
  title: string;
  title_jp: string;
  description: string;
  description_jp: string;
  image_url: string;
  valid_until: string;
}

// API Response uses camelCase from backend transformation
export interface Promotion {
  id: number;
  cafeId: number;
  title: string;
  titleJp: string;
  description: string;
  descriptionJp: string;
  imageUrl: string;
  validUntil: string;
  createdAt: string;
}

export interface PromotionResponse {
  success: boolean;
  message?: string;
  data?: Promotion | Promotion[];
}

// 1. Create a new promotion
export const createPromotion = async (promotionData: PromotionData): Promise<Promotion | null> => {
  try {
    const response = await fetch(`${API_URL}/promotions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(promotionData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Promotion creation failed:', error);
      return null;
    }

    const result: PromotionResponse = await response.json();
    return (result.data as Promotion) || null;
  } catch (error) {
    console.error('Error creating promotion:', error);
    return null;
  }
};

// 2. Get all promotions for a cafe
export const getCafePromotions = async (cafeId: number): Promise<Promotion[] | null> => {
  try {
    const response = await fetch(`${API_URL}/promotions/cafe/${cafeId}`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to fetch cafe promotions');
      return null;
    }

    const result: PromotionResponse = await response.json();
    return Array.isArray(result.data) ? result.data : result.data ? [result.data] : [];
  } catch (error) {
    console.error('Error fetching cafe promotions:', error);
    return null;
  }
};

// 3. Get all active promotions for a cafe
export const getCafeActivePromotions = async (cafeId: number): Promise<Promotion[] | null> => {
  try {
    const response = await fetch(`${API_URL}/promotions/cafe/active/${cafeId}`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to fetch active promotions');
      return null;
    }

    const result: PromotionResponse = await response.json();
    return Array.isArray(result.data) ? result.data : result.data ? [result.data] : [];
  } catch (error) {
    console.error('Error fetching active promotions:', error);
    return null;
  }
};

// 4. Get all global active promotions
export const getActivePromotions = async (): Promise<Promotion[] | null> => {
  try {
    const response = await fetch(`${API_URL}/promotions/active`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to fetch active promotions');
      return null;
    }

    const result: PromotionResponse = await response.json();
    return Array.isArray(result.data) ? result.data : result.data ? [result.data] : [];
  } catch (error) {
    console.error('Error fetching active promotions:', error);
    return null;
  }
};

// 5. Get promotion by ID
export const getPromotionById = async (promotionId: number): Promise<Promotion | null> => {
  try {
    const response = await fetch(`${API_URL}/promotions/${promotionId}`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to fetch promotion');
      return null;
    }

    const result: PromotionResponse = await response.json();
    return (result.data as Promotion) || null;
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return null;
  }
};

// 6. Update promotion
export const updatePromotion = async (
  promotionId: number,
  updateData: Partial<PromotionData>
): Promise<Promotion | null> => {
  try {
    const response = await fetch(`${API_URL}/promotions/${promotionId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Promotion update failed:', error);
      return null;
    }

    const result: PromotionResponse = await response.json();
    return (result.data as Promotion) || null;
  } catch (error) {
    console.error('Error updating promotion:', error);
    return null;
  }
};

// 7. Delete promotion
export const deletePromotion = async (promotionId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/promotions/${promotionId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      console.error('Failed to delete promotion');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return false;
  }
};
