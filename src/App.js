import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/review/:slugOrId" element={<ReviewPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
