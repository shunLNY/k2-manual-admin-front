import { JSX } from "react";
import ReactModal from "react-modal";

/**
 *
 * @param {boolean} isOpen  decide whether open or close modal
 * @param {function} onRequestClose what to do if modal is closed
 * @param {boolean} shouldCloseOnOverlayClick if true, close ,modal on clicking background overlay
 * @returns
 */

type Props = {
  children: JSX.Element | string;
  isOpen: boolean;
  onRequestClose: () => void;
  shouldCloseOnOverlayClick?: boolean | undefined;
  className?: any;
  contentClassName?: string;
};

export default function Modal(props: Props) {
  const {
    isOpen,
    onRequestClose,
    shouldCloseOnOverlayClick = true,
    className,
    contentClassName,
    ...prop
  } = props;

  return (
    <>
      <ReactModal
        {...prop}
        isOpen={isOpen}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        shouldCloseOnEsc={false}
        onRequestClose={onRequestClose}
        overlayClassName={`modalOverlay ${className || ""} ${contentClassName ? "no-bg" : ""
          }`}
        className={"modalContent"}
      >
        <div className={contentClassName}>{props.children}</div>
      </ReactModal>
    </>
  );
}
