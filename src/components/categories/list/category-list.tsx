"use client"
import type React from "react"
import { useContext, useEffect, useState } from "react"
import ListItem from "./list-item"
import { useCategoryList } from "@/store/categories-context"
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
  UniqueIdentifier,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import styles from "../../../styles/_list.module.scss"
import CategoryListStyles from "./category-list.module.scss"
import { useListPage } from "@/store/list-page-context"
import { toast } from "react-toastify"
import { fetcher } from "@/utils/fetcher"
import { deleteSuccessfulMessage, failMessage } from "@/utils/constants"
import DeleteModal from "@/components/modals/delete-modal"
import classNames from "classnames"
import { useRouter } from "next/navigation"
import { Category } from "@/utils/types"


type Props = {
  count: number
  limit?: number
}

const CategoryList = (props: Props) => {
  const listCtx = useCategoryList()
  const pageCtx = useListPage()
  const router = useRouter()

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

  const { count } = props
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
    setList(selectedRoot?.child_categories || [])
  }, [items, listCtx.selectedTabId])

  const handleAllCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    if (isChecked) {
      setCheckedItems(list.map((item: { id: any }) => item.id))
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

    // Find the list that contains the dragged item
    let foundList: any[] | null = null
    let parentItem: any = null

    const findAndReorder = (currentItems: any[]) => {
      const index = currentItems.findIndex((i) => i.id === active.id)
      if (index !== -1) {
        foundList = currentItems
        return true
      }
      for (const item of currentItems) {
        if (item.child_categories && findAndReorder(item.child_categories)) {
          return true
        }
      }
      return false
    }

    // Check top level first (which is the current visible list)
    if (list.findIndex((i) => i.id === active.id) !== -1) {
      foundList = list
    } else {
      // Check nested levels
      findAndReorder(items)
    }

    if (foundList) {
      const oldIndex = foundList.findIndex((i: any) => i.id === active.id)
      const newIndex = foundList.findIndex((i: any) => i.id === over.id)
      
      if (newIndex !== -1) {
        const newList = arrayMove(foundList, oldIndex, newIndex)
        
        // Update local state for immediate feedback
        if (foundList === list) {
          setList(newList)
        } else {
          // If it's a nested list, we need to refresh or update the main items
          // For now, refreshCategoryRows will handle the permanent state
        }

        const ids = newList.map((i: any) => i.id)
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
            toast.error("並び替えに失敗しました")
          })
      }
    }
  }

  return (
    <ListBody
      count={count}
      countIcon={<IconOrder />}
      // onOpenMultipleDelete={onOpenMultipleDelete}
      extraHeaderContent={
        <button
          className={CategoryListStyles.btn_add_child}
          onClick={() => router.push(`/categories/new?parentId=${listCtx.selectedTabId}`)}
        >
          +サブカテゴリー
        </button>
      }
    >
    <div className={CategoryListStyles.tabs_container}>
						{items.map((category: Category) => (
							<div
								key={category.id}
								className={classNames(CategoryListStyles.tab_wrapper, {
									[CategoryListStyles.active]: listCtx.selectedTabId === category.id,
								})}
							>
								<button
									className={CategoryListStyles.tab_button}
									onClick={() => listCtx.setSelectedTabId(category.id)}
								>
									{category.category_name}
								</button>
								<span 
									className={CategoryListStyles.tab_edit_icon}
									onClick={(e) => {
										e.stopPropagation();
										router.push(`/categories/edit/${category.id}`);
									}}
									title="編集"
								>
									✎
								</span>
							</div>
						))}
					</div>
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
          <div role="button" className={styles.table_head}>
            
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
            <SortableContext items={list.map((i: { id: any }) => i.id)} strategy={verticalListSortingStrategy}>
              <ul className={`${styles.list_item} ${CategoryListStyles.sortable_list} noscroll`}>
                {list.map((item: any, index: number) => (
                  <ListItem key={item.id} item={item} index={index} level={1} />
                ))}
              </ul>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className={`${styles.item_wrapper} ${CategoryListStyles.item_wrapper} opacity-50`}>
                  {/* Render a simplified version of the dragged item */}
                  <div className={CategoryListStyles.drag_handle}>≡</div>
                  <div>{list.find((item: { id: any }) => item.id === activeId)?.category_name}</div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          {list.length === 0 && <p className="p-8 text-center text-gray-500">子カテゴリーがありません</p>}
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
