/** @format */

import styles from './form-element.module.scss';

type Props = {
  required?: boolean;
  any?: boolean;
  label: string;
  helperText?: string;
  errorMsg?: string;
  layout?: 'row' | 'column';
  children?: React.ReactNode;
  classNames?: string;
  htmlFor?: string;
};

export default function FormControl({
  required = false,
  any = false,
  label,
  helperText,
  errorMsg,
  children,
  layout = 'column',
  classNames,
  htmlFor,
}: Props) {
  return (
    <>
      <div className={styles.form_group}>
        <label
          htmlFor={htmlFor}
          className={`${styles.form_label} ${
            layout === 'row' ? styles.row : styles.column
          } `}>
          <div className={`${styles.label_txt} ${classNames || ''}`}>
            {any && <span className={styles.input_any}>【任意】</span>}
            {required && <span className={styles.required}>【必須】</span>}
            <span>{label}</span>
            <span className={styles.helper_text}>{helperText}</span>
          </div>

          {children}
        </label>
        {/* {errorMsg && <p className={styles.error_message}>{errorMsg}</p>} */}
      </div>
    </>
  );
}
