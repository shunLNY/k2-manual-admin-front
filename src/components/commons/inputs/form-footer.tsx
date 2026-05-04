/** @format */
import styles from "./form-element.module.scss"

const FormFooter = ({ children } : any) => {
  return <div
  className={styles.footer_container}
  >{children}</div>;
};

export default FormFooter;
