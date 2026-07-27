/** @format */
"use client";

import styles from "./articles.entry.module.scss";
import { useState, useContext, useEffect, useMemo, useRef } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import classNames from "classnames";
import React from "react";
import { useListPage } from "@/store/list-page-context";

import formStyles from "../../commons/inputs/form-element.module.scss";

import { IconClose, IconDelete, SearchIcon } from "@/components/icons/icons";
import { fetcher } from "@/utils/fetcher";
import {
  API_URL,
  ArticleStatus,
  createSuccessfulMessage,
  failMessage,
  updateSuccessfulMessage,
} from "@/utils/constants";
import FormControl from "@/components/commons/inputs/form-control";
import { useBlog } from "@/store/articles-context";
import ButtonSave from "@/components/commons/buttons/btn-save";
import ButtonCancel from "@/components/commons/buttons/btn-cancel";
import FormFooter from "@/components/commons/inputs/form-footer";
import TextField from "@/components/commons/inputs/text-field";
import DateInput from "@/components/commons/inputs/date-input";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Modal from "@/components/modals/modal";
import ReactDatepicker from "@/components/commons/datepicker/react-datepicker";
import { ArticlesInfoType } from "@/utils/types";
// import { Option } from '@/components/commons/inputs/multi-select-box';

import { useCategoryList } from "@/store/categories-context";
import ConfirmModal from "./confirm-model";
import MultiSelect from "@/components/commons/inputs/multi-select-box";
import CategorySelectModal from "./category-select-modal";
import dynamic from "next/dynamic";
import inputStyles from "../../commons/inputs/form-element.module.scss";
import Image from "next/image";
import { resizeMainImage } from "@/utils/helpers";
import { stripHtml } from "@/utils/strip-html";
import {
  normalizeContentImageUrls,
  resolveContentImageUrls,
} from "@/utils/article-content";
import { useAuth } from "@/store/auth-context";

// Dynamically import the editor with SSR disabled
const SummernoteEditor = dynamic(
  () => import("../../commons/text-editor/summernote-editor"),
  {
    ssr: false,
  }
);

