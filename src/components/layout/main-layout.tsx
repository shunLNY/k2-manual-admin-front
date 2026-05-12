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

import { ListPageContextProvider } from '@/store/list-page-context';

export default function MainLayout({ children, title = 'HOME' }: Props) {
	const pathname = usePathname();
	return (
		<ListPageContextProvider>
			<div className='main_container'>
				<Header title={title} className={'relative'}>
				</Header>
				<div className={styles.layout_container}>
					<SideBarMenu />
					<div className={styles.content}>{children}</div>
				</div>
			</div>
		</ListPageContextProvider>
	);
}
