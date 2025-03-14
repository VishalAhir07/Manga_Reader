import React, { useState } from 'react';
import {
  Box,
  Container,
  Input,
  SimpleGrid,
  Image,
  Text,
  VStack,
  Heading,
  InputGroup,
  InputRightElement,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      // const data = await response.json();
      // setResults(data);
      
      // Temporary placeholder results
      setResults([
        { id: 1, title: 'Sample Manga 1', cover: 'https://via.placeholder.com/200x300' },
        { id: 2, title: 'Sample Manga 2', cover: 'https://via.placeholder.com/200x300' },
      ]);
    } catch (err) {
      setError('Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Box w="100%" maxW="600px">
          <form onSubmit={handleSearch}>
            <InputGroup size="lg">
              <Input
                placeholder="Search for manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Search"
                  icon={loading ? <Spinner size="sm" /> : <SearchIcon />}
                  onClick={handleSearch}
                  isLoading={loading}
                />
              </InputRightElement>
            </InputGroup>
          </form>
        </Box>

        {error && (
          <Text color="red.500">{error}</Text>
        )}

        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6} w="100%">
          {results.map((manga) => (
            <Link key={manga.id} to={`/manga/${manga.id}`}>
              <VStack spacing={2} align="start">
                <Image
                  src={manga.cover}
                  alt={manga.title}
                  borderRadius="md"
                  objectFit="cover"
                  w="100%"
                  h="300px"
                />
                <Heading size="sm" noOfLines={2}>
                  {manga.title}
                </Heading>
              </VStack>
            </Link>
          ))}
        </SimpleGrid>

        {results.length === 0 && !loading && searchQuery && (
          <Text color="gray.500">No results found</Text>
        )}
      </VStack>
    </Container>
  );
};

export default Search; 