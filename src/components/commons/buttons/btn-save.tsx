import classNames from "classnames";
import styles from "@/components/commons/buttons/_buttons.module.scss";

type Props = {
	onClick?: () => void;
	disabled?: boolean;
	text?: string;
	type?: "button" | "submit" | "reset" | undefined;
	form?: string;
	className?: string;
	children?: any;
};

export default function ButtonSave(props: Props, color?: string) {
	return (
		<button
			{...props}
			className={classNames(styles.btn_save, [props.className], {
				[styles.btn_transparent]: color === "transparent",
			})}
		>
			{props.children} {props.text || "保存"}
		</button>
	);
}
