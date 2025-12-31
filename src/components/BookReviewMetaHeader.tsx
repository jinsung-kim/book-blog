import React from "react";
import { BookReviewPost } from "../utils/types";
import { extractFirstImage } from '../utils/markdown';

type BookReviewMetaHeaderProps = {
    post: BookReviewPost;
    siteName?: string;
    baseUrl?: string;
    image?: string;
    misc?: Record<string, string>;
};


export default function BookReviewMetaHeader({
                                                 post,
                                                 siteName = "The Reading Corner",
                                                 baseUrl = "https://thereadingcorner.net",
                                                 misc = {},
                                             }: BookReviewMetaHeaderProps) {
    const title = `${post.title} – ${siteName}`;

    const description =
        post.content
            .replace(/[#>*_`]/g, "")
            .slice(0, 160)
            .trim() + "...";

    const coverImageUrl = extractFirstImage(post.content);

    const url = `${baseUrl}/review/${post.slug}`;

    return (
        <>
            <title>{title}</title>

            {/* Basic SEO */}
            <meta name="description" content={description} />
            <meta name="keywords" content={post.tags.join(",")} />
            <meta name="author" content="Jin Kim" />

            {/* Indexing control */}
            <meta
                name="robots"
                content={post.published && post.completed ? "index, follow" : "noindex"}
            />

            {/* Open Graph */}
            <meta property="og:type" content="article" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            {coverImageUrl && <meta property="og:image" content={coverImageUrl} />}

            {/* Article metadata */}
            <meta
                property="article:published_time"
                content={post.created_at}
            />
            <meta
                property="article:modified_time"
                content={post.updated_at}
            />
            {post.tags.map(tag => (
                <meta key={tag} property="article:tag" content={tag} />
            ))}

            {/* Personal signal */}
            {post.is_personal_favorite && (
                <meta name="reading-corner:favorites" content="true" />
            )}

            {/* Escape hatch */}
            {Object.entries(misc).map(([name, content]) => (
                <meta key={name} name={name} content={content} />
            ))}
        </>
    );
}