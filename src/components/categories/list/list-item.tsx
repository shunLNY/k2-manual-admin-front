"use client"

import type React from "react"

import { IconArrowDown, IconArrowRight, IconArrowUp, IconYellowAlert, IconPlus } from "@/components/icons/icons"
import { useRouter } from "next/router"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GrDrag } from "react-icons/gr"
import type { Category } from "@/utils/types"
import styles from "../../../styles/_list.module.scss"
import categoryListStyles from "./category-list.module.scss"
import { Checkbox } from "@/components/commons/inputs/checkbox"
import { useContext } from "react"
import { useCategoryList } from "@/store/categories-context"
import dayjs from "dayjs"
import { useState } from "react"

type Props = {
  item: Category
  index: number
  limit?: number
  level: number
}

const ListItem = (props: Props) => {
  const router = useRouter()
  const listCtx = useCategoryList()
  const { item, index, level } = props
  const { checkedItems, setCheckedItems, selectedCategories, setSelectedCategories } = listCtx

  const [isOpen, setIsOpen] = useState(level > 1)
  const hasChildren = item.child_categories && item.child_categories.length > 0
  const canExpand = level === 1 && hasChildren

  // Use the sortable hook
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    padding: "0px !important",
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const categoryStatus = {
    0: {
      color: "darkGray",
      text: "非公開",
    },
    1: {
      color: "blue",
      text: "公開",
    },
  }

  const navigateToEditEntry = (id: string) => {
    console.log(id)
    router.push(`/categories/edit/${id}`)
  }

  const dynamicOpacity = (level - 1) * 0.05;

  return (
    <li
      key={index}
      ref={setNodeRef}
      style={style}
      onClick={() => navigateToEditEntry(item.id)}
      className={isDragging ? "category_list_item dragging" : "category_list_item"}
    >
      <div 
        className={`${styles.item_wrapper} ${categoryListStyles.item_wrapper}`}
        style={{ paddingLeft: `${(level - 1) * 20}px`, backgroundColor: `rgba(0, 0, 0, ${dynamicOpacity})` }}
      >
        <div
          {...attributes}
          {...listeners}
          className={`${categoryListStyles.drag_handle} cursor-grab active:cursor-grabbing`}
          style={{
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
          onClick={(e) => e.stopPropagation()} // Prevent navigation when dragging
        >
          <GrDrag />
        </div>
        {/* <div>
          <Checkbox
            checked={checkedItems.includes(item.id)}
            onChange={(e) => handleCheckboxChange(item, item.id, e)}
            onClick={(e) => e.stopPropagation()}
          />
        </div> */}
        <div>{item?.sort_order}</div>
        <div className={styles.item_status}>
          {item.status === "private" && (
            <span className={`${styles[`border_${categoryStatus[0].color}`]}`}>{categoryStatus[0]?.text}</span>
          )}
          {item.status === "public" && (
            <span className={`${styles[`border_${categoryStatus[1].color}`]}`}>{categoryStatus[1]?.text}</span>
          )}
        </div>
        <div>{item?.createdAt ? dayjs(item.createdAt).format("YYYY-MM-DD") : "—"}</div>
        <div>{item?.category_name}</div>
        <div>
          <span className={styles.client_name}>
            {item?.creator?.account_name}
          </span>
          <br></br>
          <span className={styles.client_name}>
            {item?.editor?.account_name}
          </span>
        </div>
        
        <div>{item?.blog_categories?.length ?? 0}</div>
        {level < 3 && (
          <div onClick={(e) => e.stopPropagation()}>
            <button className={categoryListStyles.btn_add_child} onClick={() => router.push(`/categories/new?parentId=${item.id}`)}>
              +サブカテゴリー
            </button>
          </div>
        )}
        <div className={styles.detail_ico} onClick={(e) => {
          if (canExpand) {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }
        }}>
          {canExpand ? (
            isOpen ? <IconArrowUp /> : <IconArrowDown />
          ) : null}
        </div>
      </div>
      {(canExpand || level > 1) && hasChildren && isOpen && (
        <SortableContext items={item.child_categories.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
          <ul className={categoryListStyles.sortable_list}>
            {item.child_categories.map((child: any, childIndex: number) => (
              <ListItem
                key={child.id}
                item={child}
                index={childIndex}
                level={level + 1}
              />
            ))}
          </ul>
        </SortableContext>
      )}
    </li>
  )
}

export default ListItem
