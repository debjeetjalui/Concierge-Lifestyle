import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Favorite } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          experience:experiences(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (experienceId: string) => {
    if (!user) return;

    const existingFavorite = favorites.find(fav => fav.experience_id === experienceId);

    try {
      if (existingFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existingFavorite.id);

        if (error) throw error;
        setFavorites(prev => prev.filter(fav => fav.id !== existingFavorite.id));
      } else {
        // Add to favorites
        const { data, error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            experience_id: experienceId,
          })
          .select()
          .single();

        if (error) throw error;
        setFavorites(prev => [...prev, data]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const isFavorite = (experienceId: string) => {
    return favorites.some(fav => fav.experience_id === experienceId);
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  return { favorites, loading, toggleFavorite, isFavorite, refetch: fetchFavorites };
}