/** @format */

import AccountEntry from '@/components/accounts/entry';
import MainLayout from '@/components/layout/main-layout';
import Head from 'next/head';
import { type ReactElement } from 'react';
import { AccountContextProvider } from '@/store/accounts-context';

const AccountEditPage = () => {
  return (
    <>
      <Head>
        <title>アカウント編集 | Admin - K2 マニュアル</title>
      </Head>
      <AccountContextProvider>
        <AccountEntry mode={'edit'} />
      </AccountContextProvider>
    </>
  );
};

AccountEditPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout title='アカウント編集'>{page}</MainLayout>
  );
};

export default AccountEditPage;
