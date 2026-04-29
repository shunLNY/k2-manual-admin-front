/** @format */

import classNames from 'classnames';
import styles from '@/components/common/buttons/_buttons.module.scss';

type Props = {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
  type: 'button' | 'submit' | 'reset' | undefined;
  form?: string;
  className?: string;
};

export default function ButtonCancel(props: Props, color?: string) {
  return (
    <button
      {...props}
      className={classNames(styles.btn_cancel, [props.className], {
        [styles.btn_transparent]: color === 'transparent',
      })}>
      {props.text || '戻る'}
    </button>
  );
}
