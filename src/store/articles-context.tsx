/** @format */

import type React from 'react';
import {
  createContext,
  Dispatch,
  useCallback,
  useEffect,
  useState,
  SetStateAction,
  useContext,
} from 'react';
import { fetcher } from '@/utils/fetcher';
import { useFetch } from '@/lib/hooks/common-hooks';
import { ArticlesInfoType, PageMeta } from '@/utils/types';

type ArticleContextData = {
  listCount: number;
  items: ArticlesInfoType[];
  setItems: Dispatch<SetStateAction<ArticlesInfoType[]>>;
  editItem: ArticlesInfoType[];
  setEditItem: Dispatch<SetStateAction<ArticlesInfoType[]>>;
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
  getBlogInfo: (id: string) => Promise<ArticlesInfoType | Error>;
  blogInfo: Partial<ArticlesInfoType>;
  setBlogInfo: Dispatch<SetStateAction<Partial<ArticlesInfoType>>>;
  refreshBlogRows: () => void;
  isLoading: boolean;
  isError: boolean;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
  selectedStatus: string;
  setSelectedStatus: Dispatch<SetStateAction<string>>;
  checkedItems: string[];
  setCheckedItems: Dispatch<SetStateAction<string[]>>;
  selectedBlogs: { title: string }[];
  setSelectedBlogs: Dispatch<SetStateAction<{ title: string }[]>>;
  setCheckedUiItems: Dispatch<SetStateAction<string[]>>;
  setUrlPath: Dispatch<SetStateAction<URL | null>>;
  isAllChecked: boolean;
  setIsAllChecked: Dispatch<SetStateAction<boolean>>;
  blogCreate: boolean;
  setBlogCreate: Dispatch<SetStateAction<boolean>>;
  isPrivate: boolean;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  isDraft: boolean;
  setIsDraft: Dispatch<SetStateAction<boolean>>;
  isPublished: boolean;
  setIsPublished: Dispatch<SetStateAction<boolean>>;
};

const BlogContext = createContext<ArticleContextData | undefined>(undefined);

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
  const [editItem, setEditItem] = useState<ArticlesInfoType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [blogIdsUrl, setBlogIdsUrl] = useState<URL | null>(null)

  const [pageNumber, setPageNumber] = useState(1);
  const [urlPath, setUrlPath] = useState<URL | null>(null);
  const [blogInfo, setBlogInfo] = useState<Partial<ArticlesInfoType>>({});
  const [pageMeta, setPageMeta] = useState<PageMeta | Record<string, never>>({});
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

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogContextProvider');
  }
  return context;
};

export default BlogContext;
