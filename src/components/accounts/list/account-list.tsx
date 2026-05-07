"use client"
import { useContext, useEffect, useState } from "react";
import ListItem from "./list-item"
import AccountContext from "@/store/accounts-context";
import ListPageContext from "@/store/list-page-context";

import ListBody from "@/components/commons/lists/list-body";

import { IconOrder, IconQuotation } from "@/components/icons/icons";
import { AccountListInfo } from '@/utils/constants'
import { Checkbox } from "@/components/commons/inputs/checkbox";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  pointerWithin,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { Account } from "@/utils/types";

import styles from '../../../styles/_list.module.scss'
import AccountListStyles from './account-list.module.scss'


type Props = {
  count: number;
  limit?: number;
  currentPage: number;
  pageSize: number;
};

const AccountList = (props: Props) => {

  const listCtx = useContext(AccountContext)
  const { items, refreshAccountRows } = listCtx

  const { count, currentPage, pageSize } = props;


  // Submit Multiple 
  const [isOpenSubmit, setIsOpenSubmit] = useState(false);
  const onOpenMultipleCopySubmit = async () => {
    setIsOpenSubmit(true);
  };

  // Delete Multiple 
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const onOpenMultipleDelete = async () => {
    // const checkedIds = categoryIdItems.some((item) => checkedCategories.includes(item));

    // if (checkedIds) {
    //     toast.error("使用されている見積は削除できません。");

    //     setTimeout(() => {
    //         setCheckedUiCategories([]);
    //         setSelectedCategories([]);
    //         setCheckedCategories([]);
    //     }, 3000);
    //     return;
    // }
    setIsOpenDelete(true);
  };

  return (
    <ListBody
      count={count}
      countIcon={<IconOrder />}
    // pageNumber={listCtx.pageNumber}
    // onOpenMultipleCopySubmit={onOpenMultipleCopySubmit}
    // onOpenMultipleDelete={onOpenMultipleDelete}
    >
      <div className={styles.table_wrapper}>
        <div
          className={` ${styles.table_header} ${AccountListStyles.list_header} `}>
          {/* <div className={styles.table_head}></div> */}
          {/* <div className={styles.table_head}>
          <Checkbox
            onClick={(
              e: React.MouseEvent<HTMLInputElement, MouseEvent>
            ) => e.stopPropagation()}
          />
        </div> */}
          <div role='button' className={styles.table_head}>
            ID
          </div>
          <div role='button' className={styles.table_head}>
            権限
          </div>
          <div role='button' className={styles.table_head}>
            アカウント名
          </div>
          <div role='button' className={styles.table_head}>
            メールアドレス
          </div>
          <div className={styles.table_head}></div>
        </div>
        <div
          className={styles.list_wrapper}
        >
          {/* <ListItem currentPage={currentPage} pageSize={pageSize} /> */}

          <ul className={`${styles.list_item} noscroll`}>
            {items.map((item, index) => (
              <ListItem key={item.id} item={item} index={index} currentPage={currentPage} pageSize={pageSize} />
            ))}
          </ul>
          {items.length === 0 && <div className="p-8 text-center text-gray-500">アカウントが見つかりません</div>}
        </div>
      </div>
    </ListBody>

  )
}
export default AccountList