const ArticleEntry = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const entryContentRef = useRef<HTMLDivElement>(null);
  const pathname = router.pathname;
  const _id = typeof router.query.id === "string" ? router.query.id : "";
  const showInfo = pathname !== "/articles/new" && !!_id;

  const listCtx = useBlog();
  const categoryListCtx = useCategoryList();
  const pageCtx = useListPage();
  const { blogInfo, refreshBlogRows, getBlogInfo } = listCtx;
  const articleId = blogInfo?.id || _id;
  const { items } = categoryListCtx;
  const AuthCtx = useAuth();

  const categoryOptions: any[] = useMemo(() => {
    const getAllCategoriesFormatted = (categories: any[], depth = 1): any[] => {
      let result: any[] = [];
      if (!categories) return result;
      for (const category of categories) {
        let prefix = "";
        if (depth === 1) {
          prefix = "▣ ";
        } else {
          prefix = "　".repeat(depth - 1) + "↳ ";
        }
        result.push({
          value: category.id,
          label: prefix + category.category_name,
        });
        if (category.child_categories && category.child_categories.length > 0) {
          result = result.concat(
            getAllCategoriesFormatted(category.child_categories, depth + 1)
          );
        }
      }
      return result;
    };
    return getAllCategoriesFormatted(items);
  }, [items]);

  console.log(blogInfo);

  const [isLoading, setIsLoading] = useState(false);
  const [isBtnDisable, setIsBtnDisable] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"published" | "private">(
    "private"
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] =
    useState<ArticlesInfoType | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [content, setContent] = useState("");
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

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
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      status: "draft",
      publish_start_at: "",
      publish_end_at: "",
      content: "",
      thumbnail_path: "",
      category_id: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!router.isReady) return;

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      formRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
      entryContentRef.current?.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    };

    scrollToTop();
    window.addEventListener("pageshow", scrollToTop);

    return () => {
      window.removeEventListener("pageshow", scrollToTop);
    };
  }, [router.isReady, router.asPath]);

  useEffect(() => {
    if (!router.isReady) return;

    async function fetchData() {
      if (_id) {
        setIsLoading(true);
        try {
          await getBlogInfo(_id);
          pageCtx.setEntryMode("edit");
        } catch (error) {
          console.error("Error fetching blog:", error);
          toast.error("記事の取得に失敗しました");
        } finally {
          setIsLoading(false);
        }
      } else {
        pageCtx.setEntryMode("new");
        reset();
        setSelectedStatus("private");
      }
    }
    fetchData();
  }, [_id, router.isReady]);

  const formatDateForInput = (date: string | null | undefined) => {
    if (!date) return "";
    return dayjs(date).format("YYYY-MM-DD");
  };

  useEffect(() => {
    if (blogInfo?.id && _id && blogInfo.id === _id) {
      setImage(blogInfo.thumbnail_path || null);

      const info = blogInfo as any;
      const catId =
        info.categoryId ||
        info.category_id ||
        (info.category ? info.category.id : "");

      setContent(resolveContentImageUrls(info.content ?? ""));

      reset({
        title: info.title ?? "",
        status: info.status ?? "private",
        publish_start_at: formatDateForInput(
          info.published_start_at || info.publish_start_at
        ),
        publish_end_at: formatDateForInput(
          info.published_end_at || info.publish_end_at
        ),
        content: info.content ?? "",
        thumbnail_path: info.thumbnail_path ?? "",
        category_id: catId,
        description: info.description ?? info.excerpt ?? "",
      });

      setSelectedStatus(
        (info.status === "published" ? "published" : "private") as
          | "published"
          | "private"
      );

      // Sync category name for display on the button
      const catName = info.category?.category_name || info.categoryName || "";
      if (catName) setSelectedCategoryName(catName);
    } else if (!_id) {
      reset({
        title: "",
        status: "private",
        publish_start_at: "",
        publish_end_at: "",
        content: "",
        thumbnail_path: "",
        category_id: "",
        description: "",
      });
      setSelectedStatus("private");
      setContent("");
      setImage(null);
      setSelectedCategoryName("");
    }
  }, [blogInfo, _id, reset]);

  console.log(selectedCategories, ".....");

  const statusOptions = [
    { label: "公開", value: "published", style: styles.public },
    { label: "非公開", value: "private", style: styles.private },
  ];

  const handleStatusClick = (value: string, label: string) => {
    setSelectedStatus(value as "published" | "private");
    setValue("status", value);
  };

  const handleSaveClick = (data: any) => {
    setFormDataToSubmit(data);
    let message = "この内容で記事を保存しますか？";
    const startDate = data.publish_start_at;
    const endDate = data.publish_end_at;
    const formattedStartDate = startDate
      ? dayjs(startDate).format("YYYY/MM/DD")
      : null;
    const formattedEndDate = endDate
      ? dayjs(endDate).format("YYYY/MM/DD")
      : null;
    console.log(formattedEndDate);

    //For Content — store /storage paths, not display URLs
    data.content = normalizeContentImageUrls(content);

    if (formattedStartDate && formattedEndDate) {
      message = `公開期間は ${dayjs(formattedStartDate).format(
        "YYYY/MM/DD"
      )} から ${dayjs(formattedEndDate).format(
        "YYYY/MM/DD"
      )} までです。\n記事を保存しますか？`;
    } else if (formattedStartDate) {
      message = `公開期間は ${dayjs(formattedStartDate).format(
        "YYYY/MM/DD"
      )} からです。\n記事を保存しますか？`;
    } else if (formattedEndDate) {
      message = `公開期間は今日から ${dayjs(formattedEndDate).format(
        "YYYY/MM/DD"
      )} までです。\n記事を保存しますか？`;
    }

    setConfirmationMessage(message);
    setShowSaveModal(true);
  };

  // Content Change
  const handleBodyChange = (content: any) => {
    // console.log(content, ".................on Submit Data Content")
    setContent(content);
    setValue("content", content);
  };

  const handleGenerateDescription = async () => {
    const plainText = stripHtml(content);
    if (!plainText) {
      toast.error("本文を入力してください。");
      return;
    }

    setIsGeneratingExcerpt(true);
    try {
      const res = await fetcher<{ description: string }>(
        "/api/articles/generate-excerpt",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            title: getValues("title"),
          }),
        }
      );
      setValue("description", res.description, { shouldValidate: true });
      toast.success("概要を生成しました。");
    } catch (error: any) {
      console.error(error);
      const apiMessage =
        error?.info?.message && typeof error.info.message === "string"
          ? error.info.message
          : null;
      toast.error(apiMessage || "概要の生成に失敗しました。");
    } finally {
      setIsGeneratingExcerpt(false);
    }
  };

  const handleConfirmSubmit = () => {
    if (!formDataToSubmit) return;
    setShowSaveModal(false);
    setIsBtnDisable(true);

    const rawForm = formDataToSubmit as any;
    let transformedData = {
      title: rawForm.title,
      status: rawForm.status,
      content: rawForm.content,
      description: rawForm.description,
      thumbnail_path: rawForm.thumbnail_path,
      published_start_at: rawForm.publish_start_at || null,
      published_end_at: rawForm.publish_end_at || null,
      category_id: rawForm.category_id,
      id: articleId,
    };

    const hasStartDate = !!transformedData.published_start_at;
    const hasEndDate = !!transformedData.published_end_at;

    if (!hasStartDate && !hasEndDate) {
      // Both empty: publish_start_at = today, publish_end_at = ""
      transformedData.published_start_at = dayjs().format("YYYY-MM-DD");
      transformedData.published_end_at = null;
    } else if (hasStartDate && !hasEndDate) {
      // Only start date: Use the input value and leave end date empty
      transformedData.published_start_at = transformedData.published_start_at;
      transformedData.published_end_at = null;
    } else if (!hasStartDate && hasEndDate) {
      // Only end date: publish_start_at = today, publish_end_at = input
      transformedData.published_start_at = dayjs().format("YYYY-MM-DD");
      transformedData.published_end_at = transformedData.published_end_at;
    } else {
      // Both filled: Use the provided values
      transformedData.published_start_at = transformedData.published_start_at;
      transformedData.published_end_at = transformedData.published_end_at;
    }

    console.log("Transformed Data:", transformedData);
    setIsBtnDisable(true);

    let fetchConfig = {};
    let url = null;
    let submitMsg = "";

    if (!_id) {
      url = "/api/proxy/admin/articles/";
      fetchConfig = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(transformedData),
      };
      submitMsg = createSuccessfulMessage;
    } else {
      if (!articleId) {
        toast.error(failMessage);
        setIsBtnDisable(false);
        return;
      }
      const updatedData = {
        ...transformedData,
        id: articleId,
      };
      fetchConfig = {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(updatedData),
      };
      url = new URL(
        window.location.origin + "/api/proxy/admin/articles/" + articleId
      );
      submitMsg = updateSuccessfulMessage;
    }

    fetcher(url, { ...fetchConfig })
      .then((res) => {
        toast.success(submitMsg);
        setIsBtnDisable(false);
        refreshBlogRows();
        router.push("/articles");
      })
      .catch((error) => {
        toast.error(failMessage);
        console.error("An error occurred:", error);
        setIsBtnDisable(false);
      });
  };

  const handleDelete = async () => {
    if (!articleId) {
      toast.error("記事IDが取得できません。");
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!articleId) return;
    setShowDeleteModal(false);
    setIsBtnDisable(true);
    try {
      await fetcher(`/api/proxy/admin/articles/${articleId}`, {
        method: "DELETE",
      });
      toast.success("記事を削除しました");
      router.push("/articles");
      refreshBlogRows();
    } catch (err: any) {
      console.error(err);
      const apiMessage =
        err?.info?.message && typeof err.info.message === "string"
          ? err.info.message
          : null;
      toast.error(apiMessage || failMessage);
      setIsBtnDisable(false);
    }
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [inputDateName, setInputDateName] = useState("");

  const [image, setImage] = useState<string | null>(null);
  const handleFileChange = (event: any) => {
    const id = toast.loading("Please wait...");
    const file = event.target.files[0];
    if (file) {
      resizeMainImage(file, false, 2560)
        .then(({ image }: any) => {
          const formData = new FormData();

          formData.append("thumbnail_path", image);
          fetcher("/api/proxy/files/_tmp/image/upload", {
            method: "POST",
            body: formData,
          })
            .then((res) => {
              if (res.path) {
                setImage(res.path);

                setValue("thumbnail_path", res.path);
                toast.update(id, {
                  render: "Image Uploaded for slider Successfully",
                  type: "success",
                  isLoading: false,
                  autoClose: 1500,
                });
              }
            })
            .catch((err) => {
              toast.update(id, {
                render: err?.info?.message || "Image Upload Failed",
                type: "error",
                isLoading: false,
                autoClose: 1500,
              });
              console.log(err);
            });
        })
        .catch((error) => {
          console.error("Error resizing image:", error);
        })
        .finally(() => {
          event.target.value = null; // Clear the input value
        });
    }
  };

  const customToolbar = useMemo(
    () => [
      ["font", ["bold", "italic", "underline", "clear"]],
      ["color", ["forecolor", "backcolor"]], // ဒီနေရာကို ပြင်ဆင်ပါ
      ["para", ["ul", "ol"]],
      ["insert", ["link", "picture", "video"]],
      ["view", ["fullscreen", "codeview"]],
    ],
    []
  );

  return (
    <>
      <form
        ref={formRef}
        className={styles.main_container}
        onSubmit={handleSubmit(handleSaveClick)}
      >
        <div ref={entryContentRef} className={styles.main_container}>
          <div className={styles.row_one}>
            <div className={styles.title_field}>
              <FormControl label="タイトル" required>
                <TextField
                  register={register}
                  name="title"
                  placeholder="行（グループ）機能をリリースしました。"
                  // onKeyDown={handleKeyDown}
                  validation={{
                    maxLength: {
                      value: 50,
                      message: "50文字まで入力できます。",
                    },
                  }}
                  maxLength={50}
                />
              </FormControl>
            </div>
            <div className={styles.body_field}>
              <FormControl label="本文" required>
                <SummernoteEditor
                  value={content}
                  onChange={handleBodyChange}
                  toolbar={customToolbar}
                />
              </FormControl>
            </div>
          </div>
          <div className={styles.row_two}>
            <FormControl label="公開設定" required>
              <div className={styles.status_container}>
                {statusOptions.map(({ label, value, style }) => (
                  <div
                    key={value}
                    role="button"
                    className={classNames(
                      selectedStatus === value ? style : ""
                    )}
                    onClick={() => {
                      handleStatusClick(value, label);
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </FormControl>
            <FormControl
              label="公開期間"
              // helperText='公開期間を選択してください。'
              any
            >
              <div className={styles.publish_date_container}>
                <div className={styles.date_input}>
                  <Controller
                    name="publish_start_at"
                    control={control}
                    // rules={{
                    //   required: '公開期間を選択してください。',
                    // }}
                    render={({ field, fieldState }) => (
                      <>
                        <DateInput
                          {...field}
                          onClick={() => {
                            setIsOpenDatePicker(true);
                            setInputDateName("publish_start_at");
                          }}
                          onClear={() => setValue("publish_start_at", "")}
                          value={
                            field.value
                              ? dayjs(new Date(field.value)).format(
                                  "YYYY/MM/DD"
                                )
                              : ""
                          }
                          placeholder={"2025/01/01"}
                        />
                      </>
                    )}
                  />
                </div>
                <div>~</div>
                <div className={styles.date_input}>
                  <Controller
                    name="publish_end_at"
                    control={control}
                    // rules={{
                    //   required: '公開期間を選択してください。',
                    // }}
                    render={({ field }) => (
                      <>
                        <DateInput
                          {...field}
                          onClick={() => {
                            setIsOpenDatePicker(true);
                            setInputDateName("publish_end_at");
                          }}
                          onClear={() => setValue("publish_end_at", "")}
                          value={
                            field.value
                              ? dayjs(new Date(field.value)).format(
                                  "YYYY/MM/DD"
                                )
                              : ""
                          }
                          placeholder={"2025/01/01"}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            </FormControl>

            <FormControl label="サムネイル" any>
              <div className={styles.img_upload_container}>
                {watch("thumbnail_path") ? (
                  <div className={styles.thumbnail_container}>
                    <button
                      type="button"
                      className={styles.close_ic}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        setValue("thumbnail_path", "");
                      }}
                    >
                      <IconClose />
                    </button>
                    <Image
                      className={styles.img_relative}
                      src={API_URL + "/files" + image}
                      alt="Preview"
                      fill
                      sizes={"400px"}
                      style={{ objectFit: "cover" }}
                      quality={90}
                      priority={false}
                    />
                  </div>
                ) : (
                  <>
                    <div className={styles.thumbnail_upload}>
                      <p className={styles.thumbnail_btn}>PHOTOS UPLOAD</p>
                    </div>
                    <input
                      hidden
                      className={inputStyles.customInput}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        e.stopPropagation();
                        handleFileChange(e);
                      }}
                      placeholder="image"
                      id="fileInput"
                    />
                  </>
                )}
              </div>
            </FormControl>

            <FormControl label="カテゴリー設定" required>
              <Controller
                control={control}
                name="category_id"
                rules={{
                  required: "カテゴリーを選択してください",
                }}
                render={({ field, fieldState }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "8px 12px",
                        border: fieldState.error
                          ? "2px solid red"
                          : "2px solid var(--border)",
                        borderRadius: "5px",
                        background: "var(--input-background)",
                        fontSize: "14px",
                        cursor: "pointer",
                        textAlign: "left",
                        minHeight: "40px",
                      }}
                    >
                      <span>
                        {field.value
                          ? selectedCategoryName ||
                            categoryOptions.find(
                              (opt: any) => opt.value === field.value
                            )?.label ||
                            "カテゴリーを選択してください"
                          : "カテゴリーを選択してください"}
                      </span>
                      <span
                        style={{
                          color: "var(--muted-foreground)",
                          marginLeft: "8px",
                          fontSize: "1rem",
                        }}
                      >
                        <SearchIcon />
                      </span>
                    </button>
                    {fieldState.error && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginTop: "4px",
                        }}
                      >
                        {fieldState.error.message}
                      </div>
                    )}
                    <CategorySelectModal
                      isOpen={isCategoryModalOpen}
                      onClose={() => setIsCategoryModalOpen(false)}
                      categories={items}
                      currentCategoryId={field.value}
                      onSelect={(categoryId, categoryName) => {
                        field.onChange(categoryId);
                        setSelectedCategoryName(categoryName);
                      }}
                    />
                  </>
                )}
              />
            </FormControl>

            <FormControl label="概要" required>
              <div className={styles.excerpt_container}>
                <textarea
                  className={styles.textareaInput}
                  rows={4}
                  placeholder="記事の概要を入力してください。"
                  {...register("description", {
                    required: "概要を入力してください。",
                    maxLength: {
                      value: 500,
                      message: "500文字まで入力できます。",
                    },
                  })}
                  maxLength={500}
                />
                {/* <button
									type="button"
									className={styles.generate_btn}
									onClick={handleGenerateDescription}
									disabled={isGeneratingExcerpt}
								>
									{isGeneratingExcerpt
										? "生成中..."
										: "+ 概要生成"}
								</button> */}
              </div>
            </FormControl>
          </div>
        </div>
        <FormFooter>
          <ButtonCancel
            onClick={() => router.back()}
            text="戻る"
            type="button"
          ></ButtonCancel>
          {/* <ButtonSave text='プレビュー' type='button'></ButtonSave> */}
          <ButtonSave
            type="submit"
            text="保存"
            className={styles.submitBtn}
            disabled={isBtnDisable}
          ></ButtonSave>

          {showInfo && AuthCtx.hasOwnerPermission && (
            <button
              type="button"
              className={styles.iconDelete}
              onClick={handleDelete}
              aria-label="記事を削除"
            >
              <IconDelete />
            </button>
          )}
        </FormFooter>
      </form>

      {isOpenDatePicker && (
        <Modal
          isOpen={isOpenDatePicker}
          shouldCloseOnOverlayClick={true}
          onRequestClose={() => setIsOpenDatePicker(false)}
        >
          <ReactDatepicker
            onSelect={(e) => {
              if (
                inputDateName === "publish_start_at" ||
                inputDateName === "publish_end_at"
              ) {
                setValue(inputDateName, dayjs(e).format("YYYY-MM-DD"), {
                  shouldValidate: true,
                });
              }
              setIsOpenDatePicker(false);
            }}
            fromYear={1970}
            toYear={dayjs().add(10, "years").year()}
          />
        </Modal>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="記事削除"
        message={"この記事を削除しますか？"}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        messageColor="red"
        confirmText="削除"
      />

      <ConfirmModal
        isOpen={showSaveModal}
        title="保存確認"
        message={confirmationMessage}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowSaveModal(false)}
        confirmText="確認"
        // messageColor="blue"
      />
    </>
  );
};

export default ArticleEntry;
