import {
  Box,
  Container,
  Image,
  Text,
  Heading,
  VStack,
  HStack,
  Badge,
  Divider,
  Button,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import axios from 'axios';R
import { useMangaChapters } from '../hooks/useMangaChapters';

function Manga() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const { chapters, loading: chaptersLoading, error: chaptersError } = useMangaChapters(id);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await axios.get(`https://api.mangadex.org/manga/${id}?includes[]=cover_art&includes[]=author`);
        const data = response.data.data;
        
        const coverFile = data.relationships
          .find(rel => rel.type === 'cover_art')
          ?.attributes?.fileName;

        setManga({
          id: data.id,
          title: data.attributes.title.en || Object.values(data.attributes.title)[0],
          description: data.attributes.description.en || Object.values(data.attributes.description)[0],
          cover: coverFile ? `https://uploads.mangadex.org/covers/${data.id}/${coverFile}` : null,
          status: data.attributes.status,
          author: data.relationships.find(rel => rel.type === 'author')?.attributes?.name
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching manga:', error);
        setLoading(false);
      }
    };

    fetchManga();
  }, [id]);

  const bgColor = useColorModeValue('white', 'gray.800');

  if (loading || chaptersLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Skeleton height="400px" />
          <Skeleton height="200px" />
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box bg={bgColor} borderRadius="lg" overflow="hidden" boxShadow="md">
        <HStack align="start" spacing={8} p={8}>
          <Image
            src={manga.cover}
            alt={manga.title}
            maxW="300px"
            borderRadius="md"
            objectFit="cover"
          />
          <VStack align="stretch" flex={1}>
            <Heading size="xl">{manga.title}</Heading>
            <HStack>
              <Badge colorScheme={manga.status === 'ongoing' ? 'green' : 'blue'}>
                {manga.status}
              </Badge>
              <Text color="gray.500">by {manga.author}</Text>
            </HStack>
            <Text>{manga.description}</Text>
          </VStack>
        </HStack>

        <Divider />

        <Box p={8}>
          <Heading size="lg" mb={4}>Chapters</Heading>
          {chaptersError && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {chaptersError}
            </Alert>
          )}
          <VStack align="stretch" spacing={2}>
            {chapters.map((chapter) => (
              <Button
                key={chapter.id}
                variant="ghost"
                justifyContent="space-between"
                onClick={() => navigate(`/chapter/${manga.id}/${chapter.id}`)}
              >
                <Text>Chapter {chapter.number}</Text>
                <Text color="gray.500">{chapter.publishDate}</Text>
              </Button>
            ))}
          </VStack>
        </Box>
      </Box>
    </Container>
  );
}

export default Manga; 