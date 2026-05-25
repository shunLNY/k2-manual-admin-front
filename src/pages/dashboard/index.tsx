/** @format */

import DashBoard from '@/components/dashboard/dashboard';
import MainLayout from '@/components/layout/main-layout';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || (session as { error?: string }).error) {
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

DashboardPage.getLayout = function getLayout(page: any) {
	return (
		<>
			<MainLayout title='ダッシュボード'>{page}</MainLayout>
		</>
	);
};

export default DashboardPage;
