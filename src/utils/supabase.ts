import { createClient } from '@supabase/supabase-js';
import { BookReviewPost } from './types';
import { isValidUuid } from './uuid';
import posthog from 'posthog-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

interface FetchBookReviewOptions {
  showOldestFirst?: boolean;
  isPersonalFavorite?: boolean;
  tags?: string[];
}

export async function fetchBookReviewPosts(
  options: FetchBookReviewOptions = {},
): Promise<BookReviewPost[]> {
  const { showOldestFirst = false, isPersonalFavorite, tags } = options;

  posthog.capture('fetch_book_review_posts', { options });

  let query = supabase
    .from('book_review_posts')
    .select()
    .eq('published', true)
    .order('created_at', { ascending: showOldestFirst });

  if (!!isPersonalFavorite) {
    query = query.eq('is_personal_favorite', isPersonalFavorite);
  }

  if (tags?.length > 0) {
    query = query.contains('tags', tags);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching book reviews:', error);
    return [];
  }

  return data ?? [];
}

export async function fetchBookReviewPost(
  identifier: string,
): Promise<BookReviewPost | null> {
  posthog.capture('fetch_book_review_post', { identifier });

  if (isValidUuid(identifier)) {
    const { data, error } = await supabase
      .from('book_review_posts')
      .select('*')
      .eq('uuid', identifier)
      .single();

    if (error) {
      console.error('Error fetching by uuid:', error);
      return null;
    }

    return data;
  } else {
    const { data, error } = await supabase
      .from('book_review_posts')
      .select('*')
      .eq('slug', identifier)
      .single();

    if (error) {
      console.error('Error fetching by slug:', error);
      return null;
    }

    return data;
  }
}

export async function fetchAllTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('book_review_posts')
    .select('tags')
    .eq('published', true);

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  const allTags = data.flatMap(post => post.tags || []);
  const uniqueTags = Array.from(new Set(allTags));
  return uniqueTags.sort();
}
