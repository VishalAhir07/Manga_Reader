const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4536;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static('public'));

// Manga API base URL
const MANGA_API = 'https://api.mangadex.org';

// Helper function to get cover art URL
const getCoverUrl = (mangaId, coverId) => {
    return `https://uploads.mangadex.org/covers/${mangaId}/${coverId}`;
};

// Routes
app.get('/', async (req, res) => {
    try {
        // Get popular manga list
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

        res.render('home', { mangas });
    } catch (error) {
        console.error('Error:', error);
        res.render('error', { message: 'Failed to load manga list' });
    }
});

app.get('/manga/:id', async (req, res) => {
    try {
        const mangaId = req.params.id;

        // Get manga details and chapters in parallel
        const [mangaRes, chaptersRes] = await Promise.all([
            axios.get(`${MANGA_API}/manga/${mangaId}?includes[]=cover_art&includes[]=author`),
            axios.get(`${MANGA_API}/manga/${mangaId}/feed`, {
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
            cover: coverFile ? getCoverUrl(mangaId, coverFile) : null,
            status: mangaRes.data.data.attributes.status,
            author: mangaRes.data.data.relationships.find(rel => rel.type === 'author')?.attributes?.name || 'Unknown',
            chapters: chaptersRes.data.data
                .filter(chapter => chapter.attributes.chapter) // Filter out chapters without numbers
                .map(chapter => ({
                    id: chapter.id,
                    number: Number(chapter.attributes.chapter),
                    title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter}`,
                    uploadDate: new Date(chapter.attributes.publishAt).toLocaleDateString()
                }))
                .sort((a, b) => b.number - a.number) // Sort chapters in descending order
        };

        res.render('manga', { manga });
    } catch (error) {
        console.error('Error:', error);
        res.render('error', { message: 'Failed to load manga details' });
    }
});

// Update the search endpoint
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.redirect('/');
        }

        const response = await axios.get(`${MANGA_API}/manga`, {
            params: {
                title: query,
                limit: 32,
                offset: 0,
                includes: ['cover_art', 'author'],
                contentRating: ['safe', 'suggestive'],
                order: { relevance: 'desc' }
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
                status: manga.attributes.status,
                latestChapter: manga.attributes.lastChapter || '?',
                rating: manga.attributes.rating || '0.0'
            };
        });

        res.render('home', { 
            mangas,
            searchQuery: query 
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('error', { message: 'Search failed' });
    }
});

// Update the chapter reading endpoint
app.get('/chapter/:mangaId/:chapterId', async (req, res) => {
    try {
        const { mangaId, chapterId } = req.params;

        // Get chapter details
        const chapterRes = await axios.get(`${MANGA_API}/chapter/${chapterId}`);
        
        if (!chapterRes.data.data) {
            throw new Error('Chapter not found');
        }

        // Get the at-home server URL for the chapter
        const atHomeRes = await axios.get(`${MANGA_API}/at-home/server/${chapterId}`);
        
        if (!atHomeRes.data) {
            throw new Error('Failed to get chapter data');
        }

        // Construct the page URLs
        const { baseUrl, chapter: chapterData } = atHomeRes.data;
        const quality = 'data'; // or 'data-saver' for lower quality
        const pages = chapterData[quality].map(filename => 
            `${baseUrl}/${quality}/${chapterData.hash}/${filename}`
        );

        // Get chapter information
        const chapterInfo = {
            number: chapterRes.data.data.attributes.chapter,
            title: chapterRes.data.data.attributes.title,
            mangaId: mangaId,
            chapterId: chapterId
        };

        // Get next and previous chapters
        const chaptersRes = await axios.get(`${MANGA_API}/manga/${mangaId}/feed`, {
            params: {
                translatedLanguage: ['en'],
                limit: 100,
                order: { chapter: 'asc' }
            }
        });

        const chapters = chaptersRes.data.data
            .filter(ch => ch.attributes.chapter)
            .sort((a, b) => Number(a.attributes.chapter) - Number(b.attributes.chapter));

        const currentIndex = chapters.findIndex(ch => ch.id === chapterId);
        if (currentIndex !== -1) {
            chapterInfo.prevChapter = currentIndex > 0 ? chapters[currentIndex - 1].id : null;
            chapterInfo.nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1].id : null;
        }

        res.render('reader', { 
            pages,
            chapter: chapterInfo
        });

    } catch (error) {
        console.error('Error:', error);
        res.render('error', { 
            message: 'Failed to load chapter. ' + (error.response?.data?.message || error.message)
        });
    }
});

// Add error view
app.get('/error', (req, res) => {
    res.render('error', { message: 'An error occurred' });
});

// Add suggestions endpoint
app.get('/suggestions', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query || query.length < 2) {
            return res.json([]);
        }

        const response = await axios.get(`${MANGA_API}/manga`, {
            params: {
                title: query,
                limit: 5,
                offset: 0,
                includes: ['cover_art'],
                contentRating: ['safe', 'suggestive']
            }
        });

        const suggestions = response.data.data.map(manga => {
            const coverFile = manga.relationships
                .find(rel => rel.type === 'cover_art')
                ?.attributes?.fileName;

            return {
                id: manga.id,
                title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
                cover: coverFile ? getCoverUrl(manga.id, coverFile) : null,
                status: manga.attributes.status,
                latestChapter: manga.attributes.lastChapter
            };
        });

        res.json(suggestions);
    } catch (error) {
        console.error('Suggestions error:', error);
        res.json([]);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 