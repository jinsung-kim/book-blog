import React from 'react';
import './styles/About.css';
import Container from '../components/Container';
import Navbar from '../components/Navbar';

export default function AboutPage() {
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

            {/* TODO: Make this dynamic. */}
            <div className="label">
              <i>One Hundred Years of Solitude</i> by Gabriel García Márquez
            </div>
          </div>

          <div className="question-container">
            <div className="label-bold">Favorites?</div>

            {/* TODO: Fetch dynamically with supabase. */}
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
