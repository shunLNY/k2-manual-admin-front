"use client"

import { IconArrowRight } from "@/components/icons/icons";
import { useRouter } from "next/router";
import { useSortable } from "@dnd-kit/sortable"
//Context
// import AccountContext from "@/store/accounts-context";

//Icons & Utility Components Imports
import { GrDrag } from "react-icons/gr";
import { Account } from "@/utils/types";
import { CSS } from "@dnd-kit/utilities"

//stylesheets
import styles from '../../../styles/_list.module.scss';
import AccountListStyles from './account-list.module.scss'
import Link from "next/link";
// import { Checkbox } from "@/components/commons/inputs/checkbox";


type Props = {
  limit?: number;
  currentPage: number;
  pageSize: number;
  item: Account
  index: number
};

const ListItem = (props: Props) => {
  const router = useRouter()
  const { currentPage, pageSize, item, index } = props;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  //   opacity: isDragging ? 0.5 : 1,
  // }



  const accountStatus = {
    0: {
      color: 'darkGray',
      text: '編集者',
    },
    1: {
      color: 'blue',
      text: '管理者',
    }
  };

  // const items = CategoryListInfo;

  const navigateToEditEntry = (param: string) => {
    console.log(param);
    // Push the new route with the construction title
    router.push(`/accounts/edit/${param}`);
  };

  console.log(typeof item.id , ".................id ")

  return (
    <>
      <li key={index}>
        <Link
          className={` ${styles.item_wrapper} ${AccountListStyles.item_wrapper} `}
          href={`/accounts/edit/${item.id}`}>

          <div>
            {
              item.account_id
          }
          </div>

          <div className={styles.item_status}>
            {item.role === 'editor' && (
              <span
                className={`${styles[`border_${accountStatus[0].color}`]
                  }`}>
                {accountStatus[0]?.text}
              </span>
            )}
            {item.role === 'admin' && (
              <span
                className={`${styles[`border_${accountStatus[1].color}`]
                  }`}>
                {accountStatus[1]?.text}
              </span>
            )}
          </div>
          <div>
            {item?.account_name}
          </div>
          <div>
            {item?.email}
          </div>
          <div className={styles.detail_ico}>
            <IconArrowRight />
          </div>
        </Link>
      </li>
    </>
  )
}
export default ListItem