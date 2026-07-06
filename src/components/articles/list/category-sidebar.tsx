"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useBlog } from "@/store/articles-context";
import { useCategoryList } from "@/store/categories-context";
import { Category } from "@/utils/types";
import styles from "./category-sidebar.module.scss";
import {
	CaretIcon,
	FolderIconOpen,
	FolderIconClose,
	SearchIcon,
} from "@/components/icons/icons";

type Props = {
	isCollapsed: boolean;
	setIsCollapsed: (value: boolean) => void;
};

export default function CategorySidebar({
	isCollapsed,
	setIsCollapsed,
}: Props) {
	const articleCtx = useBlog();
	const categoryListCtx = useCategoryList();
	const { items: categories } = categoryListCtx;

	const [searchQuery, setSearchQuery] = useState("");
	// const [isCollapsed, setIsCollapsed] = useState(false);
	const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

	// Read selected category from article context
	const selectedCategoryId = useMemo(() => {
		return articleCtx.queryParams?.category_ids?.[0] as string | undefined;
	}, [articleCtx.queryParams]);

	// Handle category selection
	const handleSelectCategory = (categoryId: string) => {
		articleCtx.setQueryParams((prev) => {
			// If clicking the currently selected category, we can unselect it to clear filter
			if (prev.category_ids?.[0] === categoryId) {
				const next = { ...prev };
				delete next.category_ids;
				return next;
			}
			return {
				...prev,
				category_ids: [categoryId],
			};
		});
	};

	// Toggle expansion of a node
	const toggleExpand = (id: string, e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent category selection when clicking toggle
		setExpandedIds((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	// Helper to determine if a category matches the search query (or has a child that does)
	const filterTree = (
		cats: Category[],
		query: string,
	): { matchedCats: Category[]; autoExpandIds: string[] } => {
		if (!query) return { matchedCats: cats, autoExpandIds: [] };

		const lowerQuery = query.toLowerCase();
		const autoExpandIds: string[] = [];

		const process = (list: Category[]): Category[] => {
			const result: Category[] = [];

			for (const cat of list) {
				const matchesSelf = cat.category_name
					.toLowerCase()
					.includes(lowerQuery);
				let matchedChildren: Category[] = [];

				if (cat.child_categories && cat.child_categories.length > 0) {
					matchedChildren = process(cat.child_categories);
				}

				if (matchesSelf || matchedChildren.length > 0) {
					result.push({
						...cat,
						child_categories: matchedChildren,
					});

					if (matchedChildren.length > 0) {
						autoExpandIds.push(cat.id);
					}
				}
			}

			return result;
		};

		return {
			matchedCats: process(cats),
			autoExpandIds,
		};
	};

	// Filter categories and auto-expand nodes that have matches
	const { filteredCategories, autoExpandSet } = useMemo(() => {
		const { matchedCats, autoExpandIds } = filterTree(
			categories,
			searchQuery,
		);
		return {
			filteredCategories: matchedCats,
			autoExpandSet: new Set(autoExpandIds),
		};
	}, [categories, searchQuery]);

	// Apply auto-expansion when searching
	useEffect(() => {
		if (searchQuery) {
			setExpandedIds((prev) => {
				const next = { ...prev };
				autoExpandSet.forEach((id) => {
					next[id] = true;
				});
				return next;
			});
		}
	}, [searchQuery, autoExpandSet]);

	// Recursively render the category tree
	const renderTree = (list: Category[], level = 1) => {
		if (level === 1) {
			// Level 1: accordion card style
			return (
				<ul className={styles.tree_list}>
					{list.map((cat) => {
						const hasChildren =
							cat.child_categories &&
							cat.child_categories.length > 0;
						const isNodeExpanded = !!expandedIds[cat.id];
						const isActive = selectedCategoryId === cat.id;

						return (
							<li
								key={cat.id}
								className={`${styles.tree_node} ${styles.level1_node}`}
							>
								{/* Accordion header */}
								<div
									className={`${styles.level1_header} ${isNodeExpanded ? styles.level1_expanded : ""} ${isActive ? styles.active : ""}`}
									onClick={(e) => {
										handleSelectCategory(cat.id);
										if (hasChildren)
											toggleExpand(cat.id, e);
									}}
								>
									<span className={styles.icon_folder}>
										{isNodeExpanded ? (
											<FolderIconOpen />
										) : (
											<FolderIconClose />
										)}
									</span>
									<span
										className={styles.node_label}
										title={cat.category_name}
									>
										{cat.category_name}
									</span>
									{hasChildren && (
										<span
											onClick={(e) =>
												toggleExpand(cat.id, e)
											}
											className={`${styles.icon_caret} ${isNodeExpanded ? styles.expanded : ""}`}
										>
											<CaretIcon
												expanded={isNodeExpanded}
											/>
										</span>
									)}
								</div>
								{/* Accordion body */}
								{hasChildren && isNodeExpanded && (
									<div className={styles.level1_body}>
										{renderTree(cat.child_categories, 2)}
									</div>
								)}
							</li>
						);
					})}
				</ul>
			);
		}

		// Level 2+: inner items
		return (
			<ul className={styles.tree_list}>
				{list.map((cat) => {
					const hasChildren =
						cat.child_categories && cat.child_categories.length > 0;
					const isNodeExpanded = !!expandedIds[cat.id];
					const isActive = selectedCategoryId === cat.id;

					return (
						<li key={cat.id} className={styles.tree_node}>
							<div
								className={`${styles.node_row} ${isActive ? styles.active : ""}`}
								style={{
									paddingLeft: `${(level - 2) * 12 + 12}px`,
								}}
								onClick={() => handleSelectCategory(cat.id)}
							>
								{hasChildren ? (
									<span
										onClick={(e) => toggleExpand(cat.id, e)}
										className={`${styles.icon_caret} ${isNodeExpanded ? styles.expanded : ""}`}
									>
										<CaretIcon expanded={isNodeExpanded} />
									</span>
								) : (
									<span className={styles.icon_prefix}>
										•
									</span>
								)}
								<span
									className={styles.node_label}
									title={cat.category_name}
								>
									{cat.category_name}
								</span>
							</div>
							{hasChildren && isNodeExpanded && (
								<div>
									{renderTree(
										cat.child_categories,
										level + 1,
									)}
								</div>
							)}
						</li>
					);
				})}
			</ul>
		);
	};

	return (
		<div
			className={`${styles.sidebar_container} ${
				isCollapsed ? styles.collapsed : styles.expanded
			}`}
		>
			{!isCollapsed && (
				<div className={styles.sidebar_content}>
					<div className={styles.header}>
						<h3>カテゴリー一覧</h3>
						{/* <span className={styles.action_btn} title="カテゴリー管理へ">
              •••
            </span> */}
					</div>

					<div className={styles.search_wrapper}>
						<span className={styles.search_icon}>
							<SearchIcon />
						</span>

						<input
							type="text"
							className={styles.search_input}
							placeholder="カテゴリ検索"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className={styles.tree_container}>
						{filteredCategories.length > 0 ? (
							renderTree(filteredCategories)
						) : (
							<div
								style={{
									padding: "10px",
									fontSize: "12px",
									color: "var(--muted-foreground)",
								}}
							>
								カテゴリーが見つかりません
							</div>
						)}
					</div>
				</div>
			)}

			{/* Slide fold/unfold vertical toggle tab */}
			<div
				className={styles.toggle_tab}
				onClick={() => setIsCollapsed(!isCollapsed)}
			>
				<span className={styles.tab_text}>一覧</span>
				<span className={styles.tab_arrow}>
					{isCollapsed ? "＞" : "＜"}
				</span>
			</div>
		</div>
	);
}
