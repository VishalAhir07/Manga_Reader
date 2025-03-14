import {
  Box,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function MangaCard({ manga }) {
  return (
    <Link to={`/manga/${manga.id}`}>
      <Box
        borderRadius="lg"
        overflow="hidden"
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="md"
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
      >
        <Box position="relative">
          <Image
            src={manga.cover}
            alt={manga.title}
            w="100%"
            h="300px"
            objectFit="cover"
            fallbackSrc="/images/no-cover.png"
          />
          <Badge
            position="absolute"
            top={2}
            left={2}
            colorScheme={manga.status === 'ongoing' ? 'green' : 'blue'}
          >
            {manga.status}
          </Badge>
        </Box>

        <VStack p={4} align="stretch" spacing={2}>
          <Text fontWeight="bold" noOfLines={2}>
            {manga.title}
          </Text>
          <HStack justify="space-between" fontSize="sm">
            <Text color="gray.500">
              Ch. {manga.latestChapter || '?'}
            </Text>
            <HStack>
              <Icon as={FaStar} color="yellow.400" />
              <Text>{manga.rating || '0.0'}</Text>
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </Link>
  );
}

export default MangaCard; 