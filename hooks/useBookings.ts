import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Booking } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          experience:experiences(*)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (experienceId: string, date: string, time: string, guests: number, specialRequests?: string) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        experience_id: experienceId,
        date,
        time,
        guests,
        special_requests: specialRequests,
        status: 'confirmed',
      })
      .select()
      .single();

    if (error) throw error;
    await fetchBookings(); // Refresh bookings
    return data;
  };

  const cancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) throw error;
    await fetchBookings(); // Refresh bookings
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.date) >= new Date()
  );

  const pastBookings = bookings.filter(booking => 
    booking.status === 'completed' || new Date(booking.date) < new Date()
  );

  return { 
    bookings, 
    upcomingBookings, 
    pastBookings, 
    loading, 
    error, 
    createBooking, 
    cancelBooking, 
    refetch: fetchBookings 
  };
}