import { memo } from "react";
import Modal from "./modal";
import ButtonCancel from "@/components/commons/buttons/btn-cancel";
// import ButtonDelete from "@/components/commons/buttons/btn-delete";
import styles from "./delete-modal.module.scss";

type Props = {
	name?: string;
	isOpen: boolean;
	onCancel: () => void;
	onDelete: () => void;
	children?: React.ReactNode;
};

function DeleteModal({ name, isOpen, onCancel, onDelete, children }: Props) {
	return (
		<>
			<Modal
				isOpen={isOpen}
				shouldCloseOnOverlayClick={true}
				onRequestClose={onCancel}
			>
				<div
					className={`${styles.content} ${
						name ? styles.padding : ""
					}`}
				>
					{name && (
						<div className={styles.title}>
							<span className={styles.item_name}>{name}</span>
							を削除しますか？
						</div>
					)}

					{children && <>{children}</>}
					<div className={styles.footer_btn}>
						<ButtonCancel
							type="button"
							onClick={() => onCancel()}
							text="キャンセル"
						/>
						<button
							onClick={onDelete}
							className={styles.btn_delete}
						>
							削除
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}

export default memo(DeleteModal);
