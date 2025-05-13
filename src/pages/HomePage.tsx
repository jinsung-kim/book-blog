import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Container from '../components/Container';
import Navbar from '../components/Navbar';
import { fetchAllTags, fetchBookReviewPosts } from '../utils/supabase';
import { BookReviewPost } from '../utils/types';
import PostPreviewCard from '../components/PostPreviewCard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './styles/HomePage.css';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filteredPosts, setFilteredPosts] = useState<BookReviewPost[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [loadingTags, setLoadingTags] = useState<boolean>(false);

  const isFavorite = searchParams.get('favorite') === 'true';
  const filteredTags = useMemo(() => {
    const raw = searchParams.get('tags');
    return raw ? raw.split(',').filter(Boolean) : [];
  }, [searchParams]);
  const showOldestFirst = searchParams.get('order') === 'oldestFirst';

  useEffect(() => {
    setLoadingTags(true);
    fetchAllTags()
      .then(setTags)
      .finally(() => setLoadingTags(false));
  }, []);

  useEffect(() => {
    setLoadingPosts(true);
    fetchBookReviewPosts({
      isPersonalFavorite: isFavorite,
      tags: filteredTags,
      showOldestFirst,
    })
      .then(setFilteredPosts)
      .finally(() => setLoadingPosts(false));
  }, [showOldestFirst, isFavorite, filteredTags]);

  const handleReviewClick = useCallback(
    (review: BookReviewPost) => {
      // TODO: Fire Posthog analytic.

      navigate(`/review/${review.slug}`);
    },
    [navigate],
  );

  const handleTagClick = useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams);
      const currentTags = new Set(
        (params.get('tags') || '').split(',').filter(Boolean),
      );

      if (currentTags.has(tag)) {
        currentTags.delete(tag);
      } else {
        currentTags.add(tag);
      }

      if (currentTags.size > 0) {
        params.set('tags', Array.from(currentTags).join(','));
      } else {
        params.delete('tags');
      }

      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const handleFavoriteClick = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    const current = params.get('favorite') === 'true';

    if (current) {
      params.delete('favorite');
    } else {
      params.set('favorite', 'true');
    }
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handleOrderClick = useCallback(
    (order: 'newestFirst' | 'oldestFirst') => {
      const params = new URLSearchParams(searchParams);
      if (order === 'oldestFirst') {
        params.set('order', 'oldestFirst');
      } else {
        params.delete('order');
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  return (
    <Container>
      <Navbar currentIndex={0} />

      <div className="filter-sort-container">
        {loadingTags ? (
          <>
            <div className="skeleton-heading" />
            <div className="filters-row-skeleton">
              {Array.from({ length: 5 }).map((_, i) => (
                <div className="skeleton-filter" key={`filter-${i}`} />
              ))}
            </div>

            <div className="skeleton-heading" />
            <div className="filters-row-skeleton">
              {Array.from({ length: 2 }).map((_, i) => (
                <div className="skeleton-filter" key={`order-${i}`} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="filters-container">
              FILTER
              <div className="filters-row">
                <div
                  className={`favorites-filter ${isFavorite ? 'active' : ''}`}
                  onClick={handleFavoriteClick}
                >
                  Favorites
                </div>

                {tags.map(t => (
                  <div
                    className={`tag ${filteredTags.includes(t) ? 'active' : ''}`}
                    onClick={() => handleTagClick(t)}
                    key={`tag-${t}`}
                  >
                    #{t}
                  </div>
                ))}
              </div>
            </div>

            <div className="sort-container">
              SORT BY
              <div className="filters-row">
                <div
                  className={`tag ${!showOldestFirst ? 'active' : ''}`}
                  onClick={() => handleOrderClick('newestFirst')}
                >
                  Newest First
                </div>
                <div
                  className={`tag ${showOldestFirst ? 'active' : ''}`}
                  onClick={() => handleOrderClick('oldestFirst')}
                >
                  Oldest First
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="reviews-container">
        {loadingPosts
          ? Array.from({ length: 10 }).map((_, i) => (
              <PostPreviewCard.Skeleton key={`skeleton-${i}`} />
            ))
          : filteredPosts.map((p, i) => (
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
