/** @format */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import styles from "./category-select-modal.module.scss";
import { Category } from "@/utils/types";
import ButtonCancel from "@/components/commons/buttons/btn-cancel";
import ButtonSave from "@/components/commons/buttons/btn-save";
import { SearchIcon } from "@/components/icons/icons";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (categoryId: string, categoryName: string) => void;
	categories: Category[];
	currentCategoryId?: string;
};

type BreadcrumbItem = {
	name: string;
	level: 1 | 2 | 3 | 4;
	id: string;
};

const CategorySelectModal = ({
	isOpen,
	onClose,
	onSelect,
	categories,
	currentCategoryId,
}: Props) => {
	const [level1Id, setLevel1Id] = useState<string | null>(null);
	const [level2Id, setLevel2Id] = useState<string | null>(null);
	const [level3Id, setLevel3Id] = useState<string | null>(null);
	const [level4Id, setLevel4Id] = useState<string | null>(null);
	const [searchText, setSearchText] = useState("");

	// Reset & pre-select when modal opens
	useEffect(() => {
		if (!isOpen) return;
		setSearchText("");

		if (!currentCategoryId) {
			setLevel1Id(categories[0]?.id || null);
			setLevel2Id(null);
			setLevel3Id(null);
			setLevel4Id(null);
			return;
		}

		let found = false;
		outer: for (const l1 of categories) {
			if (l1.id === currentCategoryId) {
				setLevel1Id(l1.id);
				setLevel2Id(null);
				setLevel3Id(null);
				setLevel4Id(null);
				found = true;
				break;
			}
			for (const l2 of l1.child_categories || []) {
				if (l2.id === currentCategoryId) {
					setLevel1Id(l1.id);
					setLevel2Id(l2.id);
					setLevel3Id(null);
					setLevel4Id(null);
					found = true;
					break outer;
				}
				for (const l3 of l2.child_categories || []) {
					if (l3.id === currentCategoryId) {
						setLevel1Id(l1.id);
						setLevel2Id(l2.id);
						setLevel3Id(l3.id);
						setLevel4Id(null);
						found = true;
						break outer;
					}
					for (const l4 of l3.child_categories || []) {
						if (l4.id === currentCategoryId) {
							setLevel1Id(l1.id);
							setLevel2Id(l2.id);
							setLevel3Id(l3.id);
							setLevel4Id(l4.id);
							found = true;
							break outer;
						}
					}
				}
			}
		}

		if (!found) {
			setLevel1Id(categories[0]?.id || null);
			setLevel2Id(null);
			setLevel3Id(null);
			setLevel4Id(null);
		}
	}, [isOpen, currentCategoryId, categories]);

	function containsSearch(cat: any, text: string): boolean {
		if (cat.category_name.toLowerCase().includes(text)) return true;
		for (const child of cat.child_categories || []) {
			if (containsSearch(child, text)) return true;
		}
		return false;
	}

	// Normalized search text
	const searchLower = searchText.trim().toLowerCase();

	// ── Column 1 Items ──
	const level1Items = useMemo(() => {
		if (!searchLower) return categories;
		return categories.filter((cat) => containsSearch(cat, searchLower));
	}, [categories, searchLower]);

	const level1Selected = level1Items.find((c) => c.id === level1Id);

	// ── Column 2 Items (Filtered by search) ──
	const level2Items = useMemo(() => {
		const items: any[] = level1Selected?.child_categories || [];
		if (!searchLower) return items;
		return items.filter((cat) => containsSearch(cat, searchLower));
	}, [level1Selected, searchLower]);

	const level2Selected = level2Items.find((c: any) => c.id === level2Id);

	// ── Column 3 Items (Filtered by search) ──
	const level3Items = useMemo(() => {
		const items: any[] = level2Selected?.child_categories || [];
		if (!searchLower) return items;
		return items.filter((cat) => containsSearch(cat, searchLower));
	}, [level2Selected, searchLower]);

	const level3Selected = level3Items.find((c: any) => c.id === level3Id);

	// ── Column 4 Items (Filtered by search) ──
	const level4Items = useMemo(() => {
		const items: any[] = level3Selected?.child_categories || [];
		if (!searchLower) return items;
		return items.filter((cat) => containsSearch(cat, searchLower));
	}, [level3Selected, searchLower]);

	const selectedId = level4Id || level3Id || level2Id || level1Id;

	// Breadcrumb
	const breadcrumb: BreadcrumbItem[] = [];
	if (level1Selected) {
		breadcrumb.push({
			name: level1Selected.category_name,
			level: 1,
			id: level1Selected.id,
		});
	}
	if (level2Selected) {
		breadcrumb.push({
			name: level2Selected.category_name,
			level: 2,
			id: level2Selected.id,
		});
	}
	if (level3Selected) {
		breadcrumb.push({
			name: level3Selected.category_name,
			level: 3,
			id: level3Selected.id,
		});
	}
	if (level4Id) {
		const l4 = level4Items.find((c: any) => c.id === level4Id);
		if (l4)
			breadcrumb.push({ name: l4.category_name, level: 4, id: l4.id });
	}

	const handleBreadcrumbClick = (item: BreadcrumbItem) => {
		if (item.level === 1) {
			setLevel1Id(item.id);
			setLevel2Id(null);
			setLevel3Id(null);
			setLevel4Id(null);
		} else if (item.level === 2) {
			setLevel2Id(item.id);
			setLevel3Id(null);
			setLevel4Id(null);
		} else if (item.level === 3) {
			setLevel3Id(item.id);
			setLevel4Id(null);
		}
	};

	const handleSelect = () => {
		if (!selectedId) return;
		let name = "";
		if (level4Id) {
			name =
				level4Items.find((c: any) => c.id === level4Id)
					?.category_name || "";
		} else if (level3Id && level3Selected) {
			name = level3Selected.category_name;
		} else if (level2Id && level2Selected) {
			name = level2Selected.category_name;
		} else if (level1Selected) {
			name = level1Selected.category_name;
		}
		onSelect(selectedId, name);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className={styles.modal_overlay} onClick={onClose}>
			<div
				className={styles.modal_box}
				onClick={(e) => e.stopPropagation()}
			>
				{/* ── Header ── */}
				<div className={styles.modal_header}>
					<h2>カテゴリー一覧</h2>
					<div className={styles.header_search}>
						<SearchIcon />
						<input
							type="text"
							placeholder="キーワード検索"
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
					</div>
				</div>

				{/* ── Breadcrumb ── */}
				<div className={styles.breadcrumb}>
					<span className={styles.label}>選択されたカテゴリ：</span>
					{breadcrumb.map((crumb, i) => {
						const isLast = i === breadcrumb.length - 1;
						return (
							<React.Fragment key={crumb.id}>
								{i > 0 && (
									<span className={styles.sep}> &gt; </span>
								)}
								{isLast ? (
									<span className={styles.crumb_current}>
										{crumb.name}
									</span>
								) : (
									<button
										type="button"
										className={styles.crumb_link}
										onClick={() =>
											handleBreadcrumbClick(crumb)
										}
									>
										{crumb.name}
									</button>
								)}
							</React.Fragment>
						);
					})}
				</div>

				{/* ── Columns ── */}
				<div className={styles.columns_wrapper}>
					<div className={styles.columns_container}>
						{/* ── Column 1: tab pills (all breakpoints) ── */}
						<div className={styles.column_tabs}>
							{level1Items.length === 0 && (
								<span
									style={{
										fontSize: 12,
										color: "#9ca3af",
										padding: "8px 4px",
										whiteSpace: "nowrap",
									}}
								>
									なし
								</span>
							)}
							{level1Items.map((cat) => (
								<div
									key={cat.id}
									title={cat.category_name}
									className={`${styles.tab_item} ${level1Id === cat.id ? styles.selected : ""}`}
									onClick={() => {
										setLevel1Id(cat.id);
										setLevel2Id(null);
										setLevel3Id(null);
										setLevel4Id(null);
									}}
								>
									{cat.category_name}
								</div>
							))}
						</div>

						{/* ── Columns 2–4: right pane (tablet: horizontal scroll) ── */}
						<div className={styles.columns_right}>
							{/* Column 2 */}
							<div className={styles.column}>
								{/* <div className={styles.col_label}>レベル 2</div> */}
								{level2Items.map((cat: any) => (
									<div
										key={cat.id}
										title={cat.category_name}
										className={`${styles.column_item} ${level2Id === cat.id ? styles.selected : ""}`}
										onClick={() => {
											setLevel2Id(cat.id);
											setLevel3Id(null);
											setLevel4Id(null);
										}}
									>
										<span className={styles.item_text}>
											{cat.category_name}
										</span>
										{(cat.child_categories?.length || 0) >
											0 && (
											<span className={styles.arrow_icon}>
												›
											</span>
										)}
									</div>
								))}
							</div>

							{/* Column 3 */}
							<div className={styles.column}>
								{/* <div className={styles.col_label}>レベル 3</div> */}
								{level3Items.map((cat: any) => (
									<div
										key={cat.id}
										title={cat.category_name}
										className={`${styles.column_item} ${level3Id === cat.id ? styles.selected : ""}`}
										onClick={() => {
											setLevel3Id(cat.id);
											setLevel4Id(null);
										}}
									>
										<span className={styles.item_text}>
											{cat.category_name}
										</span>
										{(cat.child_categories?.length || 0) >
											0 && (
											<span className={styles.arrow_icon}>
												›
											</span>
										)}
									</div>
								))}
							</div>

							{/* Column 4 */}
							<div className={styles.column}>
								{/* <div className={styles.col_label}>レベル 4</div> */}
								{level4Items.map((cat: any) => (
									<div
										key={cat.id}
										title={cat.category_name}
										className={`${styles.column_item} ${level4Id === cat.id ? styles.selected : ""}`}
										onClick={() => setLevel4Id(cat.id)}
									>
										<span className={styles.item_text}>
											{cat.category_name}
										</span>
									</div>
								))}
							</div>
						</div>
						{/* end columns_right */}
					</div>
				</div>

				{/* ── Footer ── */}
				<div className={styles.modal_footer}>
					<ButtonCancel
						className={styles.btn_back}
						onClick={onClose}
						text="戻る"
						type="button"
					></ButtonCancel>
					<ButtonSave
						type="submit"
						text="選択する"
						onClick={handleSelect}
						className={styles.btn_select}
						disabled={!selectedId}
					></ButtonSave>
				</div>
			</div>
		</div>
	);
};

export default CategorySelectModal;
