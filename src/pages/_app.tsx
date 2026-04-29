import type { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import "@/styles/global.scss";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
        <>
          <ToastContainer
            theme='light'
            autoClose={3000}
            position='top-right'
            hideProgressBar={false}
            newestOnTop={false}
            pauseOnFocusLoss
            rtl={false}
            draggable
            pauseOnHover
            closeButton={true}
            closeOnClick={true} />
          {getLayout(
            <>
              <Head>
                <meta name="robots" content="noindex, nofollow" />
                <meta
                  name='viewport'
                  content='width=device-width,user-scalable=no,initial-scale=1,minimum-scale=1,maximum-scale=1'
                />
              </Head>

              <Component {...pageProps} />

            </>
          )}
          </>
  )
}
