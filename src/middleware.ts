/** @format */

import { withAuth } from 'next-auth/middleware';

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET || 'k2-manual-admin-secret-key-202605',
  pages: {
    signIn: '/auth/signin',
  },
});

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/articles',
    '/categories',
    '/accounts',
    '/articles/:path*',
    '/categories/:path*',
    '/accounts/:path*',
  ],
};
