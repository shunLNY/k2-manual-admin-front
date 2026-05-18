/** @format */

'use client';

import { useContext, useEffect, useState } from 'react';
// Context or Store imports

// Component imports

import ListBody from '@/components/commons/lists/list-body';
import ListItem from './list-item';

// Icons and Utility Components imports

// Stylesheets imports
import styles from '../../../styles/_list.module.scss';
import blogListStyles from './article-list.module.scss';
import { IconOrder } from '@/components/icons/icons';
import { BlogsListInfo } from '@/utils/constants';
import { useBlog } from '@/store/articles-context';
import { Checkbox } from '@/components/commons/inputs/checkbox';

type Props = {
  count: number;
  limit?: number;
  currentPage: number;
  pageSize: number;
  onDuplicate: () => void;
};

const ArticleList = (props: Props) => {

  const listCtx = useBlog();

  const {
    items,
    isLoading,
    isError,
    setCheckedItems,
    checkedItems,
    setSelectedBlogs,
    selectedBlogs,
    refreshBlogRows,
    setCheckedUiItems,
  } = listCtx

  const { count, currentPage, pageSize, onDuplicate } = props;
  const [list, setList] = useState<Array<any>>(Array.isArray(items) ? items : [])


  useEffect(() => {
    setList(Array.isArray(items) ? items : [])
  }, [items])


  const handleAllCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    if (isChecked) {
      setCheckedItems(list.map((item) => item.id))
      setSelectedBlogs(list)
    } else {
      setCheckedItems([])
      setSelectedBlogs([])
    }
  }

  useEffect(() => {
    const total = list.length
    const selectedCount = checkedItems.length
    listCtx.setIsAllChecked(total > 0 && selectedCount === total)
  }, [list, checkedItems])

  return (
    <ListBody
      count={count}
      countIcon={<IconOrder />}
      pageNumber={currentPage}
      onOpenMultipleCopySubmit={onDuplicate}
    >
      <div className={styles.table_wrapper}>
        <div
          className={` ${styles.table_header} ${blogListStyles.list_header} `}>
          {/* <div className={styles.table_head}></div> */}
          <div className={styles.table_head}>
            <Checkbox onChange={handleAllCheckboxChange} checked={listCtx.isAllChecked} />
          </div>
          <div role='button' className={styles.table_head}>

          </div>
          <div role='button' className={styles.table_head}>
            ステータス
          </div>
          <div role='button' className={styles.table_head}>
            公開期間
          </div>
          <div role='button' className={styles.table_head}>
            カテゴリー
          </div>
          <div role='button' className={styles.table_head}>
            タイトル
          </div>
          <div role='button' className={styles.table_head}>
            本文抜粋
          </div>
          <div role='button' className={styles.table_head}>
            作成者/編集者
          </div>
          <div className={styles.table_head}></div>
        </div>

        <div className={styles.list_wrapper}>
          {/* <ListItem currentPage={currentPage} pageSize={pageSize} /> */}
          {/* {items.length === 0 &&
            (isLoading ? <Loading /> : !isError && <NoData />)} */}

          <ul className={`${styles.list_item} noscroll`}>
            {Array.isArray(list) && list.map((item, index) => (
              <ListItem key={item.id} item={item} index={index} currentPage={currentPage} pageSize={pageSize} />
            ))}
          </ul>
          {items.length === 0 && <div className="p-8 text-center text-gray-500">ブログが見つかりません</div>}
        </div>
      </div>
    </ListBody>
  );
};

export default ArticleList;
