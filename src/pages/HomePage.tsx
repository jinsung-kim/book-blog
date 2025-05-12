import React, { useCallback, useEffect, useState } from 'react';
import Container from '../components/Container';
import Navbar from '../components/Navbar';
import { fetchBookReviewPosts, supabase } from '../utils/supabase';
import { BookReviewPost } from '../utils/types';
import PostPreviewCard from '../components/PostPreviewCard';
import { useNavigate } from 'react-router-dom';
import './styles/HomePage.css';

export default function HomePage() {
  const [posts, setPosts] = useState<BookReviewPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchBookReviewPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const handleReviewClick = useCallback(
    (review: BookReviewPost) => {
      // TODO: Fire Posthog analytic.

      navigate(`/review/${review.uuid}`);
    },
    [navigate],
  );

  return (
    <Container>
      <Navbar currentIndex={0} />

      <div className="reviews-container">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <PostPreviewCard.Skeleton key={`skeleton-${i}`} />
            ))
          : posts.map((p, i) => (
              <PostPreviewCard
                onClick={() => handleReviewClick(p)}
                title={p.title}
                content={p.content}
                created_at={p.created_at}
                tags={p.tags}
                key={`preview-${p.title}-${i}`}
              />
            ))}
      </div>
    </Container>
  );
}
