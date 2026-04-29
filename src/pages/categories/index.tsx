/** @format */

import CategoriesList from '@/components/categories/list';
import MainLayout from '@/components/layout/main-layout';
import Head from 'next/head';

const Category = () => {
  return (
    <>
      <Head>
        <title>カテゴリー一覧 | Admin - K2 マニュアル</title>
      </Head>
      <CategoriesList />
    </>
  );
};

Category.getLayout = function getLayout(page: any) {
  return (
    <>
      <MainLayout title='カテゴリー一覧'>{page}</MainLayout>
    </>
  );
};

export default Category;
