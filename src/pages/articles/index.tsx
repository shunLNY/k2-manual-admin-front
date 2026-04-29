/** @format */

import ArticleList from '@/components/articles/list';
import MainLayout from '@/components/layout/main-layout';
import Head from 'next/head';

const Category = () => {
  return (
    <>
      <Head>
        <title>記事一覧 | Admin - K2 マニュアル</title>
      </Head>
      <ArticleList />
    </>
  );
};

Category.getLayout = function getLayout(page: any) {
  return (
    <>
      <MainLayout title='記事一覧'>{page}</MainLayout>
    </>
  );
};

export default Category;
