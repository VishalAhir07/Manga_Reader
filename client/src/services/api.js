import axios from 'axios';

const BASE_URL = 'https://api.mangadex.org';

export const api = {
  getPopularManga: async () => {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 20,
        offset: 0,
        order: {
          followedCount: 'desc',
        },
        includes: ['cover_art'],
      },
    });
    return formatMangaResponse(response.data);
  },

  getMangaDetails: async (id) => {
    const response = await axios.get(`${BASE_URL}/manga/${id}`, {
      params: {
        includes: ['cover_art', 'author', 'artist'],
      },
    });
    return formatMangaDetails(response.data);
  },

  getChapters: async (mangaId) => {
    const response = await axios.get(`${BASE_URL}/manga/${mangaId}/feed`, {
      params: {
        translatedLanguage: ['en'],
        order: {
          chapter: 'desc',
        },
        limit: 100,
      },
    });
    return formatChapters(response.data);
  },

  getChapterPages: async (chapterId) => {
    const response = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
    return formatChapterPages(response.data);
  },

  searchManga: async (query) => {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        title: query,
        limit: 20,
        includes: ['cover_art'],
      },
    });
    return formatMangaResponse(response.data);
  },
};

// Helper functions to format API responses
const formatMangaResponse = (data) => {
  return {
    data: data.data.map((manga) => ({
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      cover: `https://uploads.mangadex.org/covers/${manga.id}/${
        manga.relationships.find((rel) => rel.type === 'cover_art').attributes.fileName
      }`,
      status: manga.attributes.status,
    })),
  };
};

const formatMangaDetails = (data) => {
  const manga = data.data;
  return {
    id: manga.id,
    title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
    description: manga.attributes.description.en || Object.values(manga.attributes.description)[0],
    status: manga.attributes.status,
    cover: `https://uploads.mangadex.org/covers/${manga.id}/${
      manga.relationships.find((rel) => rel.type === 'cover_art').attributes.fileName
    }`,
    author: manga.relationships.find((rel) => rel.type === 'author')?.attributes?.name,
  };
};

const formatChapters = (data) => {
  return data.data.map((chapter) => ({
    id: chapter.id,
    number: chapter.attributes.chapter,
    title: chapter.attributes.title,
    pages: chapter.attributes.pages,
    publishDate: new Date(chapter.attributes.publishAt).toLocaleDateString(),
  }));
};

const formatChapterPages = (data) => {
  const baseUrl = data.baseUrl;
  const hash = data.chapter.hash;
  return data.chapter.data.map(
    (page) => `${baseUrl}/data/${hash}/${page}`
  );
}; 