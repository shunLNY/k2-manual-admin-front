"@use client"
import { useCallback, useContext, useEffect, useRef, useState } from "react"

import ListPageContext from "@/store/list-page-context"
import search from "../../commons/lists/list-filter-pc.module.scss"
import CategoryList from "./category-list"
import CategoryListContext from "@/store/categories-context"
import { Controller, useForm } from "react-hook-form"
import ListPageLayout from "@/components/commons/lists/list-page-layout"
import ButtonFilterClear from "@/components/commons/buttons/btn-filter-clear"
import { SelectInstance } from "react-select"
import dayjs from "dayjs"
import dynamic from "next/dynamic"
import { Category } from "@/utils/types"
import { useDebounce } from "@/utils/helpers"
import Modal from "@/components/modals/modal"
import { Checkbox } from "@/components/commons/inputs/checkbox"
import { IconXMark } from "@/components/icons/icons"
import ButtonSearch from "@/components/commons/buttons/btn-search"
import SearchCheckboxStatusPC from "@/components/commons/inputs/search-checkbox-status-pc"
import { Category_list_info } from "@/utils/constants"
import classNames from "classnames"
import FormControl from "@/components/commons/inputs/form-control"
import TextField from "@/components/commons/inputs/text-field"
import styles from "./category-list.module.scss"
import DateInput from "@/components/commons/inputs/date-input"
import ReactDatepicker from "@/components/commons/datepicker/react-datepicker"

const ListFilterPc = dynamic(
	() => import('../../commons/lists/list-filter-pc'),
	{
		ssr: false,
	}
);
interface FormData {
	categoryIds: string[]
}

interface InputData {
	category_id?: string;
	creator_name?: string;
	editor_name?: string;
	startDate?: string;
	endDate?: string;
}

