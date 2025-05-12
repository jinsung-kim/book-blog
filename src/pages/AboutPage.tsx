import React, { useCallback } from 'react';
import './styles/AboutPage.css';
import Container from '../components/Container';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  const handleFavoritesRenavigate = useCallback(() => {
    navigate('/index?filters=favorites');
  }, [navigate]);

  return (
    <Container>
      <Navbar currentIndex={1} />

      <div className="about-container">
        <div className="question-container">
          <div className="label-bold">What is this?</div>
          <div className="label">
            This is a project dedicated to reflect on the books I have read. A
            way to stay consistent and preserve my thoughts.
          </div>
          <div className="label">
            I own a personal copy of most books featured here and am always
            happy to lend them to friends.
          </div>
        </div>

        <div className="main-content">
          <div className="question-container">
            <div className="label-bold">What are you currently reading?</div>

            <div className="label">
              <i>One Hundred Years of Solitude</i> by Gabriel García Márquez
            </div>
          </div>

          <div className="question-container">
            <div className="label-bold">Favorites?</div>

            <div className="favorites-link" onClick={handleFavoritesRenavigate}>
              Click here to see all of my favorites here.
            </div>
          </div>

          <div className="question-container">
            <div className="label-bold">Favorite writers?</div>

            <ul>
              <li>David Foster Wallace</li>
              <li>Joan Didion</li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}
