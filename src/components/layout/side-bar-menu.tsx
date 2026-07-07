/** @format */

//CSS
import Link from "next/link";
import styles from "./side-bar-menu.module.scss";
import {
	IconBlogList,
	IconFileList,
	IconMenuBlock,
	IconUser,
} from "../icons/icons";
import { usePathname } from "next/navigation";

export default function SideBarMenu() {
	// Safe fallback: if pathname is null, default to an empty string
	const pathname = usePathname() || "";

	return (
		<div className={styles.side_menu_container}>
			<div className={styles.nav_list_container}>
				{/* Dashboard */}
				<Link
					className={`${styles.nav_item} ${
						pathname === "/dashboard" ? styles.active : ""
					}`}
					href={"/dashboard"}
				>
					<IconMenuBlock />
					<p className={styles.nav_text}>Dashboard</p>
				</Link>

				{/* Articles */}
				<Link
					className={`${styles.nav_item} ${
						pathname.startsWith("/articles") ? styles.active : ""
					}`}
					href={"/articles"}
				>
					<IconBlogList />
					<p>Articles</p>
				</Link>

				{/* Categories */}
				<Link
					className={`${styles.nav_item} ${
						pathname.startsWith("/categories") ? styles.active : ""
					}`}
					href={"/categories"}
				>
					<IconFileList />
					<p>Categories</p>
				</Link>

				{/* Accounts */}
				<Link
					className={`${styles.nav_item} ${
						pathname.startsWith("/accounts") ? styles.active : ""
					}`}
					href={"/accounts"}
				>
					<IconUser />
					<p>Accounts</p>
				</Link>
			</div>
		</div>
	);
}
