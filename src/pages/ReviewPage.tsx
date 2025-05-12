import React, { useEffect, useState } from 'react';
import Container from '../components/Container';
import Navbar from '../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { BookReviewPost } from '../utils/types';
import ReactMarkdown from 'react-markdown';
import { fetchBookReviewPost } from '../utils/supabase';
import './styles/ReviewPage.css';
import { TagsRow } from '../components/PostPreviewCard';
import { isValidUuid } from '../utils/uuid';

export default function ReviewPage() {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BookReviewPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!slugOrId) return;

    setLoading(true);
    fetchBookReviewPost(slugOrId)
      .then(data => {
        if (!data) return;
        setPost(data);

        if (isValidUuid(slugOrId) && data.slug && slugOrId !== data.slug) {
          navigate(`/review/${data.slug}`, { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [slugOrId, navigate]);

  return (
    <Container>
      <Navbar currentIndex={-1} />

      {loading ? (
        <>
          <div className="review-content loading">
            <div className="skeleton-title" />
            <div className="skeleton-paragraph" />
            <div className="skeleton-image" />
            <div className="skeleton-paragraph short" />
            <div className="skeleton-paragraph" />
            <div className="skeleton-paragraph" />
            <div className="skeleton-paragraph short" />
            <div className="skeleton-paragraph" />
            <div className="skeleton-tags" />
          </div>
        </>
      ) : (
        <div className="review-content">
          <div className="review-title-label">{post?.title}</div>
          <ReactMarkdown>{post?.content}</ReactMarkdown>

          <div className="footer-metadata">
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

            <TagsRow tags={post?.tags ?? []} allowInteraction={true} />
          </div>
        </div>
      )}
    </Container>
  );
}
