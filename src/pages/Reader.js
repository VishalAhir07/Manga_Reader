import {
  Box,
  Container,
  VStack,
  Image,
  Button,
  HStack,
  useColorModeValue,
  Text,
  Skeleton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Reader() {
  const { mangaId, chapterId } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapterPages = async () => {
      try {
        const response = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
        const { baseUrl, chapter } = response.data;
        
        const pageUrls = chapter.data.map(filename => 
          `${baseUrl}/data/${chapter.hash}/${filename}`
        );

        setPages(pageUrls);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChapterPages();
  }, [chapterId]);

  const bgColor = useColorModeValue('white', 'gray.800');

  if (loading) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4}>
          <Skeleton height="600px" width="100%" />
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box bg={bgColor}>
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8}>
          <HStack w="100%" justify="space-between">
            <Button onClick={() => navigate(`/manga/${mangaId}`)}>
              Back to Manga
            </Button>
          </HStack>

          {pages.map((pageUrl, index) => (
            <Box key={index} w="100%" position="relative">
              <Image
                src={pageUrl}
                alt={`Page ${index + 1}`}
                w="100%"
                loading="lazy"
                fallback={<Skeleton height="600px" />}
              />
              <Text
                position="absolute"
                bottom={2}
                right={2}
                bg="blackAlpha.700"
                color="white"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="sm"
              >
                {index + 1} / {pages.length}
              </Text>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  );
}

export default Reader; 