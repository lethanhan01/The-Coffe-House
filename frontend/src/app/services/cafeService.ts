const API_URL = 'http://localhost:3000/api';

export interface Cafe {
  // id: number;
  // ownerId: number;
  // nameJp: string;
  // nameVn: string;
  // address: string;
  // phoneNumber?: string | null;
  // openHours?: string | null;
  // isOpen: boolean;
  // isCrowded: boolean;
  // averageRating: number;
  // reviewCount: number;
  // coverImageUrl?: string | null;
  id: string;
  owner_id: string | number;
  name: string;
  nameJP: string;
  address: string;
  phone: string;
  openingHours: {
    day: string;
    hours: string;
  }[];
  isOpen: boolean;
  status: 'normal' | 'crowded';
  amenities: {
    hasWifi: boolean;
    hasAC: boolean;
    hasOutlet: boolean;
    noSmoking: boolean;
    hasSnacks: boolean;
    hasCoffee: boolean;
  };
  menu: MenuItem[];
  rating: number;
  reviewCount: number;
  images: string[];
  lat: number;
  lng: number;
  place_id?: string | number;
}
export interface MenuItem {
  id: string;
  name: string;
  nameJP: string;
  price: number;
  category: string;
  image?: string;
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
export interface CreateCafeInput {
  owner_id: number;
  name_jp: string;
  name_vn: string;
  address: string;
  phone_number: string;
  open_hours?: string;
  cover_image_url?: string;
  place_id?: string | number;
  lat?: string | number;
  lon?: string | number;
  amenities: {
    has_ac?: boolean;
    has_wifi?: boolean;
    is_quiet?: boolean;
    has_snacks?: boolean;
    has_outlets?: boolean;
    is_non_smoking?: boolean;
    has_high_tables?: boolean;
  };
}
export const createCafe = async (
  cafeData: CreateCafeInput
): Promise<Cafe | null> => {
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
// export const createCafe = async (cafeData: Partial<Cafe>): Promise<Cafe | null> => {
//   try {
//     const response = await fetch(`${API_URL}/cafes`, {
//       method: 'POST',
//       headers: getHeaders(),
//       body: JSON.stringify(cafeData)
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       console.error('Cafe creation failed:', error);
//       return null;
//     }

//     const result: CafeResponse = await response.json();
//     return (result.data as Cafe) || null;
//   } catch (error) {
//     console.error('Error creating cafe:', error);
//     return null;
//   }
// };

// 5. Update cafe (owner only)
export interface UpdateCafeInput {
  name_jp: string,
  name_vn: string,
  address: string,
  phone_number: string,
  cover_image_url: string,
  amenities: {
    has_ac?: boolean,
    has_wifi?: boolean,
    has_snacks?: boolean,
    has_outlets?: boolean,
    is_non_smoking?: boolean,
    has_high_tables?: boolean,
  },
};
export const updateCafe = async (cafeId: number, cafeData: UpdateCafeInput): Promise<Cafe | null> => {
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

export const requestCafeDeletion = async (cafeId: number, reason: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/cafes/${cafeId}/request-deletion`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Cafe deletion request failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting cafe deletion:', error);
    return false;
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

//8. Review cafe (for cafe owners)
export interface Review {
  id: string;
  userId: string;
  cafeId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  userName: string;
  userAvatar?: string;
}

export const getReviewsByCafeId = async (cafeId: number): Promise<Review[] | null> => {
  try {
    const response = await fetch(`${API_URL}/reviews?cafe_id=${cafeId}`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to fetch cafe reviews');
      return null;
    }

    const result = await response.json();
    const res = Array.isArray(result.data) ? result.data : result.data ? [result.data] : [];
    return res.map((review: any) => ({
      id: String(review.id),
      userId: String(review.user_id),
      cafeId: String(review.cafe_id),
      rating: review.rating,
      comment: review.comment,
      images: review.images,
      createdAt: review.createdAt,
      userName: review.userName,
      userAvatar: review?.avatarUrl || review?.userAvatar || null
    }));
  } catch (error) {
    console.error('Error fetching cafe reviews:', error);
    return null;
  }
};

// 9. Get Booking
export interface Booking {
  id: string;
  userId: string;
  cafeId: string;
  date: string;
  time: string;
  numberOfPeople: number;
  status: 'pending' | 'confirmed' | 'approved' | 'rejected';
  createdAt: string;
}
export const getBookingsByCafeId = async (cafeId: number): Promise<Booking[] | null> => {
  try {
    const response = await fetch(`${API_URL}/bookings/cafe/${cafeId}`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to fetch cafe bookings');
      return null;
    }

    const result = await response.json();
    const res = Array.isArray(result.data) ? result.data : result.data ? [result.data] : [];
    return res.map((booking: any) => ({
      id: String(booking.id),
      userId: String(booking.user_id),
      cafeId: String(booking.cafe_id),
      date: booking.booking_date,
      time: booking.booking_time,
      numberOfPeople: booking.number_of_people,
      status: booking.status,
      createdAt: booking.createdAt
    }));
  } catch (error) {
    console.error('Error fetching cafe bookings:', error);
    return null;
  }
};