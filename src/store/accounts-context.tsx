/** @format */

import React, { Dispatch, createContext, useCallback, useEffect, useState } from 'react';
import { Account } from '@/utils/types';
import { useFetch } from '@/lib/hooks/common-hooks';
import { fetcher } from '@/utils/fetcher';
import { AccountListInfo } from '@/utils/constants';

type AccountContextData = {
  listCount: number;
  items: any[];
  setItems: Dispatch<any>;
  editItem: any;
  setEditItem: Dispatch<any>;
  isEdit: boolean;
  setIsEdit: Dispatch<any>;
  keyword: string;
  setKeyword: Dispatch<any>;
  queryParams: any;
  setQueryParams: Dispatch<any>;
  handleSearch: () => void;
  resetFilter: () => void;
  isFilterActive: boolean;
  pageMeta: {};
  pageNumber: number;
  setPageNumber: Dispatch<any>;
  prevPage: () => void;
  nextPage: () => void;
  pagination: (value: number) => void;
  getAccountInfo: (value: string) => void;
  accountInfo: any;
  setAccountInfo: Dispatch<any>;
  refreshAccountRows: () => void;
  isLoading: boolean;
  isError: boolean;
  sortBy: string;
  setSortBy: Dispatch<any>;
  orderBy: string;
  setOrderBy: Dispatch<any>;
  selectedStatus: string;
  setSelectedStatus: Dispatch<any>;
  accountCreate: boolean;
  setAccountCreate: Dispatch<any>;
  isActive: string;
  setIsActive: Dispatch<any>;
  isAdmin: boolean;
  setIsAdmin :Dispatch<any>;
  isEditor: boolean;
  setIsEditor :Dispatch<any>;
};

const AccountContext = createContext<AccountContextData>({
  listCount: 0,
  items: [],
  setItems: () => { },
  editItem: [],
  setEditItem: () => { },
  isEdit: false,
  setIsEdit: () => { },
  keyword: "",
  setKeyword: () => { },
  queryParams: {},
  setQueryParams: () => { },
  handleSearch: () => { },
  resetFilter: () => { },
  isFilterActive: false,
  pageMeta: {},
  pageNumber: 1,
  setPageNumber: () => { },
  prevPage: () => { },
  nextPage: () => { },
  pagination: () => { },
  getAccountInfo: () => { },
  accountInfo: {},
  setAccountInfo: () => { },
  refreshAccountRows: () => { },
  isLoading: true,
  isError: false,
  sortBy: "",
  setSortBy: () => { },
  orderBy: "",
  setOrderBy: () => { },
  selectedStatus: "",
  setSelectedStatus: () => { },
  accountCreate: false,
  setAccountCreate: () => { },
  isActive: '',
  setIsActive: () => { },
  isAdmin : false,
  setIsAdmin : ()=>{},
  isEditor : false,
  setIsEditor : ()=>{}
});

type Props = {
  children: React.ReactNode;
};


export function AccountContextProvider({ children }: Props) {
  const [accountCreate, setAccountCreate] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [queryParams, setQueryParams] = useState<{ [key: string]: any }>({});
  const [sortBy, setSortBy] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [accountIdsUrl, setAccountIdsUrl] = useState<URL | null>(null);
  const [isActive, setIsActive] = useState('private');
  

  //checkbox
  const [ isAdmin , setIsAdmin ] = useState(false);
  const [ isEditor , setIsEditor ] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [urlPath, setUrlPath] = useState<URL | null>(null);
  const [accountInfo, setAccountInfo] = useState({});
  const [pageMeta, setPageMeta] = useState({});

  const { data: accounts, isLoading, isError, mutate: refreshAccountRows, meta } = useFetch(urlPath);
  

  useEffect(() => {
    if (accounts && !isLoading) {
      setTotalItems(meta && meta.totalItems);
      setItems(accounts);
      setPageMeta(meta);
      console.log(pageMeta, "....pageMeta in account context");
    }
  }, [accounts, isLoading]);

  useEffect(() => {
    if (!urlPath) return;
    const newUrl = new URL(urlPath);
    newUrl.searchParams.set("sortBy", String(sortBy));
    newUrl.searchParams.set("orderBy", String(orderBy));
    setUrlPath(newUrl);
  }, [sortBy, orderBy]);

  // clear query params
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
    [pageNumber, urlPath]
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
          let value = queryParams[queryKey] as object;
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
    console.log(url, "....urlurl");

    url.searchParams.set("sortBy", String(sortBy)); // Add sortBy parameter
    url.searchParams.set("orderBy", String(orderBy));
    // set is filter active
    query.length > 1 ? setIsFilterActive(true) : setIsFilterActive(false);

    // refresh if same query
    setUrlPath(url);

    !pageLoaded && setPageLoaded(true);
    return;
  }, [keyword, queryParams, urlPath, isSubmitClear, pageLoaded]);


  const getAccountInfo = async (id: string) => {
    try {
      const res = await fetcher("/api/proxy/admin/accounts/" + id, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res && res?.data) {
        setAccountInfo(res.data);
      }
      return res.data;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    // getEstimateInfo();
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
  }, [isSubmitClear]);

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

export default AccountContext
