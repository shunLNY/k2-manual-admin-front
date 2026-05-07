"use client"
import { ReactNode } from "react"
import styles from "./confirm-model.module.scss"
import ButtonCancel from "@/components/commons/buttons/btn-cancel"
import { useRouter } from "next/router"
import ButtonSave from "@/components/commons/buttons/btn-save"

type ConfirmProps = {
  isOpen: boolean
  title?: string
  message?: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  messageColor?: string
}

export default function ConfirmModal({
  isOpen,
  title = "確認",
  message = "",
  onConfirm,
  onCancel,
  confirmText = "削除",
  messageColor
}: ConfirmProps) {
  const router = useRouter()
  if (!isOpen) return null


  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message} style={{ color: messageColor || styles.defaultMessageColor }}>
          {message.split("\n").map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <div className={styles.buttons}>
          <ButtonCancel onClick={onCancel} text="戻る" type="button" />
          <ButtonSave type="submit" text={confirmText} onClick={onConfirm} />
        </div>
      </div>
    </div>
  )
}
