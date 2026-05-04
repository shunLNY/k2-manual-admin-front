/** @format */

import CategoriesEntry from '@/components/categories/entry';
import MainLayout from '@/components/layout/main-layout';
import { CategoryListContextProvider } from '@/store/categories-context';
import { ListPageContextProvider } from '@/store/list-page-context';
import Head from 'next/head';
import { JSX } from 'react';


const CategoryPageIndex = () => {
  return (
    <>
      <Head>
        <title>カテゴリー編集 | Admin - 建工管理ブログ</title>
      </Head>
      <CategoriesEntry />
    </>
  );
};

CategoryPageIndex.getLayout = function getLayout(page: JSX.Element) {
  return (
    <>
      <CategoryListContextProvider>
        <ListPageContextProvider>
          <MainLayout title='カテゴリー編集'>{page}</MainLayout>
        </ListPageContextProvider>
      </CategoryListContextProvider>
    </>
  );
};

export default CategoryPageIndex;
