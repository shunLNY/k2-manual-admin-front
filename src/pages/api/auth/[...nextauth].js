/** @format */

import dayjs from 'dayjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Cookies from 'universal-cookie';
import { isIpAddress } from '@/utils/helpers';
import axios from 'axios';

var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);
var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

const getDomainWithoutSubdomain = (url) => {
  const newUrl = new URL(url);

  if (isIpAddress(newUrl.hostname)) return newUrl.hostname;

  const urlParts = newUrl.hostname.split('.');

  if (process.env.APP_ENV === 'local') {
    return urlParts.slice(0).join('.');
  } else {
    return urlParts
      .slice(0)
      .slice(-(urlParts.length === 4 ? 3 : 2))
      .join('.');
  }
};

const useSecureCookies = process.env.NEXTAUTH_URL.startsWith('https://');
const cookiePrefix = useSecureCookies ? '__Secure-' : '';
const hostName = getDomainWithoutSubdomain(process.env.NEXTAUTH_URL);
const sessionTokenDomain =
  process.env.APP_ENV === 'local' || isIpAddress(hostName)
    ? hostName
    : '.' + hostName;

export const authOptions = {
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        domain: sessionTokenDomain,
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: useSecureCookies,
      },
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 4 * 24 * 60 * 60,
  },

  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 4 * 24 * 60 * 60,

    // You can define your own encode/decode functions for signing and encryption
  },

  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'email',
          placeholder: 'email@domain.com',
        },
        password: {
          label: 'password',
          type: 'password',
        },
        role: {
          label: 'role',
          type: 'role',
        },
      },
      // async authorize(credentials, req) {
      //   const payload = {
      //     email: credentials.email,
      //     password: credentials.password,
      //     role: credentials.role || 'admin',
      //   };

      //   const headers = {
      //     'user-agent': req.headers['user-agent'],
      //     'Content-Type': 'application/json',
      //     'x-device-type': 'pc',
      //     'x-name': credentials.email, //  name is same as user id
      //   };

      //   const ip =
      //     req.headers['x-real-ip'] ||
      //     req.headers['x-forwarded-for'] ||
      //     req.connection?.remoteAddress;

      //   if (ip) headers['X-Forwarded-For'] = ip;

      //   const res = await axios({
      //     method: 'post',
      //     url: process.env.NEXT_PUBLIC_API_ENDPOINT + '/auth/login',
      //     data: payload,
      //     headers: {
      //       'user-agent': req.headers['user-agent'],
      //       'Content-Type': 'application/json',
      //       'x-device-type': 'pc',
      //     },
      //   });

      //   const u = await res.data;
      //   console.log(res, '............................aaa');
      //   // If no error and we have user data, return it
      //   if (res.status === 201 && u.token) {
      //     const user = {
      //       ...u.data,
      //       accessToken: u.token.accessToken,
      //       refreshToken: u.token.refreshToken,
      //       accessTokenExpire: u.token.accessTokenExpire,
      //       user: credentials.user,
      //       userAgent: req.headers['user-agent'],
      //     };
      //     return user;
      //   }
      //   if (ip) user.ipAddress = ip;
      //   // Return null if user data could not be retrieved
      //   return null;
      // },

      async authorize(credentials, req) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
      {
        email: credentials.email,
        password: credentials.password,
        role: credentials.role || 'admin',
      },
      {
        headers: {
          'user-agent': req.headers['user-agent'],
          'Content-Type': 'application/json',
          'x-device-type': 'pc',
        },
      }
    );

    console.log("LOGIN RESPONSE:", res.data);

    const data = res.data;

    // adjust based on real backend response
    const token = data.tokens || data.token || data.data?.tokens;

    if (!token) return null;

    return {
      id: data.data?.id || data.data?.account_id,
      ...data.data,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      accessTokenExpire: token.accessTokenExpire,
      userAgent: req.headers['user-agent'],
    };
  } catch (error) {
    console.error("Login API Error:", error.response?.data || error.message);
    return null;
  }
}
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // token = updatedToken ? updatedToken : token;
      // console.log(account, "......next auth account");
      // console.log(user, "......next auth user");
      // console.log(session, "......next auth session");
      // console.log(trigger, "......next auth trigger");
      if (trigger === 'update') {
        token.account_name = session.account_name;
        return token;
      }

      if (user) {
        console.log(user, '......if next user account');
        token.uid = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpire = user.accessTokenExpire;
        token.userAgent = user.userAgent;
        token.ipAddress = user?.ipAddress;
        token.account_name = user.account_name;
        token.role = user.role;
        token.account_id = user.account_id;
      }
      console.log(
        dayjs(dayjs().format('YYYYMMDDHHmmss')).isSameOrAfter(
          dayjs(token.accessTokenExpire)
        ),
        'res...'
      );
      if (
        dayjs(dayjs().format('YYYYMMDDHHmmss')).isSameOrAfter(
          dayjs(token.accessTokenExpire)
        )
      ) {
        console.log('getting refresh token.........................');

        const headers = {
          'Content-Type': 'application/json',
          'x-name': token.name,
          'x-device-type': 'pc',
          'x-refresh-token': token.refreshToken,
          'user-agent': token.userAgent,
        };
        if (user?.ipAddress) headers['X-Forwarded-For'] = user?.ipAddress;

        const res = await fetch(
          process.env.PROXY_API_ENDPOINT + '/auth/token/new',
          {
            method: 'POST',
            headers,
          }
        );
        const data = await res.json();
        console.log(data, '................generate new token');
        if (res.status === 201 && data.token) {
          console.log('res.status 201.................', res.status);
          token.accessToken = data.token.accessToken
            ? data.token.accessToken
            : token.accessToken;

          token.accessTokenExpire = data.token.accessTokenExpire
            ? data.token.accessTokenExpire
            : token.accessTokenExpire;

          token.refreshToken = data.token.refreshToken;

          delete token.error;
        }
        if (res.status === 401) {
          console.log('res.status 401....', res.status);
          token.error = 'RefreshAccessTokenError';
        }
        // console.log(token, "..............return token");

        return token;
      }

      console.log(token, '....................final token');
      return token;
    },
    async session({ session, token, user }) {
      session.name = token.name;
      session.user.uid = token.uid;
      session.user.email = token.email;
      session.user.account_name = token.account_name
      session.user.role = token.role
      session.user.account_id = token.account_id

      // session.user.roles = {
      //     isOwner: token.isOwner,
      // };

      session.error = token.error;
      session.accessToken = token.accessToken;
      session.ipAddress = token?.ipAddress;
      console.log(session, '..................session');
      return session;
    },
  },
  events: {
    async signOut(message) {
      const cookie = new Cookies();
      cookie.remove(`${cookiePrefix}next-auth.session-token`);
    },
  },
};

export default NextAuth(authOptions);
