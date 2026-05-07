/** @format */
import ArticleEntry from '@/components/articles/entry';
import MainLayout from '@/components/layout/main-layout';
import { CategoryListContextProvider } from '@/store/categories-context';
import { ListPageContextProvider } from '@/store/list-page-context';
import Head from 'next/head';
import { JSX } from 'react';

const ArticlePageIndex = () => {
  return (
    <>
      <Head>
        <title>記事作成 | Admin - K2 マニュアル</title>
      </Head>
      <ArticleEntry/>
    </>
  );
};



ArticlePageIndex.getLayout = function getLayout(page: JSX.Element) {
  return (
    <>
      <CategoryListContextProvider>
        <ListPageContextProvider>
          <MainLayout title='記事作成'>{page}</MainLayout>
        </ListPageContextProvider>
      </CategoryListContextProvider>
    </>
  );
};

export default ArticlePageIndex;
