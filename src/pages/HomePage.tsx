import React, { useCallback, useEffect, useState } from 'react';
import Container from '../components/Container';
import Navbar from '../components/Navbar';
import { supabase } from '../utils/supabase';
import { BookReviewPost } from '../utils/types';
import PostPreviewCard from '../components/PostPreviewCard';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [posts, setPosts] = useState<BookReviewPost[]>([]);
  // TODO: Create loading state.
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function getPosts() {
      const { data: reviews } = await supabase
        .from('book_review_posts')
        .select()
        .order('created_at', { ascending: false });

      setPosts(reviews);
    }

    setLoading(true);

    getPosts().then(() => setLoading(false));
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
        {posts.map((p, i) => (
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
