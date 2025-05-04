import React from 'react';
import Container from '../components/Container';
import Navbar from '../components/Navbar';

export default function IndexPage() {
  return (
    <Container>
      <Navbar currentIndex={2} />
    </Container>
  );
}
