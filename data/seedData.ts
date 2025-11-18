import { supabase } from '@/lib/supabase';

const sampleExperiences = [
  {
    title: 'The Golden Spoon',
    category: 'Dining',
    location: 'Downtown',
    rating: 4.9,
    reviews: 342,
    price: '$$$',
    image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Award-winning contemporary cuisine with breathtaking city views. Our chef-curated tasting menu features locally sourced ingredients.',
    features: ['7-course tasting menu', 'Wine pairing available', 'City skyline views', 'Private dining rooms'],
    duration: '2-3 hours',
    available_slots: ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
  },
  {
    title: 'Serenity Wellness Center',
    category: 'Wellness',
    location: 'Uptown',
    rating: 4.8,
    reviews: 156,
    price: '$$',
    image: 'https://images.pexels.com/photos/3865809/pexels-photo-3865809.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Holistic treatments in a tranquil environment. Experience rejuvenation through our signature wellness programs.',
    features: ['Full body massage', 'Aromatherapy session', 'Meditation garden access', 'Healthy refreshments'],
    duration: '90 minutes',
    available_slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']
  },
  {
    title: 'Skyline Bar & Lounge',
    category: 'Nightlife',
    location: 'City Center',
    rating: 4.7,
    reviews: 289,
    price: '$$',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Craft cocktails with panoramic city views. Our mixologists create unique drinks inspired by the urban landscape.',
    features: ['Craft cocktails', 'Live DJ sets', '360° city views', 'VIP seating available'],
    duration: '2-4 hours',
    available_slots: ['5:00 PM', '7:00 PM', '9:00 PM', '11:00 PM']
  },
  {
    title: 'Artisan Coffee House',
    category: 'Dining',
    location: 'Arts District',
    rating: 4.6,
    reviews: 428,
    price: '$',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Locally roasted coffee in a cozy atmosphere. Perfect for work, meetings, or simply enjoying exceptional coffee.',
    features: ['Single-origin coffee', 'Fresh pastries', 'Free WiFi', 'Outdoor seating'],
    duration: '1-2 hours',
    available_slots: ['7:00 AM', '9:00 AM', '11:00 AM', '2:00 PM']
  },
  {
    title: 'Luxury Spa Retreat',
    category: 'Wellness',
    location: 'Resort District',
    rating: 4.9,
    reviews: 203,
    price: '$$$',
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Ultimate relaxation experience with premium treatments and world-class facilities.',
    features: ['Hot stone massage', 'Facial treatment', 'Sauna access', 'Champagne service'],
    duration: '3-4 hours',
    available_slots: ['10:00 AM', '1:00 PM', '4:00 PM']
  },
  {
    title: 'Rooftop Wine Tasting',
    category: 'Entertainment',
    location: 'Historic Quarter',
    rating: 4.8,
    reviews: 167,
    price: '$$',
    image: 'https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Curated wine selection with expert sommelier guidance in an elegant rooftop setting.',
    features: ['5 wine tastings', 'Cheese pairings', 'Sommelier guidance', 'Sunset views'],
    duration: '2 hours',
    available_slots: ['4:00 PM', '6:00 PM', '8:00 PM']
  }
];

export async function seedExperiences() {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .insert(sampleExperiences)
      .select();

    if (error) {
      console.error('Error seeding experiences:', error);
      return { error };
    }

    console.log('Successfully seeded experiences:', data);
    return { data };
  } catch (err) {
    console.error('Error seeding experiences:', err);
    return { error: err };
  }
}