const ListPage = () => {
	const pageCtx = useContext(ListPageContext)
	const listCtx = useContext(CategoryListContext)

	const {
		listCount,
		keyword,
		setKeyword,
		queryParams,
		setQueryParams,
		resetFilter,
		handleSearch,
		isPrivate,
		setIsPrivate,
		isPublished,
		setIsPublished,
		isFilterActive,
		setUrlPath,
		setCategoryCreate
	} = listCtx;

	const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
	const [inputDateName, setInputDateName] = useState<keyof InputData | "">("");

	const {
		register,
		setValue,
		clearErrors,
		reset,
		control,
		formState: { errors }
	} = useForm<InputData>({
		defaultValues: {
			category_id: "",
			creator_name: "",
			editor_name: "",
			startDate: "",
			endDate: "",
		}
	})

	const handleKeywordChange = useCallback((value: string) => {
		setKeyword(value.trimStart());
	}, []);

	useEffect(() => {
		if (window.location.hash.startsWith("#")) {
			return setCategoryCreate(true);
		}
	}, []);

	const onClose = useCallback(() => {
		pageCtx.setOpenFilterModal(false);
	}, []);

	const handleSearchAndClose = useCallback(() => {
		handleSearch();
		onClose();
	}, [handleSearch, onClose]);

	let PageSize: number = 10;
	const groupsRef = useRef<SelectInstance>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [showSubmissionStatusFilter, setShowSubmissionStatusFilter] = useState<boolean>(false);
	useEffect(() => {
		const hasCategoryCreate =
			typeof window !== "undefined" &&
			localStorage.getItem("CategoryCreate");

		// if (localStorage.getItem("constructionCreate") || pageCtx.listFilter) {
		if (hasCategoryCreate || pageCtx.listFilter) {
			setShowSubmissionStatusFilter(false);
		} else {
			setShowSubmissionStatusFilter(true);
		}
	}, [pageCtx.listFilter]);

	const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		let paramName = e.target.getAttribute("name") as string;
		paramName === "isPrivate" && setIsPrivate(!isPrivate);
		paramName === "isPublished" && setIsPublished(!isPublished);
		console.log(paramName)


		setQueryParams((prevState: any) => {
			if (e.target.checked) {
				return {
					...prevState,
					[paramName]: true,
				};
			}
			delete prevState[paramName];
			return { ...prevState };
		});
	};

	const handleInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = event.target;

			if (name) {
				setValue(name as keyof InputData, value);
				clearErrors(name as keyof InputData);

				setQueryParams((prevState: any) => {
					const newState = {
						...prevState,
						[name]: value.trim(),
					};
					return newState;
				});
			}
		},
		[setValue, clearErrors, setQueryParams]
	);

	useEffect(() => {
		listCtx.setCategoryInfo("")
	}, [listCtx])

	const clearFilterData = useCallback(() => {
		reset({
			category_id: "",
			creator_name: "",
			editor_name: "",
			startDate: "",
			endDate: "",
		});
		resetFilter();
		onClose();
	}, [reset, resetFilter, onClose]);

	const debounce = useDebounce(keyword, 500);
	useEffect(() => {
		handleSearch();
	}, [debounce, handleSearch]);

	return (
		<>
			<ListPageLayout
				keyword={keyword}
				onKeywordChange={handleKeywordChange}
				resetFilterButton={
					<ButtonFilterClear
						text="案件クリア"
						onClick={resetFilter}
						active={isFilterActive}
					/>
				}
				isActive={pageCtx.showSpFilter}
				count={listCount}
				isPagination={false}
				pagination={{
					currentPage: currentPage,
					totalCount: listCount,
					pageSize: PageSize,
					onPageChange: (page: number) => {
						setCurrentPage(page);
						listCtx.pagination(page);
					},
				}}
			// onSubmit={
			// pageCtx.listFilter === "invoice"
			// 	? handleInvoiceCreate
			// 	: handleConstructionCreate
			// }
			// isDisable={listCtx.items.length <= 0}
			// setQueryParams={setQueryParams}
			>
				
				<>
					<div className={styles.tabs_container}>
						{Category_list_info.map((category) => (
							<button
								key={category.id}
								className={classNames(styles.tab, {
									[styles.active]: listCtx.selectedTabId === category.id,
								})}
								onClick={() => listCtx.setSelectedTabId(category.id)}
							>
								{category.category_name}
							</button>
						))}
					</div>
					<CategoryList
						count={listCount}
						currentPage={currentPage}
						pageSize={PageSize}
					/>
					<Modal
						isOpen={pageCtx.openFilterModal}
						shouldCloseOnOverlayClick={true}
						onRequestClose={() => { pageCtx.setOpenFilterModal(false) }}
						contentClassName={search.modal_bg}
					>
						<div className={search.account_modal}>
							<ListFilterPc
								keyword={keyword}
								onKeywordChange={handleKeywordChange}
								onSearch={handleSearch}
							>
								<>
									<ul className={search.construction_flex}>
										{showSubmissionStatusFilter && (
											<div>
												<li className={classNames(search.list_search_box, styles.list_search_box)}>
													<div className={search.list_search_detail_label}>
														<div className={search.list_search_label}>
															<p>
																ステータス
															</p>
														</div>
													</div>
													<div className={search.list_search_detail}>
														<div className={search.list_search_flex}>
															<div className={search.list_search_check}  >
																<label className={"d-flex items-center"}  >
																	<Checkbox
																		name="isPrivate"
																		onChange={handleCheckbox}
																		checked={isPrivate}
																		className={search.checkbox_status}
																	/>
																	<SearchCheckboxStatusPC
																		label="未公開"
																		color="gray"
																	/>
																</label>
															</div>
															<div className={search.list_search_check}  >
																<label className={"d-flex items-center"}  >
																	<Checkbox
																		name="isPublished"
																		onChange={handleCheckbox}
																		checked={isPublished}
																		className={search.checkbox_status}
																	/>
																	<SearchCheckboxStatusPC
																		label="公開"
																		color="blue"
																	/>
																</label>
															</div>
														</div>
													</div>
												</li>
											</div>
										)}

										<div>
											<li className={classNames(search.list_search_box, styles.list_search)}>
												<p>公開期間</p>
												{/* <FormControl
													label=''
												> */}
												<div className={styles.publish_date_container}>
													<div className={styles.date_input}>
														<Controller
															name='startDate'
															control={control}
															render={({ field }) => (
																<DateInput
																	{...field}
																	onClick={() => {
																		setIsOpenDatePicker(true);
																		setInputDateName('startDate');
																	}}
																	onClear={() => {
																		setValue('startDate', "");
																		setQueryParams((prevState: any) => {
																			delete prevState.startDate;
																			return { ...prevState };
																		});
																	}}
																	value={
																		queryParams.startDate
																			? dayjs(new Date(queryParams.startDate)).format('YYYY/MM/DD')
																			: ''
																	}
																	placeholder={'2025/01/01'}
																	
																/>
															)}
														/>
														<div>~</div>
														<Controller
															name='endDate'
															control={control}
															render={({ field }) => (
																<DateInput
																	{...field}
																	onClick={() => {
																		setIsOpenDatePicker(true);
																		setInputDateName('endDate');
																	}}
																	onClear={() => {
																		setValue('endDate', "");
																		setQueryParams((prevState: any) => {
																			delete prevState.endDate;
																			return { ...prevState };
																		});
																	}}
																	value={
																		queryParams.endDate
																			? dayjs(new Date(queryParams.endDate)).format('YYYY/MM/DD')
																			: ''
																	}
																	placeholder={'2025/01/01'}
																/>
															)}
														/>
													</div>
												</div>
												{/* </FormControl> */}
											</li>

										</div>

										<div>
											<li className={classNames(search.list_search_box, styles.list_search)}>
												<FormControl
													label="作成者名"
													layout="row"
													classNames={search.custom_label}
												>
													<TextField
														name="creator_name"
														register={register}
														placeholder="作成者名を検査"
														onChange={handleInputChange}
													/>
												</FormControl>
											</li>
										</div>

										<div>
											<li className={classNames(search.list_search_box, styles.list_search)}>
												<FormControl
													label="編集者名"
													layout="row"
													classNames={search.custom_label}
												>
													<TextField
														name="editor_name"
														register={register}
														placeholder="編集者名を検査"
														onChange={handleInputChange}
													/>
												</FormControl>
											</li>
										</div>
									</ul>
									<div className="d-flex">
										<div className={search.btn_flex}>
											<ButtonFilterClear
												text="条件クリア"
												onClick={clearFilterData}
												active={true}
											/>
											<ButtonSearch
												text="検索"
												className={search.submitBtn + " ml-10"}
												onClick={handleSearchAndClose}
											></ButtonSearch>
										</div>
										<button
											type="button"
											onClick={onClose}
											className={search.close_btn}
										>
											<IconXMark />
											閉じる
										</button>
									</div>
								</>
							</ListFilterPc>
						</div>
					</Modal>
					{isOpenDatePicker && (
						<Modal isOpen={isOpenDatePicker} shouldCloseOnOverlayClick={true} onRequestClose={() => setIsOpenDatePicker(false)}>
							<ReactDatepicker
								onSelect={(e) => {
									if (inputDateName === "startDate" || inputDateName === "endDate") {
										const formattedDate = dayjs(e).format("YYYY-MM-DD");
										setValue(inputDateName, formattedDate, {
											shouldValidate: true,
										});
										setQueryParams((prevState: any) => ({
											...prevState,
											[inputDateName]: formattedDate,
										}));
									}
									setIsOpenDatePicker(false);
								}}
								fromYear={1970}
								toYear={dayjs().add(10, "years").year()}
							/>
						</Modal>
					)}
				</>
			</ListPageLayout >

		</>
	)
}
export default ListPage