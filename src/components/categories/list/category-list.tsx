"use client"
import type React from "react"
import { useContext, useEffect, useState } from "react"
import ListItem from "./list-item"
import CategoryListContext from "@/store/categories-context"
import ListBody from "@/components/commons/lists/list-body"
import { IconOrder } from "@/components/icons/icons"
import { Checkbox } from "@/components/commons/inputs/checkbox"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import styles from "../../../styles/_list.module.scss"
import CategoryListStyles from "./category-list.module.scss"
import ListPageContext from "@/store/list-page-context"
import { toast } from "react-toastify"
import { fetcher } from "@/utils/fetcher"
import { deleteSuccessfulMessage, failMessage } from "@/utils/constants"
import DeleteModal from "@/components/modals/delete-modal"

type Props = {
  count: number
  limit?: number
  currentPage: number
  pageSize: number
}

const CategoryList = (props: Props) => {
  const listCtx = useContext(CategoryListContext)
  const pageCtx = useContext(ListPageContext)

  const {
    items,
    isLoading,
    isError,
    setCheckedItems,
    checkedItems,
    setSelectedCategories,
    selectedCategories,
    refreshCategoryRows,
    setCheckedUiItems,
  } = listCtx

  const { count, currentPage, pageSize } = props
  const [list, setList] = useState(items)
  const [activeId, setActiveId] = useState(null)

  // Define sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Update local list when items change or tab changes
  useEffect(() => {
    const selectedRoot = items.find((c: any) => c.id === listCtx.selectedTabId)
    setList(selectedRoot ? [selectedRoot] : [])
  }, [items, listCtx.selectedTabId])

  const handleAllCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    if (isChecked) {
      setCheckedItems(list.map((item) => item.id))
      setSelectedCategories(list)
    } else {
      setCheckedItems([])
      setSelectedCategories([])
    }
  }

  useEffect(() => {
    const total = list.length
    const selectedCount = checkedItems.length
    listCtx.setIsAllChecked(total > 0 && selectedCount === total)
  }, [list, checkedItems])

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    const oldIndex = list.findIndex((i) => i.id === active.id)
    const newIndex = list.findIndex((i) => i.id === over.id)
    const newList = arrayMove(list, oldIndex, newIndex)
    setList(newList)

    const ids = newList.map((i) => i.id)
    fetch("/api/proxy/admin/categories/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then(() => {
        refreshCategoryRows()
      })
      .catch((error) => {
        console.error("Failed to reorder categories:", error)
        // Revert the local state on error
        setList(items)
      })
  }

  return (
    <ListBody
      count={count}
      countIcon={<IconOrder />}
      pageNumber={currentPage}
    // onOpenMultipleDelete={onOpenMultipleDelete}
    >
      <div className={`${styles.table_wrapper} ${CategoryListStyles.drag_container}`}>
        <div className={`${styles.table_header} ${CategoryListStyles.list_header}`}>
          <div className={styles.table_head}></div>
          {/* <div className={styles.table_head}>
            <Checkbox onChange={handleAllCheckboxChange} checked={listCtx.isAllChecked} />
          </div> */}
          <div role="button" className={styles.table_head}>
            並び順
          </div>
          <div role="button" className={styles.table_head}>
            ステータス
          </div>
          <div role="button" className={styles.table_head}>
            作成日
          </div>         
          <div role="button" className={styles.table_head}>
            カテゴリー名
          </div>
          <div role='button' className={styles.table_head}>
            作成者/編集者
          </div>
          <div role="button" className={styles.table_head}>
            記事件数
          </div>
          <div className={styles.table_head}></div>
        </div>
        <div className={styles.list_wrapper}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={list.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <ul className={`${styles.list_item} ${CategoryListStyles.sortable_list} noscroll`}>
                {list.map((item: any, index: number) => (
                  <ListItem key={item.id} item={item} index={index} currentPage={currentPage} pageSize={pageSize} level={1} />
                ))}
              </ul>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className={`${styles.item_wrapper} ${CategoryListStyles.item_wrapper} opacity-50`}>
                  {/* Render a simplified version of the dragged item */}
                  <div className={CategoryListStyles.drag_handle}>≡</div>
                  <div>{list.find((item) => item.id === activeId)?.category_name}</div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          {items.length === 0 && <div className="p-8 text-center text-gray-500">カテゴリーが見つかりません</div>}
        </div>
      </div>

      {/* <DeleteModal
        isOpen={isOpenDelete}
        onCancel={() => {
          setIsOpenDelete(false)
          setCheckedUiItems([])
          setSelectedCategories([])
          setCheckedItems([])
        }}
        onDelete={confirmDelete}
      >
        <ul>
          {selectedCategories.length > 0 &&
            selectedCategories.map((category: any, index: number) => <li key={index}>{category.categoryName}</li>)}
        </ul>
        <p>上記の内容を削除しますか？</p>
      </DeleteModal> */}
    </ListBody>
  )
}

export default CategoryList
