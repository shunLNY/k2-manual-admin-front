import Image from "next/image";
import styles from "./login.module.scss"
import FormControl from "../commons/inputs/form-control";
import TextField from "../commons/inputs/text-field";
import ButtonSave from "../commons/buttons/btn-save";
import Link from "next/link";
import ButtonCancel from "../commons/buttons/btn-cancel";
import { useRouter } from "next/router";
import { useState } from "react";
import { NEXT_PUBLIC_APP_URL } from "@/utils/constants";

const EmailVerification = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        ` ${NEXT_PUBLIC_APP_URL}/api/proxy/auth/forget-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      setMessage(
        "Password reset link has been sent to your email address."
      );
      setMessageType("success");
      setIsLoading(false);
    } catch (error) {
      // Display a generic message for security reasons
      setMessage(
        "Your request could not be processed or email invalid . Please try again later."
      );
      setMessageType("error");
    }
  };

  // const handleSubmit = () => {
  //   router.replace("/new-password-page")
  // }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formContainer}>
        <div className={styles.logo}>
          <Image
            src={'/images/common/auth/グループ_34.png'}
            width='30'
            height='30'
            sizes='100vw'
            style={{ maxWidth: '100%' }}
            alt='建工管理'
            priority={true}
          />
        </div>
        <p className={styles.description}>パスワード再設定用リンクを送信するメールアドレスを<br />入力してください。</p>
        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.inputContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 24 19" fill="none">
              <path d="M11.9995 8.33349L21.6331 2.38892H2.36593L11.9995 8.33349ZM21.6331 16.6111V4.77782L11.9995 10.6665L2.36593 4.77782V16.6111H21.6331ZM21.6331 1.75492e-05C21.946 -0.00121467 22.2556 0.0624567 22.5419 0.186895C22.8282 0.311334 23.0847 0.493757 23.2949 0.722322C23.5186 0.940086 23.6961 1.19961 23.817 1.48576C23.9379 1.7719 23.9998 2.07893 23.999 2.38892V16.6111C23.9998 16.9211 23.9379 17.2281 23.817 17.5143C23.6961 17.8004 23.5186 18.06 23.2949 18.2777C23.0847 18.5063 22.8282 18.6887 22.5419 18.8131C22.2556 18.9376 21.946 19.0013 21.6331 19H2.36593C2.05306 19.0013 1.74343 18.9376 1.45715 18.8131C1.17086 18.6887 0.914313 18.5063 0.704168 18.2777C0.480444 18.06 0.30295 17.8004 0.18205 17.5143C0.0611499 17.2281 -0.000735887 16.9211 6.60269e-06 16.6111V2.38892C-0.000735887 2.07893 0.0611499 1.7719 0.18205 1.48576C0.30295 1.19961 0.480444 0.940086 0.704168 0.722322C0.914313 0.493757 1.17086 0.311334 1.45715 0.186895C1.74343 0.0624567 2.05306 -0.00121467 2.36593 1.75492e-05H21.6331Z" />
            </svg>
            <TextField
              name="email"
              placeholder="メールアドレス"
              validation={{
                required: "メールは必須です",
                maxLength: {
                  value: 50,
                  message: "50文字まで入力できます。",
                },
              }}
              maxLength={50}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* <div className={styles.captcha}>
            <Image
              src={'/images/common/auth/image_54.png'}
              width='250'
              height='70'
              sizes='100vw'
              style={{ maxWidth: '100%' }}
              alt='captcha'
              priority={true}
            />
          </div> */}

          <div className={styles.btnContainer}>
            <ButtonCancel onClick={() => router.back()} text="戻る" type="button" />
            <ButtonSave disabled={isLoading} className={`${isLoading ? `${styles.disable}` : ''}`} type="submit" text="送信する" />
          </div>
        </form>
        {isLoading && <p className={styles.loading}>送信中です。しばらくお待ちください...</p>}
        {message && <p className={`${styles.message} ${styles[messageType]}`}>{message}</p>}


      </div>
    </div>
  )
}

export default EmailVerification;