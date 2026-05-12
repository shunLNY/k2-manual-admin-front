/** @format */

'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useDebounce } from '../../../utils/helpers';
import search from '@/components/commons/lists/list-filter-pc.module.scss';
import ListPageLayout from '@/components/commons/lists/list-page-layout';
import ButtonFilterClear from '@/components/commons/buttons/btn-filter-clear';
import BlogList from './article-list';
import { useListPage } from '@/store/list-page-context';
import { useBlog } from '@/store/articles-context';
import { useForm, Controller } from 'react-hook-form';
import { ArticlesInfoType } from '@/utils/types';
import { SelectInstance } from 'react-select';
import { toast } from 'react-toastify';
import { fetcher } from '@/utils/fetcher';
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from '@/components/modals/modal';
import { Checkbox } from '@/components/commons/inputs/checkbox';
import SearchCheckboxStatusPC from '@/components/commons/inputs/search-checkbox-status-pc';
import FormControl from '@/components/commons/inputs/form-control';
import TextField from '@/components/commons/inputs/text-field';
import ButtonSearch from '@/components/commons/buttons/btn-search';
import { IconXMark } from '@/components/icons/icons';
import dayjs from 'dayjs';
import MultiSelect from '@/components/commons/inputs/multi-select-box';
import useSWR from 'swr';
import styles from '../entry/articles.entry.module.scss';
import DateInput from '@/components/commons/inputs/date-input';
import ReactDatepicker from '@/components/commons/datepicker/react-datepicker';
import { useCategoryList } from '@/store/categories-context';

const ListFilterPc = dynamic(
  () => import('../../commons/lists/list-filter-pc'),
  {
    ssr: false,
  }
);

type FilterFormData = {
  // status: {
  // isDraft: boolean;
  // isPublished: boolean;
  // isPrivate: boolean;
  // isScheduled: boolean;
  // };
  isDraft: boolean;
  isPublished: boolean;
  isPrivate: boolean;
  isScheduled: boolean;
  publish_start_at: string | null;
  publish_end_at: string | null;
  creator_name: string;
  editor_name: string;
  category_ids: string[];
};

