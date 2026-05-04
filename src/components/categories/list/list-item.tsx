"use client"

import type React from "react"

import { IconArrowDown, IconArrowRight, IconArrowUp, IconYellowAlert } from "@/components/icons/icons"
import { useRouter } from "next/router"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GrDrag } from "react-icons/gr"
import type { Category } from "@/utils/types"
import styles from "../../../styles/_list.module.scss"
import categoryListStyles from "./category-list.module.scss"
import { Checkbox } from "@/components/commons/inputs/checkbox"
import { useContext } from "react"
import CategoryListContext from "@/store/categories-context"
import dayjs from "dayjs"
import { useState } from "react"

type Props = {
  item: Category
  index: number
  currentPage: number
  pageSize: number
  limit?: number
  level: number
}

const ListItem = (props: Props) => {
  const router = useRouter()
  const listCtx = useContext(CategoryListContext)
  const { item, currentPage, pageSize, index, level } = props
  const { checkedItems, setCheckedItems, selectedCategories, setSelectedCategories } = listCtx

  const [isOpen, setIsOpen] = useState(level === 1)
  const hasChildren = item.child_categories && item.child_categories.length > 0 && level < 4 // Max depth check

  // Use the sortable hook
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
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

  // const handleCheckboxChange = (category: Category, itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
  //   const checked = e.target.checked
  //   setSelectedCategories((prev: any) => {
  //     if (checked) {
  //       return [...prev, category]
  //     }
  //     return prev.filter((c: any) => c.id !== category.id)
  //   })
  //   setCheckedItems((prev: any) => (checked ? [...prev, itemId] : prev.filter((id: any) => id !== itemId)))
  // }

  return (
    <li
      key={index}
      ref={setNodeRef}
      style={style}
      onClick={() => navigateToEditEntry(item.id)}
      className={isDragging ? "dragging" : ""}
    >
      <div 
        className={`${styles.item_wrapper} ${categoryListStyles.item_wrapper}`}
        style={{ paddingLeft: `${(level - 1) * 40}px` }}
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
        <div>
          <span className={styles.client_name}>
            {item?.creator?.account_name}
          </span>
          <br></br>
          <span className={styles.client_name}>
            {item?.editor?.account_name}
          </span>
        </div>
        <div>{item?.category_name}</div>
        <div>{item?.blog_categories?.length ?? 0}</div>
        <div className={styles.detail_ico} onClick={(e) => {
          if (hasChildren) {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }
        }}>
          {hasChildren ? (
            isOpen ? <IconArrowUp /> : <IconArrowDown />
          ) : (
            <IconArrowRight />
          )}
        </div>
      </div>
      {hasChildren && isOpen && (
        <ul className={categoryListStyles.sortable_list}>
          {item.child_categories.map((child: any, childIndex: number) => (
            <ListItem
              key={child.id}
              item={child}
              index={childIndex}
              currentPage={currentPage}
              pageSize={pageSize}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default ListItem
