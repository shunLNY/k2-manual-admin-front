/** @format */

// import { getSession, signOut } from 'next-auth/react';
import { NEXT_PUBLIC_APP_URL } from '@/utils/constants';

let refreshingToken = false;
class FetchError extends Error {
  info: any;
  status: number | undefined;
}

export const fetcher = async (arg: any, ...args: any) => {
  const res = await fetch(arg, ...args);

  if (!res.ok) {
    const error = new FetchError('An error occurred while fetching the data.');

    if (refreshingToken) {
      throw error;
    }

    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;

    // if (error.status === 401) {
    //   signOut({ callbackUrl: NEXT_PUBLIC_APP_URL + '/auth/signin' });
    //   if (!refreshingToken) {
    //     refreshingToken = true;

    //     //const session = await getSession();
    //     getSession()
    //       .then((res: any) => {
    //         if (res?.error === 'RefreshAccessTokenError') {
    //           console.log(res.user, '.......fetcher Error');

    //           signOut({ callbackUrl: NEXT_PUBLIC_APP_URL + '/auth/signin' });
    //         }
    //       })
    //       .catch((err) => {
    //         throw error;
    //       })
    //       .finally(() => {
    //         refreshingToken = false;
    //       });
    //   }
    // }

    throw error;
  }
  return res.json();
};
