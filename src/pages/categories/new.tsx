/** @format */
import MainLayout from '@/components/layout/main-layout';
import { CategoryListContextProvider } from '@/store/categories-context';
import { ListPageContextProvider } from '@/store/list-page-context';
import Head from 'next/head';
import { JSX } from 'react';
import CategoriesEntry from '@/components/categories/entry';

const CategoryPageIndex = () => {
  return (
    <>
      <Head>
        <title>カテゴリー作成 | Admin - K2 マニュアル</title>
      </Head>
      <CategoryListContextProvider>
        <CategoriesEntry />
      </CategoryListContextProvider>
    </>
  );
};

CategoryPageIndex.getLayout = function getLayout(page: JSX.Element) {
  return (
    <MainLayout title='カテゴリー作成'>{page}</MainLayout>
  );
};

export default CategoryPageIndex;
