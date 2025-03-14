import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MangaDetail from './pages/MangaDetail';
import Reader from './pages/Reader';
import Search from './pages/Search';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manga/:id" element={<MangaDetail />} />
          <Route path="/manga/:mangaId/chapter/:chapterId" element={<Reader />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App; 