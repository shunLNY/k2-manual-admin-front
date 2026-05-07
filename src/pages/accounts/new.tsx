/** @format */

import AccountEntry from '@/components/accounts/entry';
import MainLayout from '@/components/layout/main-layout';
import { CategoryListContextProvider } from '@/store/categories-context';
import { ListPageContextProvider } from '@/store/list-page-context';
import Head from 'next/head';
import { JSX } from 'react';

const AccountPageIndex = () => {
  return (
    <>
      <Head>
        <title>アカウント作成 | Admin - K2 マニュアル</title>
      </Head>
      <AccountEntry mode={'new'} />
    </>
  );
};



AccountPageIndex.getLayout = function getLayout(page: JSX.Element) {
  return (
    <>
      <CategoryListContextProvider>
        <ListPageContextProvider>
          <MainLayout title='アカウント作成'>{page}</MainLayout>
        </ListPageContextProvider>
      </CategoryListContextProvider>
    </>
  );
};

export default AccountPageIndex;
