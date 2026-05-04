"use client"

/** @format */
import styles from "./category-entry.module.scss"
import { useState, useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import classNames from "classnames"
import ListPageContext from "@/store/list-page-context"
import { useParams } from "next/navigation"
import { fetcher } from "@/utils/fetcher"
import { createSuccessfulMessage, failMessage, updateSuccessfulMessage } from "@/utils/constants"
import FormControl from "@/components/commons/inputs/form-control"
import CategoryContext from "@/store/categories-context"
import ButtonSave from "@/components/commons/buttons/btn-save"
import ButtonCancel from "@/components/commons/buttons/btn-cancel"
import FormFooter from "@/components/commons/inputs/form-footer"
import TextField from "@/components/commons/inputs/text-field"
import { IconDelete } from "@/components/icons/icons"
import { usePathname } from "next/navigation"
import { toast } from "react-toastify"
import dayjs from "dayjs"
import ConfirmModal from "./confirm-model"
import { useRouter } from "next/router"
import AuthContext from "@/store/auth-context"
import ReactSelect from "@/components/commons/inputs/_select"

const CategoriesEntry = () => {
  const router = useRouter()
  const params = useParams()
  // console.log(params)
  const pathname = router.pathname;
  const showInfo = pathname !== "/categories/new"
  const _id: string = params?.id as string

  const listCtx = useContext(CategoryContext)
  const pageCtx = useContext(ListPageContext)
  const { categoryInfo, refreshCategoryRows, getCategoryInfo } = listCtx;
  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false)
  const [isBtnDisable, setIsBtnDisable] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<"public" | "private">("public")

  const [showModal, setShowModal] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      category_name: "",
      category_slug: "",
      status: "public",
      sort_order: 0,
      createdAt: "",
      blog_categories: [],
      has_parent: "no",
      parent_id: "",
    has_child: "no",
    child_id: "",
    },
  })

  const watchHasParent = watch("has_parent");
