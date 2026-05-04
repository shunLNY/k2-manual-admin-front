import classNames from "classnames";
import styles from "@/components/commons/buttons/_buttons.module.scss";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  text?: string;
  type: "button" | "submit" | "reset" | undefined;
  form?: string;
  className?: string;
};

export default function ButtonDelete(props: Props, color?: string) {
  return (
    <button
      {...props}
      className={classNames(styles.btn_delete, [props.className], {
        [styles.btn_transparent]: color === "transparent",
      })}
    >
      {props.text || "削除"}
    </button>
  );
}
