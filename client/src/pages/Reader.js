import {
  Box,
  Container,
  Image,
  VStack,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const MotionImage = motion(Image);

function ReaderPage({ url, pageNumber, totalPages }) {
  const [isHovered, setIsHovered] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box 
        position="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MotionImage
          src={url}
          alt={`Page ${pageNumber}`}
          w="100%"
          loading="lazy"
          cursor="zoom-in"
          borderRadius="md"
          boxShadow={isHovered ? "0 0 30px rgba(66, 153, 225, 0.4)" : "lg"}
          transition={{ duration: 0.3 }}
          whileHover={{ 
            scale: 1.03,
            filter: "brightness(1.1)",
          }}
          onClick={onOpen}
        />
        <Box
          position="absolute"
          bottom={4}
          right={4}
          bg="blackAlpha.700"
          color="white"
          px={3}
          py={1}
          borderRadius="md"
          fontSize="sm"
          transform={isHovered ? "scale(1.1)" : "scale(1)"}
          transition="0.3s all ease"
        >
          {pageNumber} / {totalPages}
        </Box>
        {/* Glowing border effect */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          borderRadius="md"
          opacity={isHovered ? 1 : 0}
          transition="0.3s all ease"
          pointerEvents="none"
          boxShadow={`inset 0 0 0 2px ${useColorModeValue('blue.400', 'blue.200')}`}
        />
      </Box>

      {/* Zoom Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalBody p={0} display="flex" justifyContent="center" alignItems="center">
            <Image
              src={url}
              alt={`Page ${pageNumber}`}
              maxH="95vh"
              objectFit="contain"
              onClick={onClose}
              cursor="pointer"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function Reader({ pages }) {
  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8}>
        {pages.map((url, index) => (
          <ReaderPage
            key={index}
            url={url}
            pageNumber={index + 1}
            totalPages={pages.length}
          />
        ))}
      </VStack>
    </Container>
  );
}

export default Reader; 