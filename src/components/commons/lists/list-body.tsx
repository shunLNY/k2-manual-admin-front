/** @format */
import { useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import classNames from 'classnames';
import styles from './list-body.module.scss';
import ListPageContext from '@/store/list-page-context';
import CategoryListContext from '@/store/categories-context';
import { fetcher } from '@/utils/fetcher';
import { deleteSuccessfulMessage } from '@/utils/constants';
import { toast } from 'react-toastify';
import ButtonDelete from '../buttons/btn-delete';
import DeleteModal from '@/components/modals/delete-modal';
import ButtonCopy from '../buttons/btn-copy';

type Paginator = {
  pageNumber: number;
  itemsPerPage: number;
};

type ListBodyProps = {
  countIcon?: React.ReactNode;
  count: number;
  children: React.ReactNode;
  pageNumber?: number;
  onOpenMultipleCopySubmit?: () => void;
  onOpenMultipleDelete?: () => void;
};

export default function ListBody(props: ListBodyProps) {
  const pathname = usePathname();
  const CategoryCtx = useContext(CategoryListContext)
  const pageCtx = useContext(ListPageContext);
  const {
    countIcon,
    count,
    children,
    pageNumber,
    onOpenMultipleCopySubmit,
    onOpenMultipleDelete,
  } = props;


  const [isOpenModal, setIsOpenModal] = useState(false);
  const router = useRouter();

  const handleMultipleCopy = () => {
    if (pathname === '/blogs') {
      pageCtx.setIsMultipleCopy({ isBlogCopy: false });
    }
  };

  const handleMultipleDelete = () => {
    if (pathname === '/blogs') {
      pageCtx.setIsMultipleCopy({ isBlogCopy: false });
    }
    if (pathname === '/categories') {
      pageCtx.setIsMultipleCopy({ isCategoryCopy: false });
    }
  };

  const shouldShowDeleteButton = ['/blogs'].includes(pathname);
  const totalCategories = ['/categories'].includes(pathname);

  return (
    <>
      <div
        className={`${styles.main_tab_container} ${pathname === '/home' ? styles.home_tab_container : ''
          }`}
      >
        <div className={styles.count_container}>

          <div className={styles.count_container}>
            {totalCategories ? (
              <div className={styles.total_count}>
                {countIcon}
                {count || 0}件
              </div>
            ) : (
              <div className={styles.total_count}>
                {countIcon}
                {(pageNumber ?? 1) * 10 - 9}-
                {Math.min((pageNumber ?? 1) * 10, count)} /{count || 0}件
              </div>
            )}
            {/* The rest of your code */}
          </div>


          <div className={styles.btn_container}>
            {/* {[
              "/blogs"
            ].includes(pathname) && (
              <ButtonCopy
                type="button"
                onClick={()=>{
                  router.push("/categories/new")
                }}
                text="新規作成"
                disabled={
									(pathname === "/blogs" &&
										pageCtx.isNewCreate.isBlogCreate) 
								}
              />
            )} */}
            {/* {shouldShowDeleteButton && (
              <div onClick={handleMultipleDelete}>
                <ButtonDelete
                  type="button"
                  onClick={() => {
                    if (pathname === '/blogs') {
                      onOpenMultipleDelete?.();
                    } else if (pathname === '/categories') {
                      onOpenMultipleDelete?.();
                    }
                    // } else if (pathname === '/accounts') {
                    //   onOpenMultipleDelete?.();
                    // }
                  }}
                />
              </div>
            )} */}
            {shouldShowDeleteButton && (
              <ButtonCopy
                type="button"
                onClick={() => {
                  onOpenMultipleCopySubmit?.();
                }}
              />
            )}
          </div>
        </div>
        <div className={`${styles.table_body} scroll`}>{props.children}</div>
      </div>
    </>
  );
}
