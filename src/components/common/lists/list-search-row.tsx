/** @format */

'use client';

import { JSX, memo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import styles from './list-search-row.module.scss';
import ButtonFilter from '../buttons/btn-filter';
import KeywordInput from '../inputs/keyword-input';

// const ButtonFilter = dynamic(() => import("../buttons/btn-filter"), {
// 	ssr: false,
// });

const PAGE_SIZE = 30;

type Props = {
  keyword?: string;
  onSearch?: (value: string) => void;
  handleModal: () => void;
  toggleSearchForm: () => void;
  showSearchForm: boolean;
  onKeywordChange?: (value: string) => void;
  resetFilterButton?: JSX.Element | string;
  isActive?: boolean;
  count: number;
};

// Search Bar for SP and Tablet view
const ListSearchRow = (props: Props) => {
  const {
    keyword,
    onSearch,
    onKeywordChange,
    resetFilterButton,
    isActive,
    count,
    handleModal,
    toggleSearchForm,
    showSearchForm,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const onInputChange = (value: string) => {
    onKeywordChange && onKeywordChange(value);
  };

  useEffect(() => {
    const totalPages = Math.ceil(count / PAGE_SIZE);
    setTotalPages(totalPages);
  }, [count]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className={styles.list_search_container}>
      <div className={styles.search_none}>
        <KeywordInput
          value={keyword ?? ""}
          onSearch={onSearch}
          onChange={onInputChange}
          placeholder='search applicant'
        />
        <ButtonFilter
          className={styles.btn_filter__sp}
          isActive={isActive}
          handleModal={handleModal}
        />
      </div>
      <div className={styles.filter_relative}>
        {resetFilterButton && resetFilterButton}
        <ButtonFilter
          className={styles.btn_filter__pc}
          isActive={showSearchForm}
          handleModal={toggleSearchForm}
        />
        <ButtonFilter
          className={styles.btn_filter__sp}
          handleModal={handleModal}
        />
      </div>
    </div>
  );
};

ListSearchRow.display = 'ListSearchRow';
export default memo(ListSearchRow);
