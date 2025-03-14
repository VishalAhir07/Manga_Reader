const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4536;

app.use(cors());
app.use(express.json());

const MANGA_API = 'https://api.mangadex.org';

// Helper function for cover URLs
const getCoverUrl = (mangaId, coverId) => {
    return `https://uploads.mangadex.org/covers/${mangaId}/${coverId}`;
};

// API Routes
app.get('/api/manga/popular', async (req, res) => {
    try {
        const response = await axios.get(`${MANGA_API}/manga`, {
            params: {
                limit: 32,
                offset: 0,
                includes: ['cover_art'],
                contentRating: ['safe', 'suggestive'],
                order: { followedCount: 'desc' }
            }
        });

        const mangas = response.data.data.map(manga => {
            const coverFile = manga.relationships
                .find(rel => rel.type === 'cover_art')
                ?.attributes?.fileName;

            return {
                id: manga.id,
                title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
                cover: coverFile ? getCoverUrl(manga.id, coverFile) : null,
                status: manga.attributes.status
            };
        });

        res.json(mangas);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch manga list' });
    }
});

app.get('/api/manga/:id', async (req, res) => {
    try {
        const [mangaRes, chaptersRes] = await Promise.all([
            axios.get(`${MANGA_API}/manga/${req.params.id}?includes[]=cover_art&includes[]=author`),
            axios.get(`${MANGA_API}/manga/${req.params.id}/feed`, {
                params: {
                    translatedLanguage: ['en'],
                    order: { chapter: 'desc' },
                    limit: 500
                }
            })
        ]);

        const coverFile = mangaRes.data.data.relationships
            .find(rel => rel.type === 'cover_art')
            ?.attributes?.fileName;

        const manga = {
            id: mangaRes.data.data.id,
            title: mangaRes.data.data.attributes.title.en || Object.values(mangaRes.data.data.attributes.title)[0],
            description: mangaRes.data.data.attributes.description.en || Object.values(mangaRes.data.data.attributes.description)[0],
            cover: coverFile ? getCoverUrl(req.params.id, coverFile) : null,
            status: mangaRes.data.data.attributes.status,
            author: mangaRes.data.data.relationships.find(rel => rel.type === 'author')?.attributes?.name,
            chapters: chaptersRes.data.data
                .filter(chapter => chapter.attributes.chapter)
                .map(chapter => ({
                    id: chapter.id,
                    number: Number(chapter.attributes.chapter),
                    title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter}`,
                    uploadDate: new Date(chapter.attributes.publishAt).toLocaleDateString()
                }))
                .sort((a, b) => b.number - a.number)
        };

        res.json(manga);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch manga details' });
    }
});

app.get('/api/chapter/:mangaId/:chapterId', async (req, res) => {
    try {
        const { chapterId } = req.params;
        const atHomeRes = await axios.get(`${MANGA_API}/at-home/server/${chapterId}`);
        
        const { baseUrl, chapter } = atHomeRes.data;
        const pages = chapter.data.map(filename => 
            `${baseUrl}/data/${chapter.hash}/${filename}`
        );

        res.json({ pages });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chapter pages' });
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        const response = await axios.get(`${MANGA_API}/manga`, {
            params: {
                title: q,
                limit: 32,
                includes: ['cover_art'],
                contentRating: ['safe', 'suggestive']
            }
        });

        const results = response.data.data.map(manga => {
            const coverFile = manga.relationships
                .find(rel => rel.type === 'cover_art')
                ?.attributes?.fileName;

            return {
                id: manga.id,
                title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
                cover: coverFile ? getCoverUrl(manga.id, coverFile) : null,
                status: manga.attributes.status
            };
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 