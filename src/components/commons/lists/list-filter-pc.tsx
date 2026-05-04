/** @format */

'use client';

import { JSX, useContext } from 'react';
import classNames from 'classnames';

import ListPageContext from '@/store/list-page-context';

import styles from './list-filter-pc.module.scss';
import KeywordInput from '../inputs/keyword-input';

type Props = {
  children: JSX.Element | string;
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  searchPlaceholder?: string;
  filterTitle?: string;
};

export default function ListFilterPc({ children, ...props }: Props) {
  const { keyword, onKeywordChange, onSearch } = props;
  const pageCtx = useContext(ListPageContext);

  return (
    <>
      <div
        className={classNames(
          styles.list_search_container,
          styles.list_search_container_pc
        )}>
        <KeywordInput
          className={classNames(styles.search_box, {
            [styles.isShown]: pageCtx.showSearchForm,
          })}
          value={keyword}
          onSearch={onSearch}
          onChange={onKeywordChange}
          placeholder={props.searchPlaceholder}
        />
        {/*  Start Search Filter */}
        <div className={styles.filter_relative_pc}>
          <div className={styles.col_title}>
            <div className={styles.col_title_h2}>絞り込み条件</div>
            <div className={styles.col_title_h3}>
              絞り込み条件を入力してください。
            </div>
          </div>
          <div className={styles.search_container}>{children}</div>
        </div>
        {/*  End Search Filter */}
        {/* <div className={styles.filter_relative_pc}>
					<div className={styles.col_title}>
						<div className={styles.col_title_h2}>
							{props.filterTitle}
						</div>
					</div>
					<div className={styles.search_container}>{children}</div>
				</div>

				<div className={styles.filter_relative}></div> */}
      </div>
    </>
  );
}
