/** @format */

//Related Next
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

//Context

//Icons , modals and buttons
import { LayoutProps } from '@/utils/types';

//CSS
import styles from './header-menu.module.scss';
import { IconArrowLeft, IconFilter, IconFilterDown, IconKenkoukanri, IconLogout, IconUserMenu } from '../icons/icons';
import { useContext, useEffect, useState } from 'react';
import ButtonSave from '@/components/commons/buttons/btn-save';
import ArticleContext from '@/store/articles-context';
// import ListPageContext from '@/store/list-page-context';
// import CategoryListContext from '@/store/categories-context';
// import { signOut } from 'next-auth/react';
import { NEXT_PUBLIC_APP_URL } from '@/utils/constants';
// import AuthContext from '@/store/auth-context';
// import AccountContext from '@/store/accounts-context';
import { useAccountInfo } from '@/lib/hooks/common-hooks';

type Props = {
  title?: string;
  className?: string;
};

export default function Header(props: LayoutProps) {
  const router = useRouter();
  console.log(router.asPath, "...................path name ")
  const pathname = router.asPath;
  
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter") ?? "";
  // const authContext = useContext(AuthContext);

  const isEntryPage = pathname?.includes("/new"); // Check If PathName include  "/new"
  const isEditEntryPage = pathname?.includes("/edit"); // Check If PathName include  "/edit"



  const articleListCtx = useContext(ArticleContext)
  // const pageCtx = useContext(ListPageContext)
  // const categoryCtx = useContext(CategoryListContext)
  // const accountCtx = useContext(AccountContext);
  // const { getAccountInfo, accountInfo } = accountCtx;
  // const { data: accountData, mutate: refreshData } = useAccountInfo(authContext.user.uid)



  const { title, className } = props;
  const isDashboard = pathname === '/dashboard' || pathname === '/';
  let classes = [styles.header, className].join(" ");
  const [isShowSetting, setIsShowSetting] = useState<boolean>(false);

  // const session =await getSession();

  // console.log(session , "...........session in header menu");

  // useEffect(() => {
  //   refreshData();
  // }, [isShowSetting])



  // Navigate to the Previous page
  const handleNavigateLink = () => {
    const hasPreviousPage = window.history.length > 1;

    // if (pageCtx.showConstructionCreate) {
    //   pageCtx.setShowConstructionCreate(false);
    // }

    // if (pageCtx.listFilter !== "") {
    //   pageCtx.setListFilter("");
    // }
    router.back();

    // Reset filter if no storage items
    // pageCtx.setListFilter("");
    // pageCtx.setBreadCrumbTitle("");
  };


  // Change theme 
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleUserProfile = () => {
    router.replace("/my-profile");
    setIsShowSetting(false);
  }

  const logInUser = {
    id: "99999999",
    name: "田中太郎",
    email: "tanaka@sample.com",
    password: "password123"
  }

  return (
    <header className={className}>
      <div className={styles.menu_bar + ' d-flex items-center hide-menu-sp'}>
        <div className={styles.menu_left}>
          <div className={`${styles.logo} ${isDashboard ? styles.show_logo_sp : ''}`}>
            <IconKenkoukanri />
          </div>
          {/* Header Title & Back Icon */}
          <div className={styles.left}>
            {props.title && (
              <>
                {!isDashboard && (
                  <span onClick={handleNavigateLink} className={styles.back_icon}>
                    <IconArrowLeft />
                  </span>
                )}
                <span className={styles.header_title}>{props.title}</span>
              </>
            )}
          </div>
        </div>
        {/* Filter and Download  */}
        <div className={`${styles.menu_list} ml-auto d-flex items-center relative`}>

          <div className={styles.btn_container}>
            {/* {pathname === "/dashboard" && (
              <>
                <a
                  href={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Analyticsに移動
                </a>
              </>
            )} */}

            {pathname === "/articles" && (
              <>
                <Link href="/articles/new">記事作成</Link>
              </>
            )}


            {pathname === "/categories" && (
              <>
                <Link href="/categories/new">カテゴリー作成</Link>
              </>

            )}

            {pathname === "/accounts" && (
              <>
                <Link href="/accounts/new">アカウント作成</Link>
              </>

            )}

            {/* {
              !isEntryPage && !isEditEntryPage && pathname !== "/dashboard" && pathname !== "/my-profile" && pathname !== "/" && (
                <div className={`${styles.filter_container} ${pageCtx.openFilterModal ? styles.active : ""}`} onClick={() => pageCtx.setOpenFilterModal(!pageCtx.openFilterModal)}>
                  <IconFilter />
                  絞り込む
                  <IconFilterDown />
                </div>
              )
            } */}



          </div>
          <div className={`${styles.menu_list} ml-auto d-flex items-center relative`}>
            <button
              className={styles.btn_user_menu}
              onClick={() => {
                setIsShowSetting(!isShowSetting)
              }}>
              <IconUserMenu />
            </button>
          </div>

        </div>
      </div>
      {
        isShowSetting && (
          <div onClick={() => { setIsShowSetting(!isShowSetting) }} className={styles.overlay}>
            <div onClick={(e) => e.stopPropagation()} className={styles.setting_container}>
              <div className={styles.user_account_container}>
                {/* <p className={styles.user_name}> {accountData.account_name} </p> */}
                {/* <p className={styles.user_email}> {accountData.email} </p> */}
                <ButtonSave onClick={() => { handleUserProfile() }} type='button' text='アカウント管理' className={styles.logout_btn} />
              </div>
              <div className={styles.theme_container}>
                <p className={styles.title}>外観</p>
                <div className={styles.dark_mode}>
                  <input
                    id="theme-light-radio"
                    name='theme'
                    checked={theme === "light"}
                    onChange={() =>
                      changeTheme("light")}
                    type="radio"
                  />
                  <label htmlFor="theme-light-radio">ライトモード</label>
                </div>
                <div className={styles.light_mode}>
                  <input
                    id="theme-dark-radio"
                    name='theme'
                    checked={theme === "dark"}
                    onChange={() =>
                      changeTheme("dark")}
                    type="radio" />
                  <label htmlFor="theme-dark-radio">ダークモード</label>
                </div>
              </div>
              <div 
              // onClick={() =>
                // signOut({ callbackUrl: NEXT_PUBLIC_APP_URL + '/auth/signin' })
              // }
                className={styles.logout_container}>
                <div className={styles.logout_btn}>
                  <IconLogout />
                  <p>ログアウト</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </header>
  );
}
