/** @format */

import DashBoard from '@/components/dashboard/dashboard';
import MainLayout from '@/components/layout/main-layout';
import Head from 'next/head';

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
