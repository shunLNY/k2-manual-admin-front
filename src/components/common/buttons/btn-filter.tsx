/** @format */

import classNames from 'classnames';

import { IconFilter } from '@/components/icons/icons';
import styles from '@/components/common/buttons/_buttons.module.scss';

export default function ButtonFilter(props: any) {
  const { handleModal } = props;

  // add class from parent layout
  let { className } = props;
  let classes = [styles.btn_filter, className].join(' ');

  return (
    <>
      <button
        className={classNames(classes, { [styles.is_active]: props.isActive })}
        onClick={() => {
          handleModal(true);
        }}>
        <IconFilter />
      </button>
    </>
  );
}
