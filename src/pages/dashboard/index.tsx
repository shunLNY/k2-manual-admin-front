/** @format */

import DashBoard from '@/components/dashboard/dashboard';
import MainLayout from '@/components/layout/main-layout';
import Head from 'next/head';
import type { GetServerSidePropsContext } from 'next';
import type { ReactElement } from 'react';
import { getToken } from 'next-auth/jwt';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = await getToken({
    req: context.req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.accessToken || token.error) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return { props: {} };
}

const DashboardPage = () => {
	return (
		<>
			<Head>
				<title>ダッシュボード | Admin - K2 マニュアル</title>
			</Head>
			<DashBoard />
		</>
	);
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<>
			<MainLayout title='ダッシュボード'>{page}</MainLayout>
		</>
	);
};

export default DashboardPage;
