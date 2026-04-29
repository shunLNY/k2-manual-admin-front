import classNames from "classnames";
import styles from "@/components/common/buttons/_buttons.module.scss";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  text?: string;
  type?: "button" | "submit" | "reset" | undefined;
  form?: string;
  className?: string;
  children?: any;
};

export default function ButtonSearch(props: Props, color?: string) {
  return (
    <button
      {...props}
      className={classNames(styles.btn_search, [props.className], {
        [styles.btn_transparent]: color === "transparent",
      })}
    >
      {props.children} {props.text || "検索"}
    </button>
  );
}
