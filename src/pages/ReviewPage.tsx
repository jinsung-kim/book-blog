import React, { useEffect, useState } from 'react';
import Container from '../components/Container';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import { BookReviewPost } from '../utils/types';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../utils/supabase';
import './styles/ReviewPage.css';

export default function ReviewPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [post, setPost] = useState<BookReviewPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPost() {
      if (!uuid) return;

      const { data, error } = await supabase
        .from('book_review_posts')
        .select()
        .eq('uuid', uuid)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        setPost(null);
      } else {
        setPost(data);
      }
    }

    setLoading(true);
    fetchPost().then(() => setLoading(false));
  }, [uuid]);

  return (
    <Container>
      <Navbar currentIndex={-1} />

      {/*TODO: Write loading state. */}

      <div className="review-content">
        <div className="review-title-label">{post?.title}</div>
        <ReactMarkdown>{post?.content}</ReactMarkdown>

        {post?.created_at && (
          <div className="created-label">
            <b>
              Written on{' '}
              {new Date(post?.created_at)
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, '/')}
            </b>
          </div>
        )}
      </div>
    </Container>
  );
}
