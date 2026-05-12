/** @format */
'use client';


import styles from './articles.entry.module.scss';
import { useState, useContext, useEffect, useMemo } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import classNames from 'classnames';
import React from 'react';
import { useListPage } from '@/store/list-page-context';


import formStyles from '../../commons/inputs/form-element.module.scss';

import { IconClose, IconDelete } from '@/components/icons/icons';
import { useParams } from 'next/navigation';
import { fetcher } from '@/utils/fetcher';
import {
  API_URL,
  ArticleStatus,
  createSuccessfulMessage,
  failMessage,
  updateSuccessfulMessage,
} from '@/utils/constants';
import FormControl from '@/components/commons/inputs/form-control';
import { useBlog } from '@/store/articles-context';
import ButtonSave from '@/components/commons/buttons/btn-save';
import ButtonCancel from '@/components/commons/buttons/btn-cancel';
import FormFooter from '@/components/commons/inputs/form-footer';
import TextField from '@/components/commons/inputs/text-field';
import DateInput from '@/components/commons/inputs/date-input';
import dayjs from 'dayjs';
import FullLexicalEditor from '@/components/commons/text-editor/LexicalEditor';
import LexicalEditor from '@/components/commons/text-editor/LexicalEditor';
import LexicalTextEditor from '@/components/commons/text-editor/LexicalEditor';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Modal from '@/components/modals/modal';
import ReactDatepicker from '@/components/commons/datepicker/react-datepicker';
import { ArticlesInfoType } from '@/utils/types';
// import { Option } from '@/components/commons/inputs/multi-select-box';

import { useCategoryList } from '@/store/categories-context';
import ConfirmModal from './confirm-model';
import MultiSelect from '@/components/commons/inputs/multi-select-box';
import dynamic from 'next/dynamic';
import inputStyles from '../../commons/inputs/form-element.module.scss'
import Image from 'next/image';
import { resizeMainImage } from '@/utils/helpers';
import { useAuth } from '@/store/auth-context';



// Dynamically import the editor with SSR disabled
const SummernoteEditor = dynamic(() => import('../../commons/text-editor/summernote-editor'), {
  ssr: false,
});


