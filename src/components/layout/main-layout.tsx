/** @format */

import { useContext, useState } from 'react';

import styles from './main-layout.module.scss';
import dynamic from 'next/dynamic';
import SideBarMenu from './side-bar-menu';
import Header from './header-menu';
import { usePathname } from 'next/navigation';

type Props = {
	children?: any;
	title: string;
};

export default function MainLayout({ children, title = 'HOME' }: Props) {
	// const [isMenuOpen, setIsMenuOpen] = useState(false);

	// const toggleAppMenu = (value: boolean) => {
	//     setIsMenuOpen(value);
	// };
	const pathname = usePathname();
	// const pageTitle = pathname.includes('/edit') ? `${title}` : pathname.includes('/new') ? `${title}` : title;
	return (
		<>
			<div className='main_container'>
				<Header title={title} className={'relative'}>
					{/* <SlideMenu toggleAppMenu={toggleAppMenu} /> */}
				</Header>
				<div className={styles.layout_container}>
					<SideBarMenu />
					<div className={styles.content}>{children}</div>
				</div>
			</div>
		</>
	);
}
