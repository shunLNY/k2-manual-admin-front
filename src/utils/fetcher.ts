/** @format */

// import { getSession, signOut } from 'next-auth/react';

class FetchError extends Error {
  info?: Record<string, unknown>;
  status?: number;

  constructor(message: string, info?: Record<string, unknown>, status?: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

export const fetcher = async <T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  const res = await fetch(input, init);

  if (!res.ok) {
    let errorInfo: Record<string, unknown> = {};
    try {
      errorInfo = await res.json();
    } catch (e) {
      // If res.json() fails, we just keep empty errorInfo
    }

    const error = new FetchError(
      'An error occurred while fetching the data.',
      errorInfo,
      res.status
    );

    throw error;
  }

  return res.json() as Promise<T>;
};
