/** @format */

import { ArticleStatus } from './constants';

export type LayoutProps = {
  title: string;
  className: string;
};

export type ArticlesInfoType = {
  id: string,
  createdAt: string,
  updatedAt: string,
  title: string,
  status: string,
  publish_start_at: string | null,
  publish_end_at: string | null,
  content: string,
  excerpt: string | null,
  thumbnail_path: string,
  creator_id: string,
  editor_id: string,
  creator: Account,
  editor: Account,
  blog_categories: { value: string; label: string }[]
  categoryIds: any[]
  categories: Category[]
};

export type Category = {
  id: string,
  sort_order: number;
  status: string;
  category_name: string;
  category_slug: string;
  creatorId: string;
  editorId: string;
  blog_categories: any[];
  createdAt: string;
  updatedAt: string;
  creator: Account,
  editor: Account,
  category_id: string,
  child_categories: any[];
}

export type Account = {
  id: string,
  account_id: string,
  role: string;
  account_name: string;
  email: string;
  password: string;
}
