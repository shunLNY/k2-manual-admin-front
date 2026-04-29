import { useMemo } from "react";

export const DOTS = "...";

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, idx) => idx + start);

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}): (number | string)[] | undefined => {
  return useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);
    const totalPageNumbers = siblingCount + 5;
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPageCount);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPageCount - 2;

    const firstPage = 1;
    const lastPage = totalPageCount;

    if (!showLeftDots && showRightDots) {
      let leftCount = 3 + 2 * siblingCount;
      return [...range(1, leftCount), DOTS, lastPage];
    }
    if (showLeftDots && !showRightDots) {
      let rightCount = 3 + 2 * siblingCount;
      return [firstPage, DOTS, ...range(totalPageCount - rightCount + 1, totalPageCount)];
    }
    if (showLeftDots && showRightDots) {
      return [firstPage, DOTS, ...range(leftSibling, rightSibling), DOTS, lastPage];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);
};
