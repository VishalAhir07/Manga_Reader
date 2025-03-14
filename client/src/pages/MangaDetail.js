import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Spinner,
  useToast
} from '@chakra-ui/react';

const MangaDetail = () => {
  const { id } = useParams();
  const [manga, setManga] = useState({
    title: 'Manga Title',
    author: 'Unknown',
    cover: 'https://via.placeholder.com/300x400',
    synopsis: 'Manga description will appear here once connected to the API.',
    chapters: [{ id: 1, title: 'Chapter 1' }]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/manga/${id}`);
        // const data = await response.json();
        
        // Temporary mock data
        const mockData = {
          title: `Manga ${id}`,
          author: 'Sample Author',
          cover: 'https://via.placeholder.com/300x400',
          synopsis: 'This is a sample synopsis for the manga. It will be replaced with real data from the API.',
          chapters: [
            { id: 1, title: 'Chapter 1: The Beginning' },
            { id: 2, title: 'Chapter 2: The Journey' },
            { id: 3, title: 'Chapter 3: The Challenge' }
          ]
        };
        setManga(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load manga details');
        toast({
          title: 'Error',
          description: 'Failed to load manga details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchMangaDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container centerContent py={10}>
        <Text color="red.500">{error}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="2xl">{manga.title}</Heading>
          <Text mt={2} color="gray.600">Author: {manga.author}</Text>
        </Box>

        <HStack spacing={8} align="start">
          <Image
            src={manga.cover}
            alt={manga.title}
            borderRadius="md"
            objectFit="cover"
            maxW="300px"
          />
          
          <VStack align="stretch" flex={1} spacing={4}>
            <Box>
              <Heading size="md">Synopsis</Heading>
              <Text mt={2}>
                {manga.synopsis}
              </Text>
            </Box>

            <Box>
              <Heading size="md">Chapters</Heading>
              <VStack mt={2} align="stretch">
                {manga.chapters.map(chapter => (
                  <Button key={chapter.id} colorScheme="blue">
                    {chapter.title}
                  </Button>
                ))}
              </VStack>
            </Box>
          </VStack>
        </HStack>
      </VStack>
    </Container>
  );
};

export default MangaDetail; 