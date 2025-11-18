export interface Experience {
  id: string;
  title: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  description: string;
  features: string[];
  duration?: string;
  available_slots?: string[];
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  experience_id: string;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  special_requests?: string;
  created_at: string;
  experience?: Experience;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  location?: string;
  phone?: string;
  preferences: string[];
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  experience_id: string;
  created_at: string;
  experience?: Experience;
}