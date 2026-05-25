/** @format */

import { withAuth } from 'next-auth/middleware';

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized: ({ token }) => {
      if (!token) return false;
      if (token.error) return false;
      return !!token.accessToken;
    },
  },
});

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/articles',
    '/categories',
    '/accounts',
    '/my-profile',
    '/articles/:path*',
    '/categories/:path*',
    '/accounts/:path*',
  ],
};
