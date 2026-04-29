/** @format */

import { useContext, Dispatch, JSX } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import ListPageContext from '@/store/list-page-context';

import styles from './list-page-layout.module.scss';
import { fetcher } from '@/utils/fetcher';
import { Pagination } from '../pagination/pagination';
import ListSearchRow from './list-search-row';

interface PaginationProps {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
  onPageChange: (value: number) => void;
  className?: string | undefined;
}
interface SearchProps {
  keyword?: string;
  onSearch?: (value: string) => void;
  onKeywordChange?: (newKeyword: string) => void;
  onSubmit?: () => void;
  resetFilterButton?: JSX.Element | string;
  isActive?: boolean;
  isSearchRow?: boolean;
  children: JSX.Element | string;
  count: number;
  isPagination?: boolean;
  pagination?: any;
  isDisable?: boolean;
  setQueryParams?: Dispatch<any>;
  setCheckCombineSelected?: Dispatch<any>;
}

interface FormData {
  projectIds: string[];
}

function ListPageLayout(props: SearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    keyword,
    onSearch,
    onKeywordChange,
    resetFilterButton,
    isActive,
    isSearchRow = true,
    isPagination = false,
    pagination,
    onSubmit,
    isDisable,
    setQueryParams,
    setCheckCombineSelected,
  } = props;

  const pageCtx = useContext(ListPageContext);

  const handleModal = () => {
    pageCtx.toggleSpFilter();
  };

  const handleSearchForm = () => {
    pageCtx.toggleSearchForm();
  };

  const handleCancel = () => {
    const hasPreviousPage = window.history.length > 1;
    const constructionCreate = localStorage.getItem('constructionCreate');
    console.log(constructionCreate, '...constructionCreate');
    if (constructionCreate) {
      router.push('/constructions');
      localStorage.removeItem('constructionCreate');
    }

    const invoiceCreate = localStorage.getItem('invoiceCreate');
    if (invoiceCreate) {
      router.push('/invoices');
      localStorage.removeItem('invoiceCreate');
    }

    if (pageCtx.listFilter === '') {
      if (hasPreviousPage) {
        router.back();
      } else {
        router.push('/');
      }
    } else {
      pageCtx.setShowConstructionCreate(false);
      pageCtx.setListFilter('');
      // if (
      // 	(pageCtx.listFilter === "construction" ||
      // 		pageCtx.listFilter === "invoice") &&
      // 	pathname !== "/estimates"
      // ) {
      // 	router.back();
      // } else {

      // }
    }
    pageCtx.setBreadCrumbTitle('');
    setQueryParams?.({});
    setCheckCombineSelected?.([]);
  };

  const handleConstructionCreate = () => {
    pageCtx.setShowConstructionCreate(false);
    const postData: FormData = {
      projectIds: [
        '11efc258-c29b-b683-a7e0-e3fb394a6f66',
        '11efc258-c29b-b684-a7e0-e3fb394a6f66',
      ],
    };

    let fetchConfig = {};
    let url = null;

    url = '/api/proxy/constructions';
    fetchConfig = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(postData),
    };
    fetcher(url, { ...fetchConfig })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className={styles.container}>
        {isSearchRow && (
          <ListSearchRow
            handleModal={handleModal}
            showSearchForm={pageCtx.showSearchForm}
            toggleSearchForm={handleSearchForm}
            keyword={keyword}
            onSearch={onSearch}
            onKeywordChange={onKeywordChange}
            count={props.count}
            isActive={isActive}
            resetFilterButton={resetFilterButton}
          />
        )}
        <section className={styles.list_section + ' overflow-hidden relative'}>
          {props.children}
          {/* {(isPagination ||
						isSaleQuota ||
						pageCtx.showConstructionCreate) && (
						<div className={styles.list_footer}>
							{isPagination && (
								<Pagination
									paginator={{
										currentPage: pagination.currentPage,
										totalCount: pagination.totalCount,
										pageSize: pagination.pageSize,
										onPageChange: pagination.onPageChange,
									}}
								/>
							)}
							{isSaleQuota && (
								<div className={styles.salesQuotaBtn}>
									<ButtonCancel
										type="button"
										text="キャンセル"
										onClick={handleCancel}
									></ButtonCancel>
									<ButtonSave
										type="button"
										text="割当"
										onClick={handleCancel}
									></ButtonSave>
								</div>
							)}
							{pageCtx.listFilter === "construction" && (
								<div className={styles.salesQuotaBtn}>
									<ButtonCancel
										type="button"
										text="キャンセル"
										onClick={handleCancel}
									></ButtonCancel>
									<ButtonSave
										type="button"
										text="工事台帳作成"
										onClick={onSubmit}
										disabled={isDisable}
									></ButtonSave>
								</div>
							)}

							{pathname === "/invoices/create-combined" && (
								<div className={styles.salesQuotaBtn}>
									<ButtonCancel
										type="button"
										text="キャンセル"
										onClick={handleCancel}
									></ButtonCancel>
									<ButtonSave
										type="button"
										text="合算請求作成"
										onClick={onSubmit}
									></ButtonSave>
								</div>
							)}

							{pageCtx.listFilter === "invoice" && (
								<div className={styles.salesQuotaBtn}>
									<ButtonCancel
										type="button"
										text="キャンセル"
										onClick={handleCancel}
									></ButtonCancel>
									<ButtonSave
										type="button"
										text="請求書作成"
										disabled={isDisable}
										onClick={onSubmit}
									></ButtonSave>
								</div>
							)}
						</div>
					)} */}

          <div className={styles.list_footer}>
            {isPagination && (
              <Pagination
                paginator={{
                  currentPage: pagination.currentPage,
                  totalCount: pagination.totalCount,
                  pageSize: pagination.pageSize,
                  onPageChange: pagination.onPageChange,
                }}
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default ListPageLayout;
