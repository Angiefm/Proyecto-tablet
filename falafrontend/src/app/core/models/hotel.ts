// Interfaz principal para usar en el frontend
export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  totalReviews?: number;
  amenities: string[];
  imageUrls?: string[];
  imageUrl?: string;
  description?: string;
  capacity?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// interfaz para la respuesta directa del API backend
export interface ApiHotelResponse {
  _id: string;
  name: string;
  location: string;
  description?: string;
  amenities: string[];
  basePrice: number;
  rating: number;
  totalReviews?: number;
  imageUrls?: string[];
  isActive?: boolean;
  totalCapacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelRequest {
  name: string;
  location: string;
  description: string;
  amenities: string[];
  basePrice: number;
  rating?: number;
  imageUrls?: string[];
}