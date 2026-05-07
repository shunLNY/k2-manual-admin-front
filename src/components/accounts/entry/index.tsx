"use client"

/** @format */
import styles from "./account-entry.module.scss"
import { useState, useContext, useEffect, use } from "react"
import { useForm } from "react-hook-form"
import classNames from "classnames"
import ListPageContext from "@/store/list-page-context"
import { useParams } from "next/navigation"
import { fetcher } from "@/utils/fetcher"
import { createSuccessfulMessage, emailRegex, failMessage, invalidEmail, NEXT_PUBLIC_APP_URL, updateSuccessfulMessage } from "@/utils/constants"
import FormControl from "@/components/commons/inputs/form-control"
import AccountContext from "@/store/accounts-context"
import ButtonSave from "@/components/commons/buttons/btn-save"
import ButtonCancel from "@/components/commons/buttons/btn-cancel"
import FormFooter from "@/components/commons/inputs/form-footer"
import TextField from "@/components/commons/inputs/text-field"
import { IconDelete } from "@/components/icons/icons"
import { Account } from "@/utils/types"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import ConfirmModal from "@/components/categories/entry/confirm-model"



const AccountEntry = ({ mode }: { mode: 'new' | 'edit' }) => {
  const router = useRouter();
  const { id } = router.query;
  const _id = typeof id === 'string' ? id : '';
  console.log(_id, mode, '.................123')

  // const params = useParams();
  // const _id: string = params.slug as string
  const listCtx = useContext(AccountContext)
  const { getAccountInfo, accountInfo, setAccountInfo, refreshAccountRows } = listCtx;
  const pageCtx = useContext(ListPageContext)

  // const [accountInfo, setAccountInfo] = useState<Account | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isBtnDisable, setIsBtnDisable] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("editor")
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    if (mode === 'edit' && _id) {
      getAccountInfo(_id);
      pageCtx.setEntryMode("edit");
    } else {
      pageCtx.setEntryMode("new");
    }
  }, [_id]);




  // useEffect(() => {
  //   async function fetchData() {
  //     if (_id) {
  //       getAccountInfo(_id);
  //       pageCtx.setEntryMode("edit");
  //     } else {
  //       pageCtx.setEntryMode("new");
  //     }
  //   }
  //   fetchData();
  // }, [_id, getAccountInfo]);





  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    control,
    formState: { errors },
    watch,
    reset
  } = useForm<Account>({
    defaultValues: {
      id: "",
      role: "",
      account_name: "",
      email: "",
      password: "",
      account_id: ""
    }
  })

  useEffect(() => {
    if (accountInfo && _id) {
      const formData = {
        account_name: accountInfo.account_name ?? "",
        email: accountInfo.email ?? "",
        role: accountInfo.role ?? "public",
        account_id: accountInfo.account_id ?? ""

      }

      reset(formData)
      setSelectedStatus(accountInfo.role as "admin" | "editor")
    }
  }, [accountInfo, _id])

  const onSubmit = (data: any) => {
    setIsBtnDisable(true)
    let fetchConfig = {}
    let url = null
    let submitMsg = ""

    if (pageCtx.entryMode === "new") {
      url = "/api/proxy/admin/accounts/"
      fetchConfig = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
      submitMsg = createSuccessfulMessage
    } else {
      data = {
        ...data,
        id: accountInfo.id,
      }
      fetchConfig = {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
      url = new URL(window.location.origin + "/api/proxy/admin/accounts/" + accountInfo.id)
      submitMsg = updateSuccessfulMessage
    }

    fetcher(url, { ...fetchConfig })
      .then((res) => {
        toast.success(submitMsg)
        setIsBtnDisable(false)
        refreshAccountRows()
        if (pageCtx.entryMode === "new") {
          router.push("/accounts")
        } else {
          listCtx.setAccountInfo(res.data)
          router.push("/accounts")
        }
      })
      .catch((error) => {
        toast.error(failMessage)
        console.error("An error occurred:", error)
        setIsBtnDisable(false)
      })
  }

  const statusOptions = [
    { label: "編集者", value: "editor", style: styles.editor },
    { label: "管理者", value: "admin", style: styles.admin },

  ]

  const handleStatusClick = (value: string, label: string) => {
    setSelectedStatus(value)
    setValue("role", value)
  }

  const populateForm = (data: Account) => {
    if (data) {
      setValue("id", data.id || "")
      setValue("account_name", data.account_name || "")
      setValue("role", data.role || "editor")
      setValue("email", data.email || "")
      setValue("password", data.password || "")
      setSelectedStatus(data.role || "editor")
    }
  }

  const handleDelete = async () => {
    if (!accountInfo?.id) return
    setShowModal(true)
  }



  const cancelDelete = () => {
    setShowModal(false)
  }

  const confirmDelete = async () => {
    if (!accountInfo?.id) return;

    setIsBtnDisable(true)
    try {
      await fetcher(`/api/proxy/admin/accounts/${accountInfo.id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      })
      // toast.success("削除しました");
      refreshAccountRows();
      router.push("/accounts")

    } catch (error) {
      console.error("Error deleting category:", error)
      // toast.error("削除に失敗しました");
      setIsBtnDisable(false)
    }
  }

  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false)
  const [inputDateName, setInputDateName] = useState("")



  // if (isLoading) {
  //   return (
  //     <div className={styles.main_container}>
  //       <div className={styles.row_one}>
  //         <div className={styles.loading}>データを読み込み中...</div>
  //       </div>
  //     </div>
  //   )
  // }

  const handleBack = () => {
    reset();
    router.back();
  }

  // const handleEmailValidation = () => {
  //   router.replace('/email-verification-page');
  // };

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


      setIsBtnDisable(false)
    } catch (error) {

    }
  };



  return (
    <>
      <form className={styles.main_container}
        onSubmit={handleSubmit(onSubmit)}
        id="entryForm">
        <div className={styles.row_one}>
          <div className={styles.textboxContainer}>


            <FormControl label="ID" required>
              <TextField
                register={register}
                name="account_id"
                placeholder="Otech-1234"
                validation={{
                  maxLength: {
                    value: 50,
                    message: "50文字まで入力できます。",
                  },

                }}
                maxLength={50}
              />
              {errors.account_id && (
                <div className="inputErrMsg">
                  {errors.account_id.message?.toString()}
                </div>
              )}
            </FormControl>


            <FormControl label="アカウント名" required>
              <TextField
                register={register}
                name="account_name"
                placeholder="アカウント"
                validation={{
                  required: "アカウント名は必須です",
                  maxLength: {
                    value: 50,
                    message: "50文字まで入力できます。",
                  },
                }}
                maxLength={50}

              />
              {errors.account_name && (
                <div className="inputErrMsg">
                  {errors.account_name.message?.toString()}
                </div>
              )}
            </FormControl>
          </div>
          <FormControl label="権限" required>
            <div className={styles.status_container}>
              {statusOptions.map(({ label, value, style }) => (
                <div
                  key={value}
                  role="button"
                  className={classNames(selectedStatus === value ? style : "")}
                  onClick={() => handleStatusClick(value, label)}
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
                placeholder="メールアドレス"
                validation={{
                  required: "メールアドレスは必須です",
                  maxLength: {
                    value: 50,
                    message: "50文字まで入力できます。",
                  },
                  pattern: {
                    value: emailRegex,
                    message: invalidEmail,
                  },
                }}
                maxLength={50}
              />
              {errors.email && (
                <div className="inputErrMsg">
                  {errors.email.message?.toString()}
                </div>
              )}
            </FormControl>
          </div>



        </div>

        {/* <div className={styles.row_two}></div> */}

        <FormFooter>
          <ButtonCancel onClick={() => router.back()} text="戻る" type="button" />
          {
            mode === "edit" && (
              <ButtonSave type="button" text="招待" onClick={handleEmailValidation} className={styles.submitBtn} disabled={isBtnDisable} />
            )
          }
          <ButtonSave type="submit" text="保存" className={styles.submitBtn} disabled={isBtnDisable} />
          {
            mode === "edit" && (
              <span onClick={handleDelete} role="button" className={styles.iconDelete}>
                <IconDelete />
              </span>
            )
          }

        </FormFooter>
      </form>

      <ConfirmModal
        isOpen={showModal}
        title="アカウント削除"
        message="このアカウントを削除してもよろしいですか？"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}

export default AccountEntry;
