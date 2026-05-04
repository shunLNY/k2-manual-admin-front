/** @format */

'use client';
import type React from 'react';
import {
  createContext,
  Dispatch,
  useCallback,
  useEffect,
  useState,
  SetStateAction,
} from 'react';
import { fetcher } from '@/utils/fetcher';
import { useFetch } from '@/lib/hooks/common-hooks';
import { ArticlesInfoType } from '@/utils/types';

type ArticleContextData = {
  listCount: number;
  items: ArticlesInfoType[];
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
  getBlogInfo: (value: string) => void;
  blogInfo: any;
  setBlogInfo: Dispatch<any>;
  refreshBlogRows: () => void;
  isLoading: boolean;
  isError: boolean;
  sortBy: string;
  setSortBy: Dispatch<any>;
  orderBy: string;
  setOrderBy: Dispatch<any>;
  selectedStatus: string;
  setSelectedStatus: Dispatch<any>;
  // openModal: boolean;
  // setOpenModal: Dispatch<any>;
  checkedItems: string[];
  setCheckedItems: Dispatch<any>;
  selectedBlogs: { title: string }[];
  setSelectedBlogs: Dispatch<any>;
  setCheckedUiItems: Dispatch<any>;
  setUrlPath: Dispatch<any>;
  isAllChecked: boolean;
  setIsAllChecked: Dispatch<SetStateAction<boolean>>;
  blogCreate: boolean;
  setBlogCreate: Dispatch<any>;
  isPrivate: boolean;
  setIsPrivate: Dispatch<any>;
  isDraft: boolean;
  setIsDraft: Dispatch<any>;
  isPublished: boolean;
  setIsPublished: Dispatch<any>;
};

const BlogContext = createContext<ArticleContextData>({
  listCount: 0,
  items: [],
  setItems: () => { },
  editItem: [],
  setEditItem: () => { },
  isEdit: false,
  setIsEdit: () => { },
  keyword: '',
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
  getBlogInfo: () => { },
  blogInfo: {},
  setBlogInfo: () => { },
  refreshBlogRows: () => { },
  isLoading: true,
  isError: false,
  sortBy: '',
  setSortBy: () => { },
  orderBy: '',
  setOrderBy: () => { },
  selectedStatus: '',
  setSelectedStatus: () => { },
  // openModal: false,
  // setOpenModal: () => { },
  checkedItems: [],
  setCheckedItems: () => { },
  selectedBlogs: [],
  setSelectedBlogs: () => { },
  isAllChecked: false,
  setIsAllChecked: () => { },
  blogCreate: false,
  setBlogCreate: () => { },
  setCheckedUiItems: () => { },
  setUrlPath: () => { },
  isPrivate: false,
  setIsPrivate: () => { },
  isDraft: false,
  setIsDraft: () => { },
  isPublished: false,
  setIsPublished: () => { },
});

type Props = {
  children: React.ReactNode;
};

export function BlogContextProvider({ children }: Props) {
  const [blogCreate, setBlogCreate] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [queryParams, setQueryParams] = useState<{ [key: string]: any }>({});
  const [sortBy, setSortBy] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [items, setItems] = useState<ArticlesInfoType[]>([]);
  const [editItem, setEditItem] = useState([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [blogIdsUrl, setBlogIdsUrl] = useState<URL | null>(null)

  const [pageNumber, setPageNumber] = useState(1);
  const [urlPath, setUrlPath] = useState<URL | null>(null);
  const [blogInfo, setBlogInfo] = useState({});
  const [pageMeta, setPageMeta] = useState({});
  const [isPrivate, setIsPrivate] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // For Check Box
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<{ title: string }[]>([]);
  const [checkedUiItems, setCheckedUiItems] = useState<string[]>([])
  const [isAllChecked, setIsAllChecked] = useState(false);

  const {
    data: blogs,
    isLoading,
    isError,
    mutate: refreshBlogRows,
    meta,
  } = useFetch(urlPath);

  useEffect(() => {
    if (blogs && !isLoading) {
      setTotalItems(meta && meta.totalItems);
      setItems(blogs);
      setPageMeta(meta);
    }
  }, [blogs, isLoading]);

  useEffect(() => {
    if (!urlPath) return;
    const newUrl = new URL(urlPath);
    newUrl.searchParams.set('sortBy', String(sortBy));
    newUrl.searchParams.set('orderBy', String(orderBy));
    setUrlPath(newUrl);
  }, [sortBy, orderBy]);

  // clear query params
  const [isSubmitClear, setIsSubmitClear] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const resetFilter = () => {
    setIsSubmitClear(true);
  };

  useEffect(() => {
    setUrlPath(new URL(window.location.origin + '/api/proxy/admin/blogs/paginate'));
    setBlogIdsUrl(new URL(window.location.origin + "/api/proxy/admin/blogs/blogs-ids"));
  }, []);

  useEffect(() => {
    if (isSubmitClear) {
      setKeyword('');
      setQueryParams({});
      handleSearch();
      setSelectedStatus('');
      setIsSubmitClear(false);
    }
  }, [isSubmitClear]);

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
      console.log(pageNumber);
      if (urlPath) {
        const url = new URL(urlPath);
        url.searchParams.set('page', pageNumber.toString());
        setPageNumber(pageNumber);
        setUrlPath(url);
      }
    },
    [urlPath]
  );

  const handleSearch = useCallback(async () => {
    const params = new URLSearchParams();

    if (keyword.trim().length) {
      params.append('keyword', keyword.trim());
    }

    if (Object.keys(queryParams).length) {
      for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          const value = queryParams[key as keyof typeof queryParams];
          if (Array.isArray(value)) {
            value.forEach(item => params.append(key, String(item)));
          } else if (value) {
            params.append(key, String(value));
          }
        }
      }
    }

    if (isSubmitClear) {
      setIsSubmitClear(false);
      setUrlPath(new URL(window.location.origin + '/api/proxy/admin/blogs/paginate'));
      setIsFilterActive(false);
      !pageLoaded && setPageLoaded(true);
      return;
    }

    params.set('sortBy', String(sortBy));
    params.set('orderBy', String(orderBy));
    params.set('page', '1');

    setPageNumber(1);

    const baseUrl = window.location.origin + '/api/proxy/admin/blogs/paginate';
    const queryString = params.toString();
    const finalUrl = new URL(baseUrl + (queryString ? `?${queryString}` : ''));

    setIsFilterActive(queryString.length > 0);

    setUrlPath(finalUrl);
    !pageLoaded && setPageLoaded(true);

  }, [keyword, queryParams, sortBy, orderBy, isSubmitClear, pageLoaded]);

  const getBlogInfo = async (id: string) => {
    try {
      const res = await fetcher("/api/proxy/admin/blogs/" + id, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (res && res?.data) {
        setBlogInfo(res.data)
      }
      return res.data
    } catch (error) {
      return error
    }
  }


  const context: ArticleContextData = {
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
    getBlogInfo,
    blogInfo,
    setBlogInfo,
    refreshBlogRows,
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
    checkedItems,
    setCheckedItems,
    selectedBlogs,
    setSelectedBlogs,
    setCheckedUiItems,
    isAllChecked,
    setIsAllChecked,
    blogCreate,
    setBlogCreate,
    setUrlPath,
    isPrivate,
    setIsPrivate,
    isDraft,
    setIsDraft,
    isPublished,
    setIsPublished,
  };

  return (
    <BlogContext.Provider value={context}>
      {children}
    </BlogContext.Provider>
  );
}

export default BlogContext;
