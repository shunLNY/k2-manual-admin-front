/** @format */

import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import useSWRImmutable from 'swr/immutable';

export function useFetch(query: string | URL | null) {
  const { data, error, mutate } = useSWR(query, fetcher);
  return {
    data: data ? data.data : undefined,
    meta: data ? data.meta : undefined,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useAccountInfo(id : string) {
  const { data, error, mutate } = useSWR(id ? '/api/proxy/admin/accounts/' + id : null, fetcher);
  return {
    data: data ? data.data : undefined,
    meta: data ? data.meta : undefined,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useImmutableFetch(query: string | URL | null) {
  const { data, error, isLoading, mutate } = useSWRImmutable(query, fetcher);
  return {
    data: data ? data.data : undefined,
    meta: data ? data.meta : undefined,
    isLoading,
    isError: error,
    mutate,
  };
}
