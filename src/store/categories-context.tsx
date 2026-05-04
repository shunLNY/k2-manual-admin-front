"use client"
import { useFetch } from "@/lib/hooks/common-hooks"
import { fetcher } from "@/utils/fetcher"
import type React from "react"
import { createContext, type Dispatch, type SetStateAction, useCallback, useEffect, useState } from "react"
import type { Category } from "@/utils/types"
import { Category_list_info } from "@/utils/constants"

type CategoryContextData = {
  listCount: number
  items: any[]
  setItems: Dispatch<any>
  editItem: any
  setEditItem: Dispatch<any>
  isEdit: boolean
  setIsEdit: Dispatch<any>
  keyword: string
  setKeyword: Dispatch<any>
  queryParams: any
  setQueryParams: Dispatch<any>
  handleSearch: () => void
  resetFilter: () => void
  isFilterActive: boolean
  pageMeta: {}
  pageNumber: number
  setPageNumber: Dispatch<any>
  prevPage: () => void
  nextPage: () => void
  pagination: (value: number) => void
  getCategoryInfo: (value: string) => void
  categoryInfo: any
  setCategoryInfo: Dispatch<any>
  refreshCategoryRows: () => void
  isLoading: boolean
  isError: boolean
  sortBy: string
  setSortBy: Dispatch<any>
  orderBy: string
  setOrderBy: Dispatch<any>
  selectedStatus: string
  setSelectedStatus: Dispatch<any>
  checkedItems: string[]
  setCheckedItems: Dispatch<any>
  selectedCategories: { categoryName: string }[]
  setSelectedCategories: Dispatch<any>
  setCheckedUiItems: Dispatch<any>
  setUrlPath: Dispatch<any>
  isAllChecked: boolean
  setIsAllChecked: Dispatch<SetStateAction<boolean>>
  categoryCreate: boolean
  setCategoryCreate: Dispatch<any>
  isPrivate: boolean;
  setIsPrivate: Dispatch<any>;
  isPublished: boolean;
  setIsPublished: Dispatch<any>;
  selectedTabId: string;
  setSelectedTabId: Dispatch<SetStateAction<string>>;
}

const CategoryListContext = createContext<CategoryContextData>({
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
  getCategoryInfo: () => { },
  categoryInfo: {},
  setCategoryInfo: () => { },
  refreshCategoryRows: () => { },
  isLoading: true,
  isError: false,
  sortBy: "",
  setSortBy: () => { },
  orderBy: "",
  setOrderBy: () => { },
  selectedStatus: "",
  setSelectedStatus: () => { },
  checkedItems: [],
  setCheckedItems: () => { },
  selectedCategories: [],
  setSelectedCategories: () => { },
  setCheckedUiItems: () => { },
  setUrlPath: () => { },
  isAllChecked: false,
  setIsAllChecked: () => { },
  categoryCreate: false,
  setCategoryCreate: () => { },
  isPrivate: false,
  setIsPrivate: () => { },
  isPublished: false,
  setIsPublished: () => { },
  selectedTabId: "",
  setSelectedTabId: () => { },
})

type Props = {
  children: React.ReactNode
}