const watchHasChild = watch("has_child");

  useEffect(() => {
    async function fetchData() {
      if (_id) {
        setIsLoading(true)
        try {
          await getCategoryInfo(_id)
          pageCtx.setEntryMode("edit")
        } catch (error) {
          console.error("Error fetching category:", error)
          toast.error("カテゴリーの取得に失敗しました")
        } finally {
          setIsLoading(false)
        }
      } else {
        pageCtx.setEntryMode("new")
        reset()
        setSelectedStatus("public")
      }
    }
    fetchData()
  }, [_id])

  useEffect(() => {
    if (categoryInfo && _id) {
      const formData = {
        category_name: categoryInfo.category_name ?? "",
        category_slug: categoryInfo.category_slug ?? "",
        status: categoryInfo.status ?? "public",
        sort_order: categoryInfo.sort_order ?? 0,
        createdAt: categoryInfo.createdAt ?? "",
        blogCategories: categoryInfo.blogCategories ?? [],
      }

      reset(formData)
      setSelectedStatus(categoryInfo.status as "public" | "private")
    }
  }, [categoryInfo, _id, reset])

  const statusOptions = [
    { label: "公開", value: "public", style: styles.public },
    { label: "非公開", value: "private", style: styles.private },
  ]

  const handleStatusClick = (value: string, label: string) => {
    setSelectedStatus(value as "public" | "private")
    setValue("status", value)
  }

  const onSubmit = (data: any) => {
    console.log(data)
    setIsBtnDisable(true)
    let fetchConfig = {}
    let url = null
    let submitMsg = ""

    if (pageCtx.entryMode === "new") {
      url = "/api/proxy/admin/categories/"
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
        id: categoryInfo.id,
      }
      fetchConfig = {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
      url = new URL(window.location.origin + "/api/proxy/admin/categories/" + categoryInfo.id)
      submitMsg = updateSuccessfulMessage
    }

    fetcher(url, { ...fetchConfig })
      .then((res) => {
        toast.success(submitMsg)
        setIsBtnDisable(false)
        refreshCategoryRows()
        if (pageCtx.entryMode === "new") {
          router.push("/categories")
        } else {
          listCtx.setCategoryInfo(res.data)
          router.push("/categories")
        }
      })
      .catch((error) => {
        toast.error(failMessage)
        console.error("An error occurred:", error)
        setIsBtnDisable(false)
      })
  }

  const handleDelete = async () => {
    if (!categoryInfo?.id) return
    setShowModal(true)
  }

  const confirmDelete = async () => {
    setShowModal(false)
    setIsBtnDisable(true)
    try {
      await fetcher(`/api/proxy/admin/categories/${categoryInfo.id}`, { method: "DELETE" })
      toast.success("カテゴリーを削除しました")
      router.push("/categories")
      refreshCategoryRows()
    } catch (err) {
      console.error(err)
      toast.error(failMessage)
      setIsBtnDisable(false)
    }
  }

  const cancelDelete = () => {
    setShowModal(false)
  }

  // blog count
  const blogCount = categoryInfo?.blog_categories?.length ?? 0
  const deleteMessage =
    blogCount > 0
      ? `${blogCount.toLocaleString()} 件の記事で使用されています。削除しますか？\n (※ このカテゴリに関する投稿も削除されます。)`
      : "このカテゴリーを削除しますか？"

  if (isLoading) {
    return (
      <div className={styles.main_container}>
        <div className={styles.row_one}>
          <div className={styles.loading}>データを読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <form className={styles.main_container} onSubmit={handleSubmit(onSubmit)} id="entryForm">
        <div className={styles.row_one}>
          <div className={styles.textboxContainer}>
            <FormControl label="カテゴリー名" required>
              <TextField
                register={register}
                name="category_name"
                placeholder="カテゴリー"
                validation={{
                  required: "カテゴリー名は必須です",
                  maxLength: {
                    value: 50,
                    message: "50文字まで入力できます。",
                  },
                }}
                maxLength={50}
              />
              {errors.category_name && (
                <p className={styles.error_message}>
                  {errors.category_name.message}
                </p>
              )}
            </FormControl>
          </div>

          <div className={styles.textboxContainer}>
            <FormControl label="スラッグ" required>
              <TextField
                register={register}
                name="category_slug"
                placeholder="スラッグ"
                validation={{
                  required: "スラッグは必須です",
                  maxLength: {
                    value: 50,
                    message: "50文字まで入力できます。",
                  },
                  // Add the pattern rule for validation
                  pattern: {
                    value: /^[a-z0-9-_]+$/,
                    message: "小文字アルファベット、数字、ハイフンのみ使用可能です。",
                  },
                }}
                maxLength={50}
              />
              {errors.category_slug && (
                <p className={styles.error_message}>
                  {errors.category_slug.message}
                </p>
              )}
            </FormControl>
          </div>

          {/* --- Parent Category Section --- */}
<div className={styles.flexRow}>
  <FormControl label="親カテゴリはありますか？" required>
    <div className={styles.radio_group}>
      <label>
        <input {...register("has_parent")} type="radio" value="yes" /> はい
      </label>
      <label>
        <input {...register("has_parent")} type="radio" value="no" /> いいえ
      </label>
    </div>
  </FormControl>

  {/* watchHasParent က "yes" ဖြစ်မှ Dropdown ပေါ်မည် */}
  {watchHasParent === "yes" && (
    <div className={styles.dropdown_side}>
      <FormControl label="親カテゴリー名" required>
        <ReactSelect
          options={listCtx.items.map(item => ({ value: item.id, label: item.category_name }))}
          placeholder="---親カテゴリーを選択します---"
          onChange={(opt: any) => setValue("parent_id", opt.value)}
        />
      </FormControl>
    </div>
  )}
</div>

{/* --- Child Category Section --- */}
<div className={styles.flexRow}>
  <FormControl label="子カテゴリはありますか？" required>
    <div className={styles.radio_group}>
      <label>
        <input {...register("has_child")} type="radio" value="yes" /> はい
      </label>
      <label>
        <input {...register("has_child")} type="radio" value="no" /> いいえ
      </label>
    </div>
  </FormControl>

  {/* watchHasChild က "yes" ဖြစ်မှ Dropdown ပေါ်မည် */}
  {watchHasChild === "yes" && (
    <div className={styles.dropdown_side}>
      <FormControl label="子カテゴリー名" required>
        <ReactSelect
          options={listCtx.items.map(item => ({ value: item.id, label: item.category_name }))}
          placeholder="---子カテゴリーを選択します---"
          onChange={(opt: any) => setValue("child_id", opt.value)}
        />
      </FormControl>
    </div>
  )}
</div>

          <FormControl label="公開設定" required>
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

          {showInfo && categoryInfo && (
            <div className={styles.info_section}>
              <div className={styles.info_item}>
                <span className={styles.info_label}>並び順</span>
                <span className={styles.info_value}>{categoryInfo.sort_order || "-"}</span>
              </div>
              <div className={styles.info_item}>
                <span className={styles.info_label}>作成日</span>
                <span className={styles.info_value}>
                  {categoryInfo.createdAt ? dayjs(categoryInfo.createdAt).format("YYYY-MM-DD") : "-"}
                </span>
              </div>
              <div className={styles.info_item}>
                <span className={styles.info_label}>記事件数</span>
                <span className={styles.info_value}>{blogCount > 0 ? `${blogCount.toLocaleString()} 件` : "0 件"}</span>
                {/* <span className={styles.info_value}>{categoryInfo?.blogCategories?.length ?? 0}</span> */}
              </div>
            </div>
          )}
        </div>

        <FormFooter>
          <ButtonCancel onClick={() => router.back()} text="戻る" type="button" />
          <ButtonSave type="submit" text="保存" className={styles.submitBtn} disabled={isBtnDisable} />
          {showInfo && authCtx.user.role === 'admin' && (
            <span className={styles.iconDelete} onClick={handleDelete} role="button" style={{ cursor: "pointer" }}>
              <IconDelete />
            </span>
          )}
        </FormFooter>
      </form>

      <ConfirmModal
        isOpen={showModal}
        title="カテゴリー削除"
        message={deleteMessage}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}

export default CategoriesEntry;
