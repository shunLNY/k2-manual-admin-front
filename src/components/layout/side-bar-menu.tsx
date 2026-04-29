/** @format */

//CSS
import Link from 'next/link';
// import ActiveLink from '../commons/active-link';
import styles from './side-bar-menu.module.scss';
import { IconBlogList, IconFileList, IconMenu, IconMenuBlock, IconMenuFileText, IconMenuHome, IconMenuManual, IconUser } from '../icons/icons';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
// import AuthContext from '@/store/auth-context';

export default function SideBarMenu() {
  const pathname = usePathname();
  // const authCtx = useContext(AuthContext);

  return (
    <div className={styles.side_menu_container}>
      <div className={styles.nav_list_container}>
        <Link
          className={`${styles.nav_item} ${pathname === '/dashboard' ? styles.active : ''
            }`}
          href={'/dashboard'}>
          <IconMenuBlock />
          <p className={styles.nav_text}>DASHBOARD</p>
        </Link>
        <Link
          className={`${styles.nav_item} ${pathname === '/articles' ? styles.active : ''
            }`}
          href={'/articles'}>
          <IconBlogList />
          <p>Articles</p>
        </Link>
        <Link
          className={`${styles.nav_item} ${pathname === '/categories' ? styles.active : ''
            }`}
          href={'/categories'}>
          <IconFileList />
          <p>Categories</p>
        </Link>
        {/* {
          authCtx.user.role === 'admin' && (
            <Link
              className={`${styles.nav_item} ${pathname === '/accounts' ? styles.active : ''
                }`}
              href={'/accounts'}>
              <IconUser />
              <p>Accounts</p>
            </Link>
          )
        } */}
        <Link
          className={`${styles.nav_item} ${pathname === '/accounts' ? styles.active : ''
            }`}
          href={'/accounts'}>
          <IconUser />
          <p>Accounts</p>
        </Link>
      </div>
    </div>
  );
}
