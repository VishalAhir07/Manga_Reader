import {
  Box,
  Flex,
  Input,
  IconButton,
  useColorMode,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import { FaSun, FaMoon, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Box 
      bg={useColorModeValue('white', 'gray.800')} 
      boxShadow="sm" 
      position="sticky" 
      top={0} 
      zIndex={1000}
    >
      <Container maxW="container.xl">
        <Flex py={4} align="center" justify="space-between">
          <Link to="/">
            <Box 
              fontSize="2xl" 
              fontWeight="bold"
              color={useColorModeValue('blue.600', 'blue.300')}
            >
              MangaReader
            </Box>
          </Link>

          <Flex align="center" gap={4}>
            <form onSubmit={handleSearch}>
              <Flex gap={2}>
                <Input
                  placeholder="Search manga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  w={{ base: '200px', md: '300px' }}
                />
                <IconButton
                  type="submit"
                  aria-label="Search"
                  icon={<FaSearch />}
                />
              </Flex>
            </form>

            <IconButton
              onClick={toggleColorMode}
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              aria-label="Toggle color mode"
            />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default Navbar; 