const ArticleEntry = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = router.pathname;
  const showInfo = pathname !== "/articles/new"
  const _id: string = params?.id as string;

  const listCtx = useBlog();
  const categoryListCtx = useCategoryList();
  const pageCtx = useListPage();
  const { blogInfo, refreshBlogRows, getBlogInfo } = listCtx;
  const { items } = categoryListCtx;
  const AuthCtx = useAuth();

  const categoryOptions: any[] =
    items?.map((cat) => ({
      value: cat.id,
      label: cat.category_name,
    })) || []

  console.log(blogInfo)

  const [isLoading, setIsLoading] = useState(false)
  const [isBtnDisable, setIsBtnDisable] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<"published" | "private" | "draft">("draft")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [formDataToSubmit, setFormDataToSubmit] = useState<ArticlesInfoType | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [content, setContent] = useState('');



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
  } = useForm(
    {
      defaultValues: {
        title: "",
        status: "draft",
        publish_start_at: "",
        publish_end_at: "",
        content: "",
        thumbnail_path: "",
        blog_categories: [],
        categoryIds: []
      }
    }
  );

  useEffect(() => {
    async function fetchData() {
      if (_id) {
        setIsLoading(true)
        try {
          await getBlogInfo(_id)
          pageCtx.setEntryMode("edit")
        } catch (error) {
          console.error("Error fetching blog:", error)
          toast.error("ブログの取得に失敗しました")
        } finally {
          setIsLoading(false)
        }
      } else {
        pageCtx.setEntryMode("new")
        reset()
        setSelectedStatus("draft")
      }
    }
    fetchData()
  }, [_id])

  let mappedCategories: [];
  // useEffect(() => {
  //   if (blogInfo && _id) {

  //     setImage(blogInfo.thumbnail_path);
  //     mappedCategories =
  //       blogInfo.blog_categories?.map((cat: any) => ({
  //         value: cat.category?.id,
  //         label: cat.category?.category_name,
  //       })) || [];

  //     setSelectedCategories(mappedCategories)
  //     console.log(mappedCategories);

  //     if (blogInfo.content) {

  //       setContent(blogInfo.content)
  //     }

  //     reset({
  //       title: blogInfo.title ?? "",
  //       status: blogInfo.status ?? "draft",
  //       publish_start_at: blogInfo.publish_start_at ?? null,
  //       publish_end_at: blogInfo.publish_end_at ?? null,
  //       content: blogInfo.content ?? "",
  //       thumbnail_path: blogInfo.thumbnail_path ?? "",
  //       blog_categories: mappedCategories,
  //     });


  //     setSelectedStatus(blogInfo.status as "published" | "private" | "draft");

  //   } else if (!_id) {
  //     setSelectedCategories([]);
  //     reset();
  //     setSelectedStatus("draft");
  //   }
  // }, [blogInfo, _id, reset]);

  console.log(selectedCategories, ".....")

  const statusOptions = [
    { label: '下書き', value: 'draft', style: styles.draft },
    { label: '公開', value: 'published', style: styles.public },
    { label: '非公開', value: 'private', style: styles.private },
  ];

  const handleStatusClick = (value: string, label: string) => {
    setSelectedStatus(value as "published" | "private" | "draft")
    setValue("status", value)
  }

  const handleSaveClick = (data: any) => {
    setFormDataToSubmit(data);
    let message = "この内容でブログを保存しますか？";
    const startDate = data.publish_start_at;
    const endDate = data.publish_end_at;
    const formattedStartDate = startDate ? dayjs(startDate).format('YYYY/MM/DD') : null;
    const formattedEndDate = endDate ? dayjs(endDate).format('YYYY/MM/DD') : null;
    console.log(formattedEndDate)

    //For Content
    data.content = content;


    if (formattedStartDate && formattedEndDate) {
      message = `公開期間は ${dayjs(formattedStartDate).format('YYYY/MM/DD')} から ${dayjs(formattedEndDate).format('YYYY/MM/DD')} までです。\nブログを保存しますか？`;
    } else if (formattedStartDate) {
      message = `公開期間は ${dayjs(formattedStartDate).format('YYYY/MM/DD')} からです。\nブログを保存しますか？`;
    } else if (formattedEndDate) {
      message = `公開期間は今日から ${dayjs(formattedEndDate).format('YYYY/MM/DD')} までです。\nブログを保存しますか？`;
    }

    setConfirmationMessage(message);
    setShowSaveModal(true);
  };

  // Content Change
  const handleBodyChange = (content: any) => {
    // console.log(content, ".................on Submit Data Content")
    setContent(content);
    setValue('content', content);
  };

  const handleConfirmSubmit = () => {
    if (!formDataToSubmit) return;
    setShowSaveModal(false);
    setIsBtnDisable(true);
    const categoryIds = formDataToSubmit.blog_categories?.map((cat: any) => cat.value) || [];

    // let transformedData = {
    //   ...formDataToSubmit,
    //   categoryIds,
    // };
    let transformedData = {
      title: formDataToSubmit.title,
      status: formDataToSubmit.status,
      content: formDataToSubmit.content,
      thumbnail_path: formDataToSubmit.thumbnail_path,
      publish_start_at: formDataToSubmit.publish_start_at,
      publish_end_at: formDataToSubmit.publish_end_at,
      categoryIds: categoryIds,
      id: blogInfo?.id,
    }

    const hasStartDate = !!transformedData.publish_start_at;
    const hasEndDate = !!transformedData.publish_end_at;

    if (!hasStartDate && !hasEndDate) {
      // Both empty: publish_start_at = today, publish_end_at = ""
      transformedData.publish_start_at = dayjs().format('YYYY-MM-DD');
      transformedData.publish_end_at = null;
    } else if (hasStartDate && !hasEndDate) {
      // Only start date: Use the input value and leave end date empty
      transformedData.publish_start_at = transformedData.publish_start_at;
      transformedData.publish_end_at = null;
    } else if (!hasStartDate && hasEndDate) {
      // Only end date: publish_start_at = today, publish_end_at = input
      transformedData.publish_start_at = dayjs().format('YYYY-MM-DD');
      transformedData.publish_end_at = transformedData.publish_end_at;
    } else {
      // Both filled: Use the provided values
      transformedData.publish_start_at = transformedData.publish_start_at;
      transformedData.publish_end_at = transformedData.publish_end_at;
    }

    console.log("Transformed Data:", transformedData);
    setIsBtnDisable(true);

    let fetchConfig = {};
    let url = null;
    let submitMsg = "";

    if (pageCtx.entryMode === "new") {
      url = "/api/proxy/admin/blogs/";
      fetchConfig = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(transformedData),
      };
      submitMsg = createSuccessfulMessage;
    } else {
      const updatedData = {
        ...transformedData,
        id: blogInfo.id,
      };
      fetchConfig = {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(updatedData),
      };
      url = new URL(window.location.origin + "/api/proxy/admin/blogs/" + blogInfo.id);
      submitMsg = updateSuccessfulMessage;
    }

    fetcher(url, { ...fetchConfig })
      .then((res) => {
        toast.success(submitMsg);
        setIsBtnDisable(false);
        refreshBlogRows();
        if (pageCtx.entryMode === "new") {
          router.push("/blogs");
        } else {
          listCtx.setBlogInfo(res.data);
          router.push("/blogs");
        }
      })
      .catch((error) => {
        toast.error(failMessage);
        console.error("An error occurred:", error);
        setIsBtnDisable(false);
      });
  };


  const handleDelete = async () => {
    if (!blogInfo?.id) return
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    setShowDeleteModal(false)
    setIsBtnDisable(true)
    try {
      await fetcher(`/api/proxy/admin/blogs/${blogInfo.id}`, { method: "DELETE" })
      toast.success("ブログを削除しました")
      router.push("/blogs")
      refreshBlogRows()
    } catch (err) {
      console.error(err)
      toast.error(failMessage)
      setIsBtnDisable(false)
    }
  }
  const cancelDelete = () => {
    setShowDeleteModal(false)
  }

  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [inputDateName, setInputDateName] = useState("");

  const [image, setImage] = useState(null);
  const handleFileChange = (event: any) => {
    const id = toast.loading('Please wait...');
    const file = event.target.files[0];
    if (file) {
      resizeMainImage(file, false, 2560)
        .then(({ image }: any) => {
          const formData = new FormData();

          formData.append('thumbnail_path', image);
          fetcher('/api/proxy/files/_tmp/image/upload', {
            method: 'POST',
            body: formData,
          })
            .then((res) => {

              if (res.path) {
                setImage(res.path);

                setValue('thumbnail_path', res.path);
                toast.update(id, {
                  render: 'Image Uploaded for slider Successfully',
                  type: 'success',
                  isLoading: false,
                  autoClose: 1500,
                });
              }
            })
            .catch((err) => {
              toast.update(id, {
                render: err?.info?.message || 'Image Upload Failed',
                type: 'error',
                isLoading: false,
                autoClose: 1500,
              });
              console.log(err);
            });
        })
        .catch((error) => {
          console.error('Error resizing image:', error);
        })
        .finally(() => {
          event.target.value = null; // Clear the input value
        });
    }
  };

  const customToolbar = useMemo(() => [
    ['font', ['bold', 'italic', 'underline', 'clear']],
    ['color', ['color']],
    ['para', ['ul', 'ol']],
    ['insert', ['link', 'picture', 'video']],
    ['view', ['fullscreen', 'codeview']],
  ], []);

  return (
    <>
      <form
        className={styles.main_container}
        onSubmit={handleSubmit(handleSaveClick)}
      >
        <div className={styles.main_container}>
          <div className={styles.row_one}>
            <FormControl label='タイトル' required>
              <TextField
                register={register}
                name='title'
                placeholder='行（グループ）機能をリリースしました。'
                // onKeyDown={handleKeyDown}
                validation={{
                  maxLength: {
                    value: 50,
                    message: '50文字まで入力できます。',
                  },
                }}
                maxLength={50}
              />
            </FormControl>
            <FormControl label='本文' required>
              {/* <textarea
                className={styles.textareaInput}
                // {...register('note', {
                //   maxLength: {
                //     value: 500,
                //     message: '500文字まで入力できます。',
                //   },
                // })}
                rows={40}></textarea> */}
              {/* <LexicalTextEditor /> */}
              <SummernoteEditor value={content} onChange={handleBodyChange} toolbar={customToolbar} />

              {/* <Editor /> */}
            </FormControl>
          </div>
          <div className={styles.row_two}>
            <FormControl label='公開設定' required>
              <div className={styles.status_container}>
                {statusOptions.map(({ label, value, style }) => (
                  <div
                    key={value}
                    role='button'
                    className={classNames(selectedStatus === value ? style : "")}
                    onClick={() => {
                      handleStatusClick(value, label)
                    }}>
                    {label}
                  </div>
                ))}
              </div>
            </FormControl>
            <FormControl
              label='公開期間'
              // helperText='公開期間を選択してください。'
              any>
              <div className={styles.publish_date_container}>
                <div className={styles.date_input}>
                  <Controller
                    name='publish_start_at'
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
                            setInputDateName('publish_start_at');
                          }}
                          onClear={() => setValue('publish_start_at', "")}
                          value={
                            field.value
                              ? dayjs(new Date(field.value)).format(
                                'YYYY/MM/DD'
                              )
                              : ''
                          }
                          placeholder={'2025/01/01'}
                        />
                      </>
                    )}
                  />

                </div>
                <div>~</div>
                <div className={styles.date_input}>
                  <Controller
                    name='publish_end_at'
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
                            setInputDateName('publish_end_at');
                          }}
                          onClear={() => setValue('publish_end_at', "")}
                          value={
                            field.value
                              ? dayjs(new Date(field.value)).format(
                                'YYYY/MM/DD'
                              )
                              : ''
                          }
                          placeholder={'2025/01/01'}
                        />
                      </>
                    )}
                  />

                </div>
              </div>
            </FormControl>
            
            <FormControl label='サムネイル' any >
              <div className={styles.img_upload_container}>
                {watch('thumbnail_path') ? (
                  <div className={styles.thumbnail_container}>
                    <button
                      type="button"
                      className={styles.close_ic}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        setValue('thumbnail_path', '');

                      }}
                    >
                      <IconClose />
                    </button>
                    <Image
                      className={styles.img_relative}
                      src={API_URL + '/files' + image}
                      alt="Preview"
                      fill
                      sizes={'400px'}
                      style={{ objectFit: 'cover' }}
                      quality={90}
                      priority={false}
                    />
                  </div>
                ) : (
                  <>
                    <div className={styles.thumbnail_upload}><p className={styles.thumbnail_btn}>PHOTOS UPLOAD</p></div>
                    <input
                      hidden
                      className={inputStyles.customInput}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        e.stopPropagation()
                        handleFileChange(e)
                      }}
                      placeholder="image"
                      id="fileInput"
                    />
                  </>
                )}

              </div>
            </FormControl>

            <FormControl label='概要' required>
              <TextField
                register={register}
                name='description'
                placeholder='行（グループ）機能をリリースしました。'
                // onKeyDown={handleKeyDown}
                validation={{
                  maxLength: {
                    value: 500,
                    message: '500文字まで入力できます。',
                  },
                }}
                maxLength={500}
              />
            </FormControl>
            
            <FormControl label="カテゴリー設定" required>
              <Controller
                control={control}
                name="blog_categories"
                rules={{ required: "カテゴリーを選択してください" }}
                render={({ field, fieldState }) => (
                  <>
                    <MultiSelect
                      options={categoryOptions}
                      value={selectedCategories}
                      onChange={(selectedOptions: any) => {
                        setSelectedCategories(selectedOptions);
                        field.onChange(selectedOptions)
                      }}
                      placeholder="カテゴリーを選択してください"
                      isClearable={true}
                    // closeMenuOnSelect={false}
                    />
                    {fieldState.error && (
                      <div style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>{fieldState.error.message}</div>
                    )}
                  </>
                )}
              />
            </FormControl>
          </div>
        </div>
        <FormFooter>
          <ButtonCancel
            onClick={() => router.back()}
            text='戻る'
            type='button'></ButtonCancel>
          {/* <ButtonSave text='プレビュー' type='button'></ButtonSave> */}
          <ButtonSave
            type='submit'
            text='保存'
            className={styles.submitBtn}
            disabled={isBtnDisable}></ButtonSave>

          {showInfo && AuthCtx.user.role === 'admin' && (
            <span className={styles.iconDelete} onClick={handleDelete} role='button' style={{ cursor: "pointer" }}>
              <IconDelete />
            </span>
          )}
        </FormFooter>
      </form>

      {isOpenDatePicker && (
        <Modal isOpen={isOpenDatePicker} shouldCloseOnOverlayClick={true} onRequestClose={() => setIsOpenDatePicker(false)}>
          <ReactDatepicker
            onSelect={(e) => {
              if (inputDateName === "publish_start_at" || inputDateName === "publish_end_at") {
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
        title="ブログ削除"
        message={"このブログを削除しますか？"}
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
        messageColor="blue"
      />
    </>
  );
};

export default ArticleEntry;

