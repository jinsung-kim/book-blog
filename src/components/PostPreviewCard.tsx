import React, { useMemo } from 'react';
import { capitalize } from 'lodash';
import './styles/PostPreviewCard.css';

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

        <div className="created-label">
          Created On:{' '}
          {new Date(created_at).toISOString().slice(0, 10).replace(/-/g, '/')}
        </div>
      </div>

      <div className="tags-row">
        {tags.map(t => (
          <div key={`tag-${t}-${title}`} className="tag">
            #{capitalize(t)}
          </div>
        ))}
      </div>

      <div className="quote">{openingQuote}</div>
    </div>
  );
}
