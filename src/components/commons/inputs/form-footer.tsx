/** @format */
import { Children, ReactNode } from "react"
import styles from "./form-element.module.scss"

type FormFooterProps = {
  children: ReactNode
  mobileThreeButtons?: boolean
  threeButtonsCenterOnTop?: boolean
}

const FormFooter = ({
  children,
  mobileThreeButtons = false,
  threeButtonsCenterOnTop = false,
}: FormFooterProps) => {
  const visibleChildren = Children.toArray(children)
  const classNames = [styles.footer_container]

  if (visibleChildren.length === 3) {
    if (threeButtonsCenterOnTop) {
      classNames.push(styles.footer_container_three)
    } else {
      classNames.push(styles.footer_container_mobile_three_buttons)
    }
  } else if (mobileThreeButtons) {
    classNames.push(styles.footer_container_mobile_three_buttons)
  }

  return <div className={classNames.join(" ")}>{children}</div>;
};

export default FormFooter;
