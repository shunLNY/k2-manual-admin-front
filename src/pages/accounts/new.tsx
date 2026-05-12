/** @format */

import AccountEntry from '@/components/accounts/entry';
import MainLayout from '@/components/layout/main-layout';
import { CategoryListContextProvider } from '@/store/categories-context';
import Head from 'next/head';
import { JSX } from 'react';
import { AccountContextProvider } from '@/store/accounts-context';

const AccountPageIndex = () => {
  return (
    <>
      <Head>
        <title>アカウント作成 | Admin - K2 マニュアル</title>
      </Head>
      <AccountContextProvider>
        <AccountEntry mode={'new'} />
      </AccountContextProvider>
    </>
  );
};



AccountPageIndex.getLayout = function getLayout(page: JSX.Element) {
  return (
    <>
      <CategoryListContextProvider>
        <MainLayout title='アカウント作成'>{page}</MainLayout>
      </CategoryListContextProvider>
    </>
  );
};

export default AccountPageIndex;
