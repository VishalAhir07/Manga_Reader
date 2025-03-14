import {
  Box,
  Image,
  Text,
  Badge,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MotionBox = motion(Box);

function MangaCard({ manga }) {
  const hoverBg = useColorModeValue('rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255, 0.3)');
  
  return (
    <Link to={`/manga/${manga.id}`}>
      <MotionBox
        position="relative"
        borderRadius="lg"
        overflow="hidden"
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="md"
        whileHover={{ 
          scale: 1.08,
          transition: { duration: 0.3 },
          boxShadow: "0px 0px 20px rgba(0,0,0,0.2)"
        }}
        role="group"
      >
        <Box position="relative" overflow="hidden">
          <Image
            as={motion.img}
            src={manga.cover}
            alt={manga.title}
            w="100%"
            h="300px"
            objectFit="cover"
            fallbackSrc="/images/no-cover.png"
            transition="0.5s all ease"
            _groupHover={{
              transform: "scale(1.1)",
              filter: "brightness(0.8)"
            }}
          />
          {/* Glowing border effect */}
          <Box
            position="absolute"
            top="-2px"
            left="-2px"
            right="-2px"
            bottom="-2px"
            opacity="0"
            transition="0.3s all ease"
            _groupHover={{
              opacity: 1,
              boxShadow: "inset 0 0 20px rgba(66, 153, 225, 0.6)"
            }}
            pointerEvents="none"
          />
          {/* Overlay with text */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg={hoverBg}
            opacity="0"
            transition="0.3s all ease"
            _groupHover={{ opacity: 1 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <Text
              color="white"
              fontSize="xl"
              fontWeight="bold"
              textAlign="center"
              px={4}
              opacity="0"
              transform="translateY(20px)"
              transition="0.3s all ease"
              _groupHover={{ 
                opacity: 1,
                transform: "translateY(0)",
                textShadow: "0 0 10px rgba(255,255,255,0.5)"
              }}
            >
              View Details
            </Text>
            <Badge
              colorScheme={manga.status === 'ongoing' ? 'green' : 'blue'}
              opacity="0"
              transform="translateY(20px)"
              transition="0.3s all ease 0.1s"
              _groupHover={{ 
                opacity: 1,
                transform: "translateY(0)"
              }}
            >
              {manga.status}
            </Badge>
          </Box>
        </Box>

        <VStack 
          p={4} 
          align="stretch" 
          spacing={2}
          bg={useColorModeValue('white', 'gray.800')}
          transition="0.3s all ease"
          _groupHover={{
            bg: useColorModeValue('blue.50', 'gray.700')
          }}
        >
          <Text 
            fontWeight="bold" 
            noOfLines={2}
            transition="0.3s all ease"
            _groupHover={{ 
              color: "blue.500",
              transform: "translateX(5px)"
            }}
          >
            {manga.title}
          </Text>
        </VStack>
      </MotionBox>
    </Link>
  );
}

export default MangaCard; 