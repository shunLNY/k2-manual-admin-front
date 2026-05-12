import React, { Dispatch, createContext, useCallback, useEffect, useState, type SetStateAction, useContext } from 'react';
import type { Account, PageMeta } from '@/utils/types';
import { useFetch } from '@/lib/hooks/common-hooks';
import { fetcher } from '@/utils/fetcher';

type AccountContextData = {
  listCount: number;
  items: Account[];
  setItems: Dispatch<SetStateAction<Account[]>>;
  editItem: Account[];
  setEditItem: Dispatch<SetStateAction<Account[]>>;
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  queryParams: Record<string, string | string[]>;
  setQueryParams: Dispatch<SetStateAction<Record<string, string | string[]>>>;
  handleSearch: () => void;
  resetFilter: () => void;
  isFilterActive: boolean;
  pageMeta: PageMeta | Record<string, never>;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  prevPage: () => void;
  nextPage: () => void;
  pagination: (value: number) => void;
  getAccountInfo: (id: string) => Promise<Account | Error>;
  accountInfo: Partial<Account>;
  setAccountInfo: Dispatch<SetStateAction<Partial<Account>>>;
  refreshAccountRows: () => void;
  isLoading: boolean;
  isError: boolean;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
  selectedStatus: string;
  setSelectedStatus: Dispatch<SetStateAction<string>>;
  accountCreate: boolean;
  setAccountCreate: Dispatch<SetStateAction<boolean>>;
  isActive: string;
  setIsActive: Dispatch<SetStateAction<string>>;
  isAdmin: boolean;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  isEditor: boolean;
  setIsEditor: Dispatch<SetStateAction<boolean>>;
};

const AccountContext = createContext<AccountContextData | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export function AccountContextProvider({ children }: Props) {
  const [accountCreate, setAccountCreate] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [queryParams, setQueryParams] = useState<Record<string, string | string[]>>({});
  const [sortBy, setSortBy] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [items, setItems] = useState<Account[]>([]);
  const [editItem, setEditItem] = useState<Account[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [accountIdsUrl, setAccountIdsUrl] = useState<URL | null>(null);
  const [isActive, setIsActive] = useState('private');

  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [urlPath, setUrlPath] = useState<URL | null>(null);
  const [accountInfo, setAccountInfo] = useState<Partial<Account>>({});
  const [pageMeta, setPageMeta] = useState<PageMeta | Record<string, never>>({});

  const { data: accounts, isLoading, isError, mutate: refreshAccountRows, meta } = useFetch(urlPath);

  useEffect(() => {
    if (accounts && !isLoading) {
      setTotalItems(meta && meta.totalItems);
      setItems(accounts);
      setPageMeta(meta);
    }
  }, [accounts, isLoading, meta]);

  useEffect(() => {
    if (!urlPath) return;
    const newUrl = new URL(urlPath);
    newUrl.searchParams.set("sortBy", String(sortBy));
    newUrl.searchParams.set("orderBy", String(orderBy));
    setUrlPath(newUrl);
  }, [sortBy, orderBy]);

  const [isSubmitClear, setisSubmitClear] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const resetFilter = () => {
    setisSubmitClear(true);
  };

  const prevPage = useCallback(() => {
    if (urlPath) {
      const url = new URL(urlPath);
      const curPage = pageNumber;
      url.searchParams.set("page", (curPage - 1).toString());
      setPageNumber(pageNumber - 1);
      setUrlPath(url);
    }
  }, [pageNumber, urlPath]);

  const nextPage = useCallback(() => {
    if (urlPath) {
      const url = new URL(urlPath);
      const curPage = pageNumber;
      url.searchParams.set("page", (curPage + 1).toString());
      setPageNumber(pageNumber + 1);
      setUrlPath(url);
    }
  }, [pageNumber, urlPath]);

  const pagination = useCallback(
    (pageNumber: number) => {
      if (urlPath) {
        const url = new URL(urlPath);
        url.searchParams.set("page", pageNumber.toString());
        setPageNumber(pageNumber);
        setUrlPath(url);
      }
    },
    [urlPath]
  );

  const handleSearch = useCallback(async () => {
    setPageNumber(1);
    let query = "?";

    if (keyword.trim().length) {
      query += "keyword=" + keyword + "&";
    }

    if (Object.keys(queryParams).length) {
      let queryKey: keyof typeof queryParams;

      for (queryKey in queryParams) {
        if (queryParams.hasOwnProperty(queryKey)) {
          let key = queryKey;
          let value = queryParams[queryKey];
          if (Array.isArray(value)) {
            for (var i in value) {
              query += key + "[]" + "=" + value[i] + "&";
            }
          } else {
            query += `${key}=${value}&`;
          }
        }
      }
    }

    isSubmitClear && ((query = ""), setisSubmitClear(false));
    let url = new URL(window.location.origin + "/api/proxy/admin/accounts/paginate" + (query.length > 1 ? query : ""));

    url.searchParams.set("sortBy", String(sortBy));
    url.searchParams.set("orderBy", String(orderBy));
    query.length > 1 ? setIsFilterActive(true) : setIsFilterActive(false);

    setUrlPath(url);
    !pageLoaded && setPageLoaded(true);
    return;
  }, [keyword, queryParams, sortBy, orderBy, isSubmitClear, pageLoaded]);

  const getAccountInfo = async (id: string) => {
    try {
      const res = await fetcher<any>("/api/proxy/admin/accounts/" + id, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res && res?.data) {
        setAccountInfo(res.data);
      }
      return res.data;
    } catch (error: any) {
      return error;
    }
  };

  useEffect(() => {
    setUrlPath(new URL(window.location.origin + "/api/proxy/admin/accounts/paginate"));
    setAccountIdsUrl(new URL(window.location.origin + "/api/proxy/admin/accounts/account-ids"));
  }, []);

  useEffect(() => {
    if (isSubmitClear) {
      setKeyword("");
      setQueryParams({});
      handleSearch();
      setSelectedStatus("")
      setIsAdmin(false)
      setIsEditor(false)
      setisSubmitClear(false);
    }
  }, [isSubmitClear, handleSearch]);

  const context: AccountContextData = {
    listCount: totalItems,
    items,
    setItems,
    isEdit,
    setIsEdit,
    keyword,
    setKeyword,
    queryParams,
    setQueryParams,
    resetFilter,
    isFilterActive,
    handleSearch,
    pageMeta,
    pageNumber,
    setPageNumber,
    prevPage,
    nextPage,
    pagination,
    getAccountInfo,
    accountInfo,
    setAccountInfo,
    refreshAccountRows,
    isLoading,
    isError,
    sortBy,
    setSortBy,
    orderBy,
    setOrderBy,
    selectedStatus,
    setSelectedStatus,
    editItem,
    setEditItem,
    accountCreate,
    setAccountCreate,
    isActive,
    setIsActive,
    isAdmin,
    setIsAdmin,
    isEditor,
    setIsEditor
  };

  return <AccountContext.Provider value={context}>{children}</AccountContext.Provider>;
}

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountContextProvider');
  }
  return context;
};

export default AccountContext;
