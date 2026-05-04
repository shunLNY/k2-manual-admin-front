import classnames from 'classnames';
import styles from './pagination.module.scss';
import { usePagination } from '@/lib/hooks/use-pagination';

type PaginatorDetailProps = {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
  onPageChange: (value: number) => void;
  className?: string;
};

type PaginatorProps = {
  paginator: PaginatorDetailProps;
};

export function Pagination({ paginator }: PaginatorProps) {
  const {
    totalCount,
    pageSize,
    siblingCount = 1,
    currentPage,
    onPageChange,
    className,
  } = paginator;

  const paginationRange = usePagination({
    totalCount,
    pageSize,
    siblingCount,
    currentPage,
  });

  if (!paginationRange || paginationRange.length < 2 || currentPage < 1) {
    return null;
  }

  return (
    <ul className={classnames(styles.pagination_container, className)}>
      {paginationRange.map((item, idx) => (
        <li
          key={idx}
          className={classnames(styles.pagination_item, {
            [styles.active]: item === currentPage,
            [styles.dots]: item === '...',
          })}
          onClick={() => typeof item === 'number' && onPageChange(item)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
