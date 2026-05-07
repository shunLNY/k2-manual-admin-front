"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import ButtonSave from "../commons/buttons/btn-save"
import TextField from "../commons/inputs/text-field"
import styles from "./new-password.module.scss"
import { useRouter } from "next/router"
import { fetcher } from "@/utils/fetcher"
import { NEXT_PUBLIC_APP_URL } from "@/utils/constants"
import { useForm } from "react-hook-form"


const NewPassword = () => {
  const router = useRouter();

  // const url = new URL(rout);
  // const token = url.searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  //comment off remporarily to see reset-password page
  // useEffect(() => {
  //   if (router.isReady) {
  //     const t = router.query.token;

  //     if (!t) router.replace("/auth/signin");

  //     if (typeof t === 'string') {
  //       setToken(t);
  //       console.log('Token from query:', t);
  //     }
  //   }
  // }, [router.isReady, router.query.token]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');
  const { setValue, register, getValues, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    let newPassword: string;
    console.log(data, "in new password form");
    if (data.password !== data.confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    } else {
      newPassword = data.password;
    }



    setMessage('');
    setError('');

    if (!token) {
      setError('No reset token found.');
      return;
    }



    try {
      const response = await fetcher(`${NEXT_PUBLIC_APP_URL}/api/proxy/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });



      console.log(response, "in new password response");
      setMessage('Your password has been reset successfully! Redirecting to login...');
      setMessageType("success");
      setIsLoading(false);
      setTimeout(() => router.push('/auth/signin'), 2000);

      if (!response) {
        throw new Error('Failed to reset password.');
      }


    } catch (err: any) {
      setMessage('パスワードのリセットに失敗しました。もう一度お試しください。');
      setMessageType("error");
    }
  };



  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.formContainer}>
          <div className={styles.logo}>
            <Image
              src={"/images/common/auth/グループ_34.png"}
              width={30}
              height={30}
              sizes="100vw"
              style={{ maxWidth: "100%" }}
              alt="建工管理"
              priority={true}
            />
          </div>
          <p className={styles.description}>新しいパスワードを設定してください。</p>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputContainer}>
              <p>パスワード</p>
              <div className={styles.passwordInputWrapper}>
                <TextField
                  name="password"
                  register={register}
                  type={showPassword ? "text" : "password"}
                  placeholder="6文字以上"
                  validation={{
                    required: "パスワードは必須です",
                    maxLength: {
                      value: 50,
                      message: "50文字まで入力できます。",
                    },
                  }}
                  maxLength={50}
                />
                <button
                  type="button"
                  className={styles.showPasswordBtn}
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                >
                  {showPassword ? (
                    <FaRegEye size={16} className={styles.eyeIcon} />
                  ) : (
                    <FaRegEyeSlash size={16} className={styles.eyeIcon} />
                  )}
                </button>
              </div>
            </div>
            <div className={styles.inputContainer}>
              <p>パスワード（確認）</p>
              <div className={styles.passwordInputWrapper}>
                <TextField
                  name="confirmPassword"
                  register={register}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="パスワード（確認）"
                  validation={{
                    required: "パスワードは必須です",
                    maxLength: {
                      value: 50,
                      message: "50文字まで入力できます。",
                    },
                  }}
                  maxLength={50}
                />
                <button
                  type="button"
                  className={styles.showPasswordBtn}
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? "パスワードを隠す" : "パスワードを表示"}
                >
                  {showConfirmPassword ? (
                    <FaRegEye size={16} className={styles.eyeIcon} />
                  ) : (
                    <FaRegEyeSlash size={16} className={styles.eyeIcon} />
                  )}
                </button>
              </div>
            </div>
            <div className={styles.btnContainer}>
              <ButtonSave type="submit" text="パスワードを設定" />
            </div>
          </form>

          {isLoading && <p className={styles.loading}>送信中です。しばらくお待ちください...</p>}
          {message && <p className={`${styles.message} ${styles[messageType]}`}>{message}</p>}

          <div className={styles.reg_text}>
            <p>※使用可能な文字は以上の通りです。</p>
            <ul>
              <li>英大文字：A-Z・英小文字：a-z</li>
              <li>数字：0123456789</li>
              <li>{"記号：!\"#$%'()*,./:;<=>?@[]^_`{|}~"}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewPassword
