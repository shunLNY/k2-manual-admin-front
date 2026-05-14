import { useFetch } from "@/lib/hooks/common-hooks"
import { fetcher } from "@/utils/fetcher"
import type React from "react"
import { createContext, type Dispatch, type SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import type { Category, PageMeta } from "@/utils/types"

type CategoryContextData = {
  listCount: number
  items: Category[]
  setItems: Dispatch<SetStateAction<Category[]>>
  editItem: Category[]
  setEditItem: Dispatch<SetStateAction<Category[]>>
  isEdit: boolean
  setIsEdit: Dispatch<SetStateAction<boolean>>
  keyword: string
  setKeyword: Dispatch<SetStateAction<string>>
  queryParams: Record<string, string | string[]>
  setQueryParams: Dispatch<SetStateAction<Record<string, string | string[]>>>
  handleSearch: () => void
  resetFilter: () => void
  isFilterActive: boolean
  getCategoryInfo: (value: string) => Promise<Category | Error>
  categoryInfo: Partial<Category>
  setCategoryInfo: Dispatch<SetStateAction<Partial<Category>>>
  refreshCategoryRows: () => void
  isLoading: boolean
  isError: boolean
  sortBy: string
  setSortBy: Dispatch<SetStateAction<string>>
  orderBy: string
  setOrderBy: Dispatch<SetStateAction<string>>
  selectedStatus: string
  setSelectedStatus: Dispatch<SetStateAction<string>>
  checkedItems: string[]
  setCheckedItems: Dispatch<SetStateAction<string[]>>
  selectedCategories: Category[]
  setSelectedCategories: Dispatch<SetStateAction<Category[]>>
  setCheckedUiItems: Dispatch<SetStateAction<string[]>>
  setUrlPath: Dispatch<SetStateAction<URL | null>>
  isAllChecked: boolean
  setIsAllChecked: Dispatch<SetStateAction<boolean>>
  categoryCreate: boolean
  setCategoryCreate: Dispatch<SetStateAction<boolean>>
  is_private: boolean;
  setIs_Private: Dispatch<SetStateAction<boolean>>;
  is_published: boolean;
  setIs_Published: Dispatch<SetStateAction<boolean>>;
  selectedTabId: string;
  setSelectedTabId: Dispatch<SetStateAction<string>>;
}

const CategoryListContext = createContext<CategoryContextData | undefined>(undefined);

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
  const [editItem, setEditItem] = useState<Category[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [categoryIdsUrl, setCategoryIdsUrl] = useState<URL | null>(null);

  //search checkbox
  const [ is_private, setIs_Private] = useState(false);
  const [ is_published, setIs_Published] = useState(false);

  const [selectedTabId, setSelectedTabId] = useState<string>("");

  const [urlPath, setUrlPath] = useState<URL | null>(null)
  const [categoryInfo, setCategoryInfo] = useState<Partial<Category>>({})

  // Checkbox states
  const [isAllChecked, setIsAllChecked] = useState(false)
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [checkedUiItems, setCheckedUiItems] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])

  const { data: categories, isLoading, isError, mutate: refreshCategoryRows, meta } = useFetch(urlPath)

  useEffect(() => {
    if (categories && !isLoading) {
      setTotalItems(categories.length)
      setItems(categories)
      
      // If no tab is selected or the current selected tab is not in the new items, select the first one
      if (categories.length > 0 && (!selectedTabId || !categories.find((c: any) => c.id === selectedTabId))) {
        setSelectedTabId(categories[0].id)
      }
    }
    else if (!categories && !isLoading && isError){
      // Clear items on error
      setTotalItems(0)
      setItems([])
    }
  }, [categories, isLoading, isError, selectedTabId])

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
    setIs_Private(false)
    setIs_Published(false)
  }

  useEffect(() => {
    setUrlPath(new URL(window.location.origin + "/api/proxy/admin/categories/"))
    // setUrlPath(new URL(window.location.origin + "/api/proxy/categories/paginate"))
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



  const handleSearch = useCallback(async () => {
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
    // const url = new URL(window.location.origin + "/api/proxy/categories/paginate" + (query.length > 1 ? query : ""))
    console.log(url, "....urlurl")

    url.searchParams.set("sortBy", String(sortBy))
    url.searchParams.set("orderBy", String(orderBy))


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
    getCategoryInfo,
    categoryInfo,
    setCategoryInfo,
    refreshCategoryRows,
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
    selectedCategories,
    setSelectedCategories,
    setCheckedUiItems,
    setUrlPath,
    isAllChecked,
    setIsAllChecked,
    categoryCreate,
    setCategoryCreate,
    is_private,
    setIs_Private,
    is_published,
    setIs_Published,
    selectedTabId,
    setSelectedTabId
  }

  return <CategoryListContext.Provider value={context}>{children}</CategoryListContext.Provider>
}

export const useCategoryList = () => {
  const context = useContext(CategoryListContext);
  if (context === undefined) {
    throw new Error("useCategoryList must be used within a CategoryListContextProvider");
  }
  return context;
};

export default CategoryListContext
