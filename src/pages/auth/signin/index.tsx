import { ReactElement } from 'react';
import Head from 'next/head';
import { SignInContextProvider } from '@/store/signin-context';


import { getSession } from 'next-auth/react';
import Login from '@/components/auth/login';
import AuthLayout from '@/components/layout/auth-layout';
import NewPassword from '@/components/auth/new-password';

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

export async function getServerSideProps(context: any): Promise<any> {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default SignInPage;
