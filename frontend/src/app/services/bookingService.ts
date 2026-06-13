import { API_URL, getHeaders } from './apiClient';

export interface BookingData {
  user_id: number;
  cafe_id: number;
  booking_date: string;
  booking_time: string;
  number_of_people: number;
  language?: 'vn' | 'jp';
}

export interface Booking extends BookingData {
  id: number;
  status: 'pending' | 'confirmed' | 'approved' | 'rejected';
  created_at: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data?: Booking;
}

// 1. Create a new booking
export const createBooking = async (bookingData: BookingData): Promise<Booking | null> => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Booking creation failed:', error);
      return null;
    }

    const result: BookingResponse = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
};

// 2. Get all bookings for a user
export const getUserBookings = async (userId: number): Promise<Booking[] | null> => {
  try {
    const response = await fetch(`${API_URL}/bookings/user/${userId}`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to fetch user bookings');
      return null;
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return null;
  }
};

// 3. Get all bookings for a cafe
export const getCafeBookings = async (cafeId: number): Promise<Booking[] | null> => {
  try {
    const response = await fetch(`${API_URL}/bookings/cafe/${cafeId}`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to fetch cafe bookings');
      return null;
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching cafe bookings:', error);
    return null;
  }
};

// 4. Get booking details
export const getBookingById = async (bookingId: number): Promise<Booking | null> => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to fetch booking');
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
};

// 5. Check availability for a cafe on a specific date
export const checkAvailability = async (cafeId: number, bookingDate: string): Promise<Booking[] | null> => {
  try {
    const response = await fetch(`${API_URL}/bookings/availability/cafe/${cafeId}?bookingDate=${bookingDate}`, {
      headers: getHeaders(false)
    });

    if (!response.ok) {
      console.error('Failed to check availability');
      return null;
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error checking availability:', error);
    return null;
  }
};

// 6. Update booking status
export const updateBookingStatus = async (
  bookingId: number,
  status: 'confirmed' | 'approved' | 'rejected'
): Promise<Booking | null> => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Booking status update failed:', error);
      return null;
    }

    const result: BookingResponse = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error updating booking status:', error);
    return null;
  }
};

// 7. Cancel a booking
export const cancelBooking = async (bookingId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Booking cancellation failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error canceling booking:', error);
    return false;
  }
};
