import {
  Box,
  Flex,
  Input,
  IconButton,
  useColorMode,
  useColorModeValue,
  Button,
  Container,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { FaSun, FaMoon, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      px={4}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Link to="/">
            <Box fontSize="xl" fontWeight="bold" color="brand.500">
              MangaReader
            </Box>
          </Link>

          <Flex flex={1} mx={8}>
            <form onSubmit={handleSearch} style={{ width: '100%' }}>
              <InputGroup>
                <Input
                  placeholder="Search manga..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    icon={<FaSearch />}
                    variant="ghost"
                    type="submit"
                    aria-label="Search"
                  />
                </InputRightElement>
              </InputGroup>
            </form>
          </Flex>

          <Flex alignItems="center" gap={4}>
            <Link to="/popular">
              <Button variant="ghost">Popular</Button>
            </Link>
            <Link to="/latest">
              <Button variant="ghost">Latest</Button>
            </Link>
            <IconButton
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle theme"
            />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default Navbar; 