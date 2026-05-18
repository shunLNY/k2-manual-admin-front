"@use client"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import { useListPage } from "@/store/list-page-context"

import AccountList from "./account-list"
import { useAccount } from "@/store/accounts-context"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import ListPageLayout from "@/components/commons/lists/list-page-layout"
import ButtonFilterClear from "@/components/commons/buttons/btn-filter-clear"
import { SelectInstance } from "react-select"
import dayjs from "dayjs"
import dynamic from "next/dynamic"
import { Account } from "@/utils/types"
import Modal from "@/components/modals/modal"
import search from "../../commons/lists/list-filter-pc.module.scss"
import DateInput from "@/components/commons/inputs/date-input"
import { IconXMark } from "@/components/icons/icons"
import ButtonSearch from "@/components/commons/buttons/btn-search"
import SearchCheckboxStatusPC from "@/components/commons/inputs/search-checkbox-status-pc"
import { Checkbox } from "@/components/commons/inputs/checkbox"
import FormControl from "@/components/commons/inputs/form-control"
import TextField from "@/components/commons/inputs/text-field"
import { useDebounce } from "@/utils/helpers"
const ListFilterPc = dynamic(
  () => import('../../commons/lists/list-filter-pc'),
  {
    ssr: false,
  }
);

interface FormData {
  accountIds: string[];
}

interface InputData {
  account_id: string;
}

const ListPage = () => {
  const router = useRouter()
  const pageCtx = useListPage()
  const listCtx = useAccount()

  const {
    listCount,
    items,
    keyword,
    setKeyword,
    queryParams,
    setQueryParams,
    resetFilter,
    handleSearch,
    isFilterActive,
    accountCreate,
    setAccountCreate,
    isAdmin,
    isEditor,
    setIsAdmin,
    setIsEditor
  } = listCtx;

  const {
    register,
    setValue,
    clearErrors,
    reset,
    control,
    formState: { errors }
  } = useForm<Account>({
    defaultValues: {
      account_id: "",
      role: "editor",
      account_name: "",
      email: "",
      password: "",
    }
  })

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value.trimStart());
  }, []);



  useEffect(() => {
    if (window.location.hash.startsWith("#")) {
      return setAccountCreate(true);
    }
  }, []);

  const onClose = useCallback(() => {
    pageCtx.setOpenFilterModal(false);
  }, []);

  const handleSearchAndClose = useCallback(() => {
    handleSearch();
    onClose();
  }, [handleSearch, onClose]);



  let PageSize: number = 10;
  const groupsRef = useRef<SelectInstance>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showSubmissionStatusFilter, setShowSubmissionStatusFilter] = useState<boolean>(false);
  useEffect(() => {
    const hasAccountCreate =
      typeof window !== "undefined" &&
      localStorage.getItem("constructionCreate");

    // if (localStorage.getItem("constructionCreate") || pageCtx.listFilter) {
    if (hasAccountCreate || pageCtx.listFilter) {
      setShowSubmissionStatusFilter(false);
    } else {
      setShowSubmissionStatusFilter(true);
    }
  }, [pageCtx.listFilter]);

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    let paramName = e.target.getAttribute("name") as string;
    paramName === "isAdmin" && setIsAdmin(!isAdmin);
    paramName === "isEditor" && setIsEditor(!isEditor);
    console.log(paramName)

    setQueryParams((prevState: any) => {
      if (e.target.checked) {
        return {
          ...prevState,
          [paramName]: true,
        };
      }
      delete prevState[paramName];
      return { ...prevState };
    });
  };

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      if (name) {
        setValue(name as keyof InputData, value);
        clearErrors(name as keyof InputData);

        setQueryParams((prevState: any) => {
          const newState = {
            ...prevState,
            [name]: value.trim(),
          };
          return newState;
        });
      }
    },
    [setValue, clearErrors, setQueryParams]
  );

  const clearFilterData = () => {
    reset({
      account_id: ""
    })
    resetFilter()
    onClose();
  };

  // search on keyword change
  const debounce = useDebounce(keyword, 500);
  useEffect(() => {
    handleSearch();
  }, [debounce]);

  return (
    <>
      <ListPageLayout
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
        resetFilterButton={
          <ButtonFilterClear
            text="案件クリア"
            onClick={resetFilter}
            active={isFilterActive}
          />
        }
        isActive={pageCtx.showSpFilter}
        count={listCount}
        isPagination={true}
        pagination={{
          currentPage: currentPage,
          totalCount: listCount,
          pageSize: PageSize,
          onPageChange: (page: number) => {
            setCurrentPage(page);
            listCtx.pagination(page);
          },
        }}
      // onSubmit={
      // pageCtx.listFilter === "invoice"
      // 	? handleInvoiceCreate
      // 	: handleConstructionCreate
      // }
      // isDisable={listCtx.items.length <= 0}
      // setQueryParams={setQueryParams}
      >
        <>
          <AccountList
            count={listCount}
            currentPage={currentPage}
            pageSize={PageSize}
          />
          <Modal
            isOpen={pageCtx.openFilterModal}
            shouldCloseOnOverlayClick={true}
            onRequestClose={() => { pageCtx.setOpenFilterModal(false) }}
            contentClassName={search.modal_bg}
          >
            <div className={search.account_modal}>
              <ListFilterPc
                keyword={keyword}
                onKeywordChange={handleKeywordChange}
                onSearch={handleSearch}
              >
                <>
                  <ul className={search.construction_flex}>
                    {showSubmissionStatusFilter && (
                      <li className={search.list_search_box}>
                        <p>
                          ステータス
                        </p>
                        <div className={search.list_search_detail}>
                          <div className={search.list_search_flex}>
                            <div className={search.list_search_check}  >
                              <label className={"d-flex items-center"}  >
                                <Checkbox
                                  name="isEditor"
                                  onChange={handleCheckbox}
                                  checked={isEditor}
                                  className={search.checkbox_status}
                                />
                                <SearchCheckboxStatusPC
                                  label="編集者"
                                  color="gray"
                                />
                              </label>
                            </div>
                            <div className={search.list_search_check}  >
                              <label className={"d-flex items-center"}  >
                                <Checkbox
                                  name="isAdmin"
                                  onChange={handleCheckbox}
                                  checked={isAdmin}
                                  className={search.checkbox_status}
                                />
                                <SearchCheckboxStatusPC
                                  label="管理者"
                                  color="blue"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </li>
                    )}

                    <li className={search.list_search_box}  >
                      <FormControl
                        label="アカウントID"
                        layout="row"
                        classNames={search.custom_label}
                      >
                        <TextField
                          name="account_id"
                          register={register}
                          placeholder="Otech_01"
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </li>
                  </ul>
                  <div className="d-flex">
                    <div className={search.btn_flex}>
                      <ButtonFilterClear
                        text="条件クリア"
                        onClick={clearFilterData}
                        active={true}
                      />
                      <ButtonSearch
                        text="検索"
                        className={search.submitBtn + " ml-10"}
                        onClick={handleSearchAndClose}
                      ></ButtonSearch>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className={search.close_btn}
                    >
                      <IconXMark />
                      閉じる
                    </button>
                  </div>
                </>
              </ListFilterPc>
            </div>
          </Modal>

        </>

      </ListPageLayout>

    </>
  )
}
export default ListPage