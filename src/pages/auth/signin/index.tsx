import { ReactElement } from "react";
import Head from "next/head";
import { SignInContextProvider } from "@/store/signin-context";

import Login from "@/components/auth/login";
import AuthLayout from "@/components/layout/auth-layout";
import { getToken } from "next-auth/jwt";

const SignInPage = () => {
	return (
		<>
			<Head>
				<title>ログイン | Admin - K2 マニュアル</title>
			</Head>
			<Login />
			{/* <NewPassword/> */}
		</>
	);
};

SignInPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<SignInContextProvider>
			<AuthLayout>{page}</AuthLayout>
		</SignInContextProvider>
	);
};

import { type GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const token = await getToken({
		req: context.req,
		secret: process.env.NEXTAUTH_SECRET,
	});

	if (token?.accessToken && !token.error) {
		return {
			redirect: {
				destination: "/dashboard",
				permanent: false,
			},
		} as const;
	}

	return {
		props: {},
	};
}

export default SignInPage;