const ListPage = () => {
  const router = useRouter();
  const pageCtx = useListPage();
  const listCtx = useBlog();
  const categoryListCtx = useCategoryList();
  const { items } = categoryListCtx;

  const {
    listCount,
    keyword,
    setKeyword,
    setQueryParams,
    resetFilter,
    handleSearch,
    isFilterActive,
    setBlogCreate,
    pagination,
  } = listCtx;

  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [inputDateName, setInputDateName] = useState("");
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
  } = useForm<FilterFormData>({
    defaultValues: {
      isDraft: false,
      isPublished: false,
      isPrivate: false,
      isScheduled: false,
      publish_start_at: null,
      publish_end_at: null,
      creator_name: '',
      editor_name: '',
      category_ids: [],
    },
  });

  const watchPublishStartAt = watch('publish_start_at');
  const watchPublishEndAt = watch('publish_end_at');

  useEffect(() => {
    // 公開開始日が変更されたら、queryParamsを更新
    setQueryParams((prev: any) => {
      const newParams = { ...prev };
      if (watchPublishStartAt) {
        newParams.publish_start_at = dayjs(watchPublishStartAt).format('YYYY-MM-DD');
      } else {
        delete newParams.publish_start_at; // 値がなければパラメータから削除
      }
      return newParams;
    });
  }, [watchPublishStartAt, setQueryParams]);

  useEffect(() => {
    setQueryParams((prev: any) => {
      const newParams = { ...prev };
      if (watchPublishEndAt) {
        newParams.publish_end_at = dayjs(watchPublishEndAt).format('YYYY-MM-DD');
      } else {
        delete newParams.publish_end_at; // 値がなければパラメータから削除
      }
      return newParams;
    });
  }, [watchPublishEndAt, setQueryParams]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const PageSize: number = 10;

  useEffect(() => {
    if (window.location.hash.startsWith("#")) {
      setBlogCreate(true);
    }
  }, [setBlogCreate]);

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value.trimStart());
  }, [setKeyword]);

  const onCloseModal = () => {
    pageCtx.setOpenFilterModal(false);
  };

  const { queryParams } = listCtx;

  const handleFilterCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setQueryParams((prev: any) => {
      const newParams = { ...prev };
      if (checked) {
        newParams[name] = true;
      } else {
        delete newParams[name];
      }
      return newParams;
    });
  };

  const handleFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`入力中 => name: ${name}, value: ${value}`);
    setQueryParams((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selectedOptions: any) => {
    const categoryIds = selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [];
    setQueryParams((prev: any) => ({ ...prev, category_ids: categoryIds }));
  };

  const handleSearchAndClose = () => {
    handleSearch();
    onCloseModal();
  };

  const onClearFilters = () => {
    resetFilter();
    onCloseModal();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pagination(page);

  };

  const handleDuplicateBlogs = async () => {
    const selectedIds = listCtx.checkedItems;
    if (!selectedIds || selectedIds.length === 0) {
      toast.warn('複製するブログを選択してください。');
      return;
    }

    try {
      const result = await fetcher('/api/proxy/admin/blogs/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });

      toast.success(`${result.duplicatedBlogs.length}件のブログを複製しました。`);
      if (result.failedIds && result.failedIds.length > 0) {
        toast.error(`${result.failedIds.length}件の複製に失敗しました。`);
      }
      listCtx.setCheckedItems([]);
      router.refresh();
    } catch (error) {
      console.error('ブログの複製に失敗しました:', error);
      toast.error('ブログの複製中にエラーが発生しました。');
    }
  };

  const categoryOptions: any[] =
    items?.map((cat) => ({
      value: cat.id,
      label: cat.category_name,
    })) || [];

  return (
    <>
      <ListPageLayout
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
        resetFilterButton={
          <ButtonFilterClear
            text='フィルタークリア'
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
          // onPageChange: handlePageChange,
          onPageChange: (page: number) => { setCurrentPage(page), listCtx.pagination(page) }
        }}>
        <>
          <BlogList
            count={listCount}
            currentPage={currentPage}
            pageSize={PageSize}
            onDuplicate={handleDuplicateBlogs}
          />

          <Modal
            isOpen={pageCtx.openFilterModal}
            shouldCloseOnOverlayClick={true}
            onRequestClose={onCloseModal}
            contentClassName={search.modal_bg}
          >
            <div className={search.account_modal}>
              <ListFilterPc
                keyword={keyword}
                onKeywordChange={handleKeywordChange}
                onSearch={handleSearchAndClose}
              >
                <>
                  <ul className={search.construction_flex}>
                    {/* ステータスフィルター */}
                    <li className={search.list_search_box}>
                      <div className={search.list_search_detail_label}>
                        <p className={search.list_search_label}>ステータス</p>
                      </div>
                      <div className={search.list_search_detail}>
                        <div className={search.list_search_flex}>
                          <div className={search.list_search_check}>
                            <label className={"d-flex items-center"}>
                              <Checkbox
                                name="isDraft"
                                onChange={handleFilterCheckboxChange}
                                checked={!!queryParams?.isDraft}
                              />
                              <SearchCheckboxStatusPC label="下書き" color="darkGray" />
                            </label>
                          </div>

                          <div className={search.list_search_check}>
                            <label className={"d-flex items-center"}>
                              <Checkbox
                                name="isPublished"
                                onChange={handleFilterCheckboxChange}
                                checked={!!queryParams?.isPublished}
                              />
                              <SearchCheckboxStatusPC label="公開" color="blue" />
                            </label>
                          </div>

                          <div className={search.list_search_check}>
                            <label className={"d-flex items-center"}>
                              <Checkbox
                                name="isPrivate"
                                onChange={handleFilterCheckboxChange}
                                checked={!!queryParams?.isPrivate}
                              />
                              <SearchCheckboxStatusPC label="非公開" color="gray" />
                            </label>
                          </div>

                          <div className={search.list_search_check}>
                            <label className={"d-flex items-center"}>
                              <Checkbox
                                name="isScheduled"
                                onChange={handleFilterCheckboxChange}
                                checked={!!queryParams?.isScheduled}
                              />
                              <SearchCheckboxStatusPC label="予約" color="green" />
                            </label>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className={search.list_search_box}>
                      <FormControl label="カテゴリー" layout="row" classNames={search.custom_label}>
                        <MultiSelect
                          options={categoryOptions}
                          placeholder="カテゴリーを選択（複数可）"
                          isClearable={true}
                          value={categoryOptions.filter(opt => queryParams?.category_ids?.includes(opt.value))}
                          onChange={handleCategoryChange}
                        />
                      </FormControl>
                    </li>

                    {/* 作成者・編集者フィルター */}
                    <li className={search.list_search_box}>
                      <FormControl label="作成者" layout="row" classNames={search.custom_label}>
                        <TextField
                          name="creator_name"
                          placeholder="作成者名で検索"
                          onChange={handleFilterTextChange}
                          value={queryParams?.creator_name || ''}
                        />
                      </FormControl>
                    </li>

                    <li className={search.list_search_box}>
                      <FormControl label="編集者" layout="row" classNames={search.custom_label}>
                        <TextField
                          name="editor_name"
                          placeholder="編集者名で検索"
                          onChange={handleFilterTextChange}
                          value={queryParams?.editor_name || ''}
                        />
                      </FormControl>
                    </li>

                    <li className={search.list_search_box}>
                      <FormControl
                        label='公開期間'
                        layout="row"
                        classNames={search.custom_label}>
                        <div className={styles.publish_date_container}>
                          <div className={styles.date_input}>
                            <Controller
                              name='publish_start_at'
                              control={control}
                              render={({ field, fieldState }) => (
                                <>
                                  <DateInput
                                    {...field}
                                    onClick={() => {
                                      setIsOpenDatePicker(true);
                                      setInputDateName('publish_start_at');
                                    }}
                                    onClear={() => setValue('publish_start_at', "")}
                                    value={
                                      field.value
                                        ? dayjs(new Date(field.value)).format(
                                          'YYYY/MM/DD'
                                        )
                                        : ''
                                    }
                                    placeholder={'2025/01/01'}
                                  />
                                </>
                              )}
                            />
                          </div>

                          <div>~</div>

                          <div className={styles.date_input}>
                            <Controller
                              name='publish_end_at'
                              control={control}
                              render={({ field }) => (
                                <>
                                  <DateInput
                                    {...field}
                                    onClick={() => {
                                      setIsOpenDatePicker(true);
                                      setInputDateName('publish_end_at');
                                    }}
                                    onClear={() => setValue('publish_end_at', "")}
                                    value={
                                      field.value
                                        ? dayjs(new Date(field.value)).format(
                                          'YYYY/MM/DD'
                                        )
                                        : ''
                                    }
                                    placeholder={'2025/01/01'}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                      </FormControl> </li>

                  </ul>

                  {/* モーダルのフッターボタン */}
                  <div className="d-flex">
                    <div className={search.btn_flex}>
                      <ButtonFilterClear
                        text="条件クリア"
                        onClick={onClearFilters}
                        active={true}
                      />
                      <ButtonSearch
                        text="この条件で検索"
                        className={search.submitBtn + " ml-10"}
                        onClick={handleSearchAndClose}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={onCloseModal}
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

          {isOpenDatePicker && (
            <Modal isOpen={isOpenDatePicker} shouldCloseOnOverlayClick={true} onRequestClose={() => setIsOpenDatePicker(false)}>
              <ReactDatepicker
                onSelect={(e) => {
                  if (inputDateName === "publish_start_at" || inputDateName === "publish_end_at") {
                    setValue(inputDateName, dayjs(e).format("YYYY-MM-DD"), {
                      shouldValidate: true,
                    });
                  }
                  setIsOpenDatePicker(false);
                }}
                fromYear={1970}
                toYear={dayjs().add(10, "years").year()}
              />
            </Modal>
          )}
        </>
      </ListPageLayout>
    </>
  );
};

export default ListPage;