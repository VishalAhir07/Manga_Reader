import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { theme } from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Manga from './pages/Manga';
import Reader from './pages/Reader';
import Search from './pages/Search';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manga/:id" element={<Manga />} />
          <Route path="/chapter/:mangaId/:chapterId" element={<Reader />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App; 