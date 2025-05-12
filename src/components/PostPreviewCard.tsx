import React, { useCallback, useMemo } from 'react';
import './styles/PostPreviewCard.css';
import { useNavigate } from 'react-router-dom';

export function TagsRow({
  tags,
  allowInteraction = false,
}: {
  tags: string[];
  allowInteraction?: boolean;
}) {
  const navigate = useNavigate();

  const handleTagClick = useCallback(
    (tag: string) => {
      // TODO: Handle Posthog event.

      navigate(`/?tags=${tag}`);
    },
    [navigate],
  );
  return (
    <div className="tags-row">
      {tags.map((t, i) => (
        <div
          key={`tag-${t}-${i}`}
          className="tag"
          onClick={allowInteraction ? () => handleTagClick(t) : undefined}
        >
          #{t}
        </div>
      ))}
    </div>
  );
}

export default function PostPreviewCard({
  title,
  content,
  created_at,
  tags,
  onClick,
}: {
  title: string;
  content: string;
  created_at: string;
  tags: string[];
  onClick: () => void;
}) {
  const openingQuote = useMemo(() => {
    const match = content.match(/^> (.+?)\n/);
    return match ? match[1] : null;
  }, [content]);

  return (
    <div className="post-preview-container" onClick={onClick}>
      <div className="post-header-row">
        <div className="post-header-label">{title}</div>

        {created_at && (
          <div className="created-label">
            Written{' '}
            {new Date(created_at).toISOString().slice(0, 10).replace(/-/g, '/')}
          </div>
        )}
      </div>

      <TagsRow tags={tags} />

      <div className="quote">{openingQuote}</div>
    </div>
  );
}

PostPreviewCard.Skeleton = function PostPreviewCardSkeleton() {
  return (
    <div className="post-preview-container skeleton">
      <div className="post-header-row">
        <div className="post-header-label skeleton-line skeleton-title" />
        <div className="created-label skeleton-line skeleton-date" />
      </div>

      <div className="tags-row">
        <div className="tag skeleton-line skeleton-tag" />
        <div className="tag skeleton-line skeleton-tag" />
        <div className="tag skeleton-line skeleton-tag" />
      </div>

      <div className="skeleton-line skeleton-quote" />
    </div>
  );
};
