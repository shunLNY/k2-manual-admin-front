/** @format */

import Head from 'next/head';
import MainLayout from '@/components/layout/main-layout';
import { NextPageWithLayout } from './_app';
import ProfileEntry from '@/components/my-profile';
import { AccountContextProvider } from '@/store/accounts-context';

const MyProfilePage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>自身のプロフィール | Admin - K2 マニュアル</title>
      </Head>
      <ProfileEntry />
    </>
  );
};

MyProfilePage.getLayout = function getLayout(page: any) {
  // const router = useRouter();
  return <>
    <AccountContextProvider>
      <MainLayout title='自身のプロフィール'>{page}</MainLayout>
    </AccountContextProvider>
  </>;
};

export default MyProfilePage;