/** @format */
import ArticleEntry from '@/components/articles/entry';
import MainLayout from '@/components/layout/main-layout';
import { CategoryListContextProvider } from '@/store/categories-context';
import Head from 'next/head';
import { BlogContextProvider } from '@/store/articles-context';
import { JSX } from 'react';

const ArticleEditPage = () => {
  return (
    <>
      <Head>
        <title>記事編集 | Admin - K2 マニュアル</title>
      </Head>
      <CategoryListContextProvider>
        <BlogContextProvider>
          <ArticleEntry />
        </BlogContextProvider>
      </CategoryListContextProvider>
    </>
  );
};

ArticleEditPage.getLayout = function getLayout(page: JSX.Element) {
  return (
    <MainLayout title='記事編集'>{page}</MainLayout>
  );
};

export default ArticleEditPage;
