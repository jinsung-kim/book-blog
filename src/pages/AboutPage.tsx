import React, { useCallback } from 'react';
import './styles/AboutPage.css';
import Container from '../components/Container';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import posthog from 'posthog-js';

export default function AboutPage() {
  const navigate = useNavigate();

  const handleFavoritesNavigate = useCallback(() => {
    navigate('/?favorite=true');
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

            <div className="link" onClick={handleFavoritesNavigate}>
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

          <div className="label row">
            Written with love. See source code&nbsp;
            <div
              className="link"
              onClick={() => {
                posthog.capture('clicked_source_code');
                window.location.href =
                  'https://github.com/jinsung-kim/book-blog';
              }}
            >
              here
            </div>
            .
          </div>
        </div>
      </div>
    </Container>
  );
}
