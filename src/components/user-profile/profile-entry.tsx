import { useForm } from "react-hook-form";
import FormControl from "../commons/inputs/form-control";
import TextField from "../commons/inputs/text-field";
import styles from "./profile-entry.module.scss";
import { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import FormFooter from "../commons/inputs/form-footer";
import ButtonCancel from "../commons/buttons/btn-cancel";
import ButtonSave from "../commons/buttons/btn-save";
import { IconDelete } from "../icons/icons";
import AuthContext from "@/store/auth-context";
import { fetcher } from "@/utils/fetcher";
import { toast } from "react-toastify";
import { failMessage, updateSuccessfulMessage } from "@/utils/constants";
import AccountContext from "@/store/accounts-context";
import { signOut } from 'next-auth/react';
import { NEXT_PUBLIC_APP_URL } from '@/utils/constants';
import { useRouter } from "next/router";

const ProfileEntry = () => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();
  const [isBtnDisable, setIsBtnDisable] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("admin");
  const { getAccountInfo, accountInfo } = useContext(AccountContext);
  const [isEmailEdited, setIsEmailEdited] = useState(false);

  const statusOptions = [
    { label: "編集者", value: "editor", style: styles.editor },
    { label: "管理者", value: "admin", style: styles.admin },
  ]

  const handleStatusClick = (value: string, label: string) => {
    setSelectedStatus(value)
    setValue("status", value)
  };

  useEffect(() => {
    getAccountInfo(authCtx.user.uid);
  }, [authCtx.user.uid])

  useEffect(() => {
    if (accountInfo) {
      const formData = {
        account_name: accountInfo.account_name ?? "",
        email: accountInfo.email ?? "",
        role: accountInfo.role ?? "admin",
        account_id: accountInfo.account_id ?? ""

      }

      reset(formData)
      setSelectedStatus(accountInfo.role as "admin" | "editor")
    }
  }, [accountInfo])

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      status: ""
    },
  })


  useEffect(() => {
    const initialData = {
      id: authCtx.user.account_id,
      name: authCtx.user.account_name,
      email: authCtx.user.email,
      status: authCtx.user.role
    }

    reset(initialData)
  }, [authCtx.user])

  //Password reset
  const handleEmailValidation = async () => {
    setIsBtnDisable(true)

    const email = await getValues('email')

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
      toast.success('メールが送信されました');
      setTimeout(() => signOut({ callbackUrl: NEXT_PUBLIC_APP_URL + '/auth/signin' }), 2000)


      setIsBtnDisable(false)
    } catch (error) {

    }
  };



  const onSubmit = (data: any) => {
    setIsBtnDisable(true)
    let fetchConfig = {};
    let url = null;
    data.isEmailEdited = isEmailEdited;
    console.log(data);

    data = {
      ...data,
      id: authCtx.user.id,
    }
    fetchConfig = {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    }
    url = new URL(window.location.origin + "/api/proxy/admin/accounts/my-profile/" + authCtx.user.uid)



    fetcher(url, { ...fetchConfig })
      .then((res) => {
        toast.success(updateSuccessfulMessage)
        setIsBtnDisable(false)
        authCtx.refreshUser;
        setIsEmailEdited(false);

        if (res.data.message === "Email edited") {
          signOut({ callbackUrl: NEXT_PUBLIC_APP_URL + '/auth/signin' })
        }
      })
      .catch((error) => {
        toast.error(failMessage)
        console.error("An error occurred:", error)
        setIsBtnDisable(false)
      })
  }

  return (
    <>
      <form className={styles.main_container} onSubmit={handleSubmit(onSubmit)} id="entryForm">
        <div className={styles.row_one}>
          <div className={styles.title}>
            <p>ID</p>
            <p>{authCtx.user.account_id}</p>
          </div>
          <div className={styles.textboxContainer}>
            <FormControl label="アカウント名" required>
              <TextField
                register={register}
                name="account_name"
                placeholder="田中太郎"
                validation={{
                  required: "アカウント名は必須です",
                  maxLength: {
                    value: 50,
                    message: "50文字まで入力できます。",
                  },
                }}
                maxLength={50}
              />
            </FormControl>
          </div>
          <FormControl label="権限" required>
            <div className={styles.status_container}>
              {statusOptions.map(({ label, value, style }) => (
                <div
                  key={value}
                  role="button"

                  className={classNames(selectedStatus === value ? style : "",)}

                >
                  {label}
                </div>
              ))}
            </div>
          </FormControl>
          <div className={styles.textboxContainer}>
            <FormControl label="メールアドレス" required>
              <TextField
                register={register}
                name="email"
                placeholder="tanaka@sample.com"
                validation={{
                  required: "メールアドレスは必須です",
                  maxLength: {
                    value: 50,
                    message: "50文字まで入力できます。",
                  },
                }}
                onChange={() => setIsEmailEdited(true)}
                maxLength={50}
              />
            </FormControl>
          </div>


        </div>

        {/* <div className={styles.row_two}></div> */}

        <FormFooter>

          <ButtonCancel
            disabled={isBtnDisable}
            onClick={() => {
              reset();
              router.back();
            }
            }
            text='戻る'
            type='button'></ButtonCancel>
          <ButtonSave onClick={handleEmailValidation} disabled={isBtnDisable} text='パスワード再設定' type='button'></ButtonSave>
          <ButtonSave
            type='submit'
            text='保存'
            className={styles.submitBtn}
            disabled={isBtnDisable}></ButtonSave>


        </FormFooter>
      </form>

    </>
  )
}

export default ProfileEntry