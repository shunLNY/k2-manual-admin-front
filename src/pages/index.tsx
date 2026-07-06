import type { GetServerSidePropsContext } from 'next';
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

  return {
    redirect: {
      destination: '/dashboard',
      permanent: false,
    },
  };
}

export default function Home() {
  return null;
}
