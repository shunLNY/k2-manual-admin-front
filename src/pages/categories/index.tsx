/** @format */

import CategoriesList from '@/components/categories/list';
import MainLayout from '@/components/layout/main-layout';
import Head from 'next/head';
import { CategoryListContextProvider } from '@/store/categories-context';

const Category = () => {
  return (
    <>
      <Head>
        <title>カテゴリー一覧 | Admin - K2 マニュアル</title>
      </Head>
      <CategoryListContextProvider>
        <CategoriesList />
      </CategoryListContextProvider>
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
