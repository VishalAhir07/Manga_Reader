import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useMangaChapters = (mangaId) => {
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await api.getMangaDetails(mangaId);
        setManga(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (mangaId) {
      fetchManga();
    }
  }, [mangaId]);

  return { manga, loading, error };
}; 