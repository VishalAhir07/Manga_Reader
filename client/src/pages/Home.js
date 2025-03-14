import {
  Container,
  SimpleGrid,
  Heading,
  Text,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import MangaCard from '../components/MangaCard';

function Home() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await api.getPopularManga();
        setMangas(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMangas();
  }, []);

  if (loading) {
    return (
      <Container maxW="container.xl" centerContent py={10}>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" centerContent py={10}>
        <Text color="red.500">Error: {error}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" mb={6}>
          Popular Manga
        </Heading>
        <SimpleGrid 
          columns={{ base: 2, md: 3, lg: 4, xl: 5 }} 
          spacing={6}
        >
          {mangas.map((manga) => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}

export default Home; 