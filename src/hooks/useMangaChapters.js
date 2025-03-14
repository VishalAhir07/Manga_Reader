import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://api.mangadex.org';

export const useMangaChapters = (mangaId) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/manga/${mangaId}/feed`, {
          params: {
            translatedLanguage: ['en'],
            order: { chapter: 'desc' },
            limit: 100
          }
        });

        const formattedChapters = response.data.data.map(chapter => ({
          id: chapter.id,
          number: chapter.attributes.chapter,
          title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter}`,
          pages: chapter.attributes.pages,
          publishDate: new Date(chapter.attributes.publishAt).toLocaleDateString()
        }));

        setChapters(formattedChapters);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (mangaId) {
      fetchChapters();
    }
  }, [mangaId]);

  return { chapters, loading, error };
}; 