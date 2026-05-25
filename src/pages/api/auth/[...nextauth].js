/** @format */

import dayjs from "dayjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Cookies from "universal-cookie";
// import { isIpAddress } from "@/utils/helpers";
import axios from "axios";

var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

const isIpAddress = (value) => {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\./.test(value);
};

const getDomainWithoutSubdomain = (url) => {
  const newUrl = new URL(url);

  if (isIpAddress(newUrl.hostname)) return newUrl.hostname;

  const urlParts = newUrl.hostname.split(".");

  if (process.env.APP_ENV === "local") {
    return urlParts.slice(0).join(".");
  } else {
    return urlParts
      .slice(0)
      .slice(-(urlParts.length === 4 ? 3 : 2))
      .join(".");
  }
};

const useSecureCookies = process.env.NEXTAUTH_URL.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = getDomainWithoutSubdomain(process.env.NEXTAUTH_URL);
const sessionTokenDomain =
  process.env.APP_ENV === "local" || isIpAddress(hostName)
    ? hostName
    : "." + hostName;

export const authOptions = {
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        domain: sessionTokenDomain,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
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
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "email@domain.com",
        },
        password: {
          label: "password",
          type: "password",
        },
        role: {
          label: "role",
          type: "role",
        },
      },

      async authorize(credentials, req) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
              role: credentials.role || "admin",
            },
            {
              headers: {
                "user-agent": req.headers["user-agent"],
                "Content-Type": "application/json",
                "x-device-type": "pc",
              },
            }
          );

          const data = res.data;

          console.log("LOGIN RESPONSE => ", data);

          const userData = data.data || data.user || data.account || data;

          return {
            id: userData?.id || userData?.account_id || 1,

            email: userData?.email || credentials.email,

            name: userData?.name || userData?.account_name || "",

            account_name: userData?.account_name || "",

            role: userData?.role || "admin",

            account_id: userData?.account_id || userData?.id,

            accessToken:
              data?.accessToken ||
              data?.token?.accessToken ||
              data?.tokens?.accessToken ||
              "",

            refreshToken:
              data?.refreshToken ||
              data?.token?.refreshToken ||
              data?.tokens?.refreshToken ||
              "",

            accessTokenExpire:
              data?.accessTokenExpire ||
              data?.token?.accessTokenExpire ||
              data?.tokens?.accessTokenExpire ||
              "2099-01-01",

            userAgent: req.headers["user-agent"],
          };
        } catch (error) {
          console.error(
            "Login API Error:",
            error.response?.data || error.message
          );
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update") {
        token.account_name = session.account_name;
        return token;
      }

      if (user) {
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
      if (
        token.accessTokenExpire &&
        dayjs(dayjs().format("YYYYMMDDHHmmss")).isSameOrAfter(
          dayjs(token.accessTokenExpire)
        )
      ) {
        const headers = {
          "Content-Type": "application/json",
          "x-name": token.name,
          "x-device-type": "pc",
          "x-refresh-token": token.refreshToken,
          "user-agent": token.userAgent,
        };
        if (user?.ipAddress) headers["X-Forwarded-For"] = user?.ipAddress;

        const res = await fetch(
          process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/token/new",
          {
            method: "POST",
            headers,
          }
        );
        const data = await res.json();
        if (res.status === 201 && data.token) {
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
          token.error = "RefreshAccessTokenError";
        }

        return token;
      }

      return token;
    },
    async session({ session, token, user }) {
      session.name = token.name;
      session.user = {
        ...session.user,
        uid: token.uid,
        email: token.email,
        account_name: token.account_name,
        role: token.role,
        account_id: token.account_id,
      };
      // session.user.email = token.email;
      // session.user.account_name = token.account_name;
      // session.user.role = token.role;
      // session.user.account_id = token.account_id;

      // session.user.roles = {
      //     isOwner: token.isOwner,
      // };

      session.error = token.error;
      session.accessToken = token.accessToken;
      session.ipAddress = token?.ipAddress;
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
