/** @format */

import classNames from 'classnames';

import styles from '@/components/commons/buttons/_buttons.module.scss';

type Props = {
  active: boolean;
  text: string;
  onClick: () => void;
  className?: string;
};

export default function ButtonFilterClear({
  active,
  text,
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={classNames(
        styles.btn_filter_clear,
        {
          [styles.active]: active,
        },
        className || ''
      )}>
      {/* <IconCross /> */}
      {text || '案件クリア'}
    </button>
  );
}