export function CategoryListContextProvider({ children }: Props) {
  const [categoryCreate, setCategoryCreate] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [queryParams, setQueryParams] = useState<{ [key: string]: any }>({})
  const [sortBy, setSortBy] = useState("")
  const [orderBy, setOrderBy] = useState("")
  const [totalItems, setTotalItems] = useState(0)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [items, setItems] = useState<Category[]>([])
  const [editItem, setEditItem] = useState([])
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [categoryIdsUrl, setCategoryIdsUrl] = useState<URL | null>(null);

  //search checkbox
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [selectedTabId, setSelectedTabId] = useState<string>(Category_list_info[0]?.id || "");

  const [pageNumber, setPageNumber] = useState(1)
  const [urlPath, setUrlPath] = useState<URL | null>(null)
  const [categoryInfo, setCategoryInfo] = useState({})
  const [pageMeta, setPageMeta] = useState({})

  // Checkbox states
  const [isAllChecked, setIsAllChecked] = useState(false)
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [checkedUiItems, setCheckedUiItems] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<{ categoryName: string }[]>([])

  const { data: categories, isLoading, isError, mutate: refreshCategoryRows, meta } = useFetch(urlPath)

  useEffect(() => {
    if (categories && !isLoading) {
      setTotalItems(categories.total)
      setItems(categories.data)
      setPageMeta(meta)
      console.log(meta, "....pageMeta in category context");
    }
    else if (!categories){
      setTotalItems(Category_list_info.length)
      setItems(Category_list_info)
      setPageMeta({current_page: 1,
        last_page: 1,
        per_page: 10,
        total: Category_list_info.length})
    }
  }, [categories, isLoading, isError])

  useEffect(() => {
    if (!urlPath) return
    const newUrl = new URL(urlPath)
    newUrl.searchParams.set("sortBy", String(sortBy))
    newUrl.searchParams.set("orderBy", String(orderBy))
    setUrlPath(newUrl)
  }, [sortBy, orderBy])

  // Clear query params
  const [isSubmitClear, setisSubmitClear] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)

  const resetFilter = () => {
    setisSubmitClear(true)
  }

  useEffect(() => {
    setUrlPath(new URL(window.location.origin + "/api/proxy/admin/categories/"))
    // setUrlPath(new URL(window.location.origin + "/api/proxy/admin/categories/paginate"))
    setCategoryIdsUrl(new URL(window.location.origin + "/api/proxy/admin/categories/categories-ids"));
  }, [])

  useEffect(() => {
    if (isSubmitClear) {
      setKeyword("")
      setQueryParams({})
      handleSearch()
      setSelectedStatus("")
      // setUrlPath(new URL(window.location.origin + "/api/proxy/admin/categories/"))
      setisSubmitClear(false) // Reset the flag
    }
  }, [isSubmitClear])

  const prevPage = useCallback(() => {
    if (urlPath) {
      const url = new URL(urlPath);
      const curPage = pageNumber;
      url.searchParams.set("page", (curPage - 1).toString());
      setPageNumber(pageNumber - 1);
      setUrlPath(url);
    }
  }, [pageNumber, urlPath])

  const nextPage = useCallback(() => {
    if (urlPath) {
      const url = new URL(urlPath);
      const curPage = pageNumber;
      url.searchParams.set("page", (curPage + 1).toString());
      setPageNumber(pageNumber + 1);
      setUrlPath(url);
    }
  }, [pageNumber, urlPath])

  const pagination = useCallback(
    (newPageNumber: number) => {
      if (urlPath) {
        const url = new URL(urlPath)
        url.searchParams.set("page", newPageNumber.toString())
        setPageNumber(newPageNumber)
        setUrlPath(url)
      }
    },
    [urlPath],
  )

  const handleSearch = useCallback(async () => {
    setPageNumber(1) // Reset to first page
    let query = "?"

    if (keyword.trim().length) {
      query += "keyword=" + keyword + "&"
    }

    if (Object.keys(queryParams).length) {
      let queryKey: keyof typeof queryParams

      for (queryKey in queryParams) {
        if (queryParams.hasOwnProperty(queryKey)) {
          const key = queryKey
          const value = queryParams[queryKey] as object
          if (Array.isArray(value)) {
            for (var i in value) {
              query += key + "[]" + "=" + value[i] + "&"
            }
          } else {
            query += `${key}=${value}&`
          }
        }
      }
    }

    isSubmitClear && ((query = ""), setisSubmitClear(false));

    const url = new URL(window.location.origin + "/api/proxy/admin/categories/" + (query.length > 1 ? query : ""))
    // const url = new URL(window.location.origin + "/api/proxy/admin/categories/paginate" + (query.length > 1 ? query : ""))
    console.log(url, "....urlurl")

    url.searchParams.set("sortBy", String(sortBy))
    url.searchParams.set("orderBy", String(orderBy))
    url.searchParams.set("page", "1") // Always start from page 1 when searching

    // Set filter active state
    query.length > 1 ? setIsFilterActive(true) : setIsFilterActive(false)

    setUrlPath(url)
    !pageLoaded && setPageLoaded(true)
    return
  }, [keyword, queryParams, sortBy, orderBy, isSubmitClear, pageLoaded])

  const getCategoryInfo = async (id: string) => {
    try {
      const res = await fetcher("/api/proxy/admin/categories/" + id, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (res && res?.data) {
        setCategoryInfo(res.data)
      }
      return res.data
    } catch (error) {
      return error
    }
  }

  const context: CategoryContextData = {
    listCount: totalItems,
    items: items.length > 0 ? items : Category_list_info,
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
    getCategoryInfo,
    categoryInfo,
    setCategoryInfo,
    refreshCategoryRows,
    isLoading: items.length > 0 ? false : isLoading,
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
    selectedCategories,
    setSelectedCategories,
    setCheckedUiItems,
    setUrlPath,
    isAllChecked,
    setIsAllChecked,
    categoryCreate,
    setCategoryCreate,
    isPrivate,
    setIsPrivate,
    isPublished,
    setIsPublished,
    selectedTabId,
    setSelectedTabId
  }

  return <CategoryListContext.Provider value={context}>{children}</CategoryListContext.Provider>
}

export default CategoryListContext
