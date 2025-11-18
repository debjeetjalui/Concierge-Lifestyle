import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Experience } from '@/types/database';

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  return { experiences, loading, error, refetch: fetchExperiences };
}

export function useSearchExperiences(query: string, category: string = 'All') {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const { experiences: allExperiences } = useExperiences();

  useEffect(() => {
    const searchExperiences = async () => {
      if (!query.trim() && category === 'All') {
        setExperiences(allExperiences);
        return;
      }

      setLoading(true);
      try {
        let queryBuilder = supabase
          .from('experiences')
          .select('*');

        if (query.trim()) {
          queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
        }

        if (category !== 'All') {
          queryBuilder = queryBuilder.eq('category', category);
        }

        const { data, error } = await queryBuilder.order('rating', { ascending: false });

        if (error) throw error;
        setExperiences(data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchExperiences, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, category, allExperiences]);

  return { experiences, loading };
}