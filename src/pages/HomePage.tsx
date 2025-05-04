import React from 'react';
import Container from '../components/Container';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <Container>
      <Navbar currentIndex={0} />
    </Container>
  );
}
