/** @format */

import AccountList from "@/components/accounts/list";
import MainLayout from "@/components/layout/main-layout";
import Head from "next/head";

import { AccountContextProvider } from "@/store/accounts-context";

const Category = () => {
	return (
		<>
			<Head>
				<title>アカウント | Admin - K2 マニュアル</title>
			</Head>
			<AccountContextProvider>
				<AccountList />
			</AccountContextProvider>
		</>
	);
};

Category.getLayout = function getLayout(page: any) {
	return (
		<>
			<MainLayout title="アカウント">{page}</MainLayout>
		</>
	);
};

export default Category;
