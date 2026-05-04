/** @format */

import { forwardRef } from 'react';
import styles from './form-element.module.scss';

type Props = {
  checked?: boolean;
  onChange?: (checked: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (value: React.MouseEvent<HTMLInputElement>) => void;
  className?: string;
  name?: string;
  type?: string;
  value?: string;
  disabled?: boolean;
  number?: number;
};

const Checkbox = forwardRef((props: Props, ref) => {
  let {
    className,
    checked,
    onChange,
    onClick,
    disabled,
    type = 'checkbox',
  } = props;
  let classNames = [styles.checkbox_container, className].join(' ');
  return (
    <label className={classNames}>
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        {...props}
        disabled={disabled}
      />
      <span className={styles.checkmark} onClick={onClick}></span>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

const Checkmark = forwardRef((props: any, ref) => {
  // add class from parent layout
  let {
    className,
    checked,
    onChange,
    number,
    onClick,
    type = 'checkbox',
  } = props;
  let classNames = [styles.checkbox_container, className].join(' ');

  return (
    <label className={classNames}>
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        onClick={onClick}
        readOnly
      />
      <span className={styles.checknumber} onClick={onClick}>
        {number}
      </span>
    </label>
  );
});

Checkmark.displayName = 'Checkmark';

const ColorCheckbox = forwardRef((props: any, ref) => {
  // add class from parent layout
  let { className, checked, onChange, value, onClick } = props;
  let classNames = [styles.checkbox_color_container, className].join(' ');
  return (
    <label className={classNames}>
      <input type='checkbox' checked={checked} onChange={onChange} {...props} />
      <span className={styles.checkmark} onClick={onClick}></span>
    </label>
  );
});

ColorCheckbox.displayName = 'ColorCheckbox';

export { Checkbox, ColorCheckbox, Checkmark };
