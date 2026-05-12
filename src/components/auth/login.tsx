import Image from "next/image";
import styles from "./login.module.scss"
import FormControl from "../commons/inputs/form-control";
import TextField from "../commons/inputs/text-field";
import ButtonSave from "../commons/buttons/btn-save";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"

type LoginFormData = {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();

  const [disable, setDisable] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting } } = useForm<LoginFormData>({
      defaultValues: {
        email: "",
        password: "",
      }
    })

  const onSubmit = async (data: LoginFormData) => {
    console.log(data, "in login form");


    // const email = sessionStorage.getItem("user");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      // login succeed
      if (res?.error) {
        setMessage(
          "email or password incorrect."
        );
        setMessageType("error");
      }
      console.log(res, "in signinform");
      if (!res?.error && res?.url) {
        sessionStorage.removeItem("user");

        router.replace(res?.url);
        return;
      } else {
        setDisable(false);
        setError('password', { type: 'custom', message: 'Incorrect email or password' })
        setHasError(true)
      }
      setDisable(false);
    } catch (error) {
      console.log(error, "in signinform");
      setDisable(false);

    }
  };
  
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
        {
          errors.email && errors.password && (
            <span className={`inputErrMsg `}> {errors.password.message?.toString()} </span>
          )
        }
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

          <div className={styles.inputContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 24 19" fill="currentColor">
              <path d="M11.9995 8.33349L21.6331 2.38892H2.36593L11.9995 8.33349ZM21.6331 16.6111V4.77782L11.9995 10.6665L2.36593 4.77782V16.6111H21.6331ZM21.6331 1.75492e-05C21.946 -0.00121467 22.2556 0.0624567 22.5419 0.186895C22.8282 0.311334 23.0847 0.493757 23.2949 0.722322C23.5186 0.940086 23.6961 1.19961 23.817 1.48576C23.9379 1.7719 23.9998 2.07893 23.999 2.38892V16.6111C23.9998 16.9211 23.9379 17.2281 23.817 17.5143C23.6961 17.8004 23.5186 18.06 23.2949 18.2777C23.0847 18.5063 22.8282 18.6887 22.5419 18.8131C22.2556 18.9376 21.946 19.0013 21.6331 19H2.36593C2.05306 19.0013 1.74343 18.9376 1.45715 18.8131C1.17086 18.6887 0.914313 18.5063 0.704168 18.2777C0.480444 18.06 0.30295 17.8004 0.18205 17.5143C0.0611499 17.2281 -0.000735887 16.9211 6.60269e-06 16.6111V2.38892C-0.000735887 2.07893 0.0611499 1.7719 0.18205 1.48576C0.30295 1.19961 0.480444 0.940086 0.704168 0.722322C0.914313 0.493757 1.17086 0.311334 1.45715 0.186895C1.74343 0.0624567 2.05306 -0.00121467 2.36593 1.75492e-05H21.6331Z" />
            </svg>
            <TextField
              name="email"
              register={register}
              placeholder="メールアドレス"
              validation={{
                required: "メールは必須です",
                maxLength: {
                  value: 50,
                  message: "50文字まで入力できます。",
                },
              }}
              maxLength={50}
            />
          </div>
          <div className={styles.inputContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 24 27" fill="currentColor">
              <path d="M23.1429 27H0.857143C0.384 27 0 26.6228 0 26.1562V12.6562C0 12.1897 0.384 11.8125 0.857143 11.8125H3.42857V8.4375C3.42857 3.77747 7.266 0 12 0C16.734 0 20.5714 3.77747 20.5714 8.4375V11.8125H23.1429C23.6169 11.8125 24 12.1897 24 12.6562V26.1562C24 26.6228 23.6169 27 23.1429 27ZM17.1429 8.01562C17.1429 5.45231 14.8397 3.375 12 3.375C9.16029 3.375 6.85714 5.45231 6.85714 8.01562V11.8125H17.1429V8.01562Z" fill="#999FC0" />
            </svg>
            <div className={styles.textboxContainer}>
              <TextField
                name="password"
                register={register}
                placeholder="パスワード"
                type={showPassword ? "text" : "password"}
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

          <div className={styles.btnContainer}>
            <ButtonSave type="submit" text="ログイン" />
          </div>
        </form>
        {message && <p className={`${styles.message} ${styles[messageType]}`}>{message}</p>}

        <Link href="/email-verification-page" className={styles.passwordForget}>パスワードをお忘れの方はこちら</Link>
      </div>

    </div>
  )
}

export default Login;