export interface BookReviewPost {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  published: boolean;
  is_personal_favorite: boolean;
  completed: boolean;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}
