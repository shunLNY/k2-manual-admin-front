/** @format */

import { useRef } from 'react';
import { memo } from 'react';
import { forwardRef } from 'react';

import styles from './date-input.module.scss';
import formInput from './form-element.module.scss';
import { IconCross } from '@/components/icons/icons';

type Props = {
  value?: any;
  onClear: () => void;
  onClick: () => void;
  placeholder: string;
  label?: string;
  disabled?: boolean;
  data?: boolean | undefined;
  edited?: string | undefined;
  customclassName?: string;
  error?: boolean;
};

const DateInput = forwardRef(
  ({ value, onClear, customclassName, ...props }: Props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const clearDate = () => {
      if (inputRef.current) {
        inputRef.current.value = '';
        if (typeof onClear === 'function') onClear();
      }
    };

    return (
      <div
        className={`relative ${styles.container}
            ${props.data ? styles.has_data : ''} 
        ${props.edited ? styles.is_edit : ''}
        ${customclassName ?? ''}
      `}>
        <div>
          {props.label && (
            <label className={styles.dateLabel} htmlFor=''>
              {props.label}
            </label>
          )}

          <div className={styles.date_container}>
            <button
              type='button'
              className={styles.icon_cross}
              onClick={clearDate}
              style={{ display: value ? '' : 'none' }}
              disabled={props.disabled}>
              <IconCross />
            </button>
            <input
              className={`${formInput.input}   ${
                props.error ? styles.input_error : ''
              }`}
              ref={inputRef}
              {...props}
              value={value || ''}
              type='text'
              readOnly={true}
            />
          </div>
        </div>
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';
export default memo(DateInput);
