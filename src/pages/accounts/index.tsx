/** @format */

import AccountList from '@/components/accounts/list';
import MainLayout from '@/components/layout/main-layout';
import Head from 'next/head';

const Category = () => {
  return (
    <>
      <Head>
        <title>アカウント一覧 | Admin - K2 マニュアル</title>
      </Head>
      <AccountList />
    </>
  );
};

Category.getLayout = function getLayout(page: any) {
  return (
    <>
      <MainLayout title='アカウント一覧'>{page}</MainLayout>
    </>
  );
};

export default Category;
