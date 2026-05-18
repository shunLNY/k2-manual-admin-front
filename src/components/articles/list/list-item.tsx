/** @format */

'use client';

import { memo, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';

// Context or Store imports

import Link from 'next/link';
import React from 'react';

// Icons and Utility Components imports
import { IconArrowRight, IconMenuBuildingO } from '@/components/icons/icons';

// Stylesheets imports
import styles from '../../../styles/_list.module.scss';
import blogListStyles from './article-list.module.scss';
import { API_URL, BlogsListInfo } from '@/utils/constants';
import { Checkbox } from '@/components/commons/inputs/checkbox';
import Image from 'next/image';
import { ArticlesInfoType } from '@/utils/types';
import { useBlog } from '@/store/articles-context';

type Props = {
  item: ArticlesInfoType,
  index: number,
  limit?: number;
  currentPage: number;
  pageSize: number;
};

const ListItem = (props: Props) => {
  const router = useRouter();
  const listCtx = useBlog()
  const { item, index, currentPage, pageSize } = props;
  console.log(item);
  const { checkedItems, setCheckedItems, selectedBlogs, setSelectedBlogs } = listCtx

  const blogStatus = {
    0: {
      color: 'gray',
      text: '非公開',
    },
    1: {
      color: 'ligthGray',
      text: '下書き',
    },
    2: {
      color: 'blue',
      text: '公開',
    },
    3: {
      color: 'green',
      text: '予約',
    },

  };


  // Navigate To Edit Entry with Project Name Params
  const navigateToEditEntry = (param: string) => {
    console.log(param);
    // Push the new route with the construction title
    router.push(`/blogs/edit/${param}`);
  };

  const handleCheckboxChange = (blog: ArticlesInfoType, itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setSelectedBlogs((prev: any) => {
      if (checked) {
        return [...prev, blog]
      }
      return prev.filter((b: any) => b.id !== blog.id)
    })
    setCheckedItems((prev: any) => (checked ? [...prev, itemId] : prev.filter((id: any) => id !== itemId)))
  }

  return (
    <li onClick={() => navigateToEditEntry(item.id)}>
      <div
        className={` ${styles.item_wrapper} ${blogListStyles.item_wrapper} `}>
        <div>
          <Checkbox
            checked={checkedItems.includes(item.id)}
            onChange={(e) => handleCheckboxChange(item, item.id, e)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className={styles.thumbnail_container}>
          <Image
            quality={90}
            alt="blog-thumbnail"
            // sizes="1000px"
            fill
            style={{
              objectFit: 'cover',
            }}
            src={item.thumbnail_path ? API_URL + '/files' + item.thumbnail_path : '/images/common/no-image.png'}
          />
        </div>
        <div className={styles.item_status}>
          {item.status === 'private' && (
            <span
              className={`${styles[`border_${blogStatus[0].color}`]
                }`}>
              {blogStatus[0]?.text}
            </span>
          )}
          {item.status === 'draft' && (
            <span
              className={`${styles[`border_${blogStatus[1].color}`]
                }`}>
              {blogStatus[1]?.text}
            </span>
          )}
          {item.status === 'published' && (
            item?.publish_start_at && new Date(item?.publish_start_at + 'T00:00:00') > new Date() ? (
              <span className={`${styles[`border_${blogStatus[3].color}`]}`}>
                {blogStatus[3]?.text}
              </span>
            ) : (
              <span className={`${styles[`border_${blogStatus[2].color}`]}`}>
                {blogStatus[2]?.text}
              </span>
            )
          )}
        </div>
        <div>
          <span className={styles.client_name}>
            {item?.publish_start_at}  〜
          </span>
          <br></br>
          <span className={styles.client_name}>
            {item?.publish_end_at}
          </span>
        </div>
        <div>
          {item.categories.map((category, i) => (
            <>
              {i > 0 ? <br /> : null}
              <span key={i} className={styles.client_name}>
                {category.category_name}
              </span>
            </>
          ))}
        </div>
        <div>
          {item.title
            ? item.title?.length > 35
              ? item.title.slice(0, 35) + '...'
              : item.title
            : '-'}
        </div>
        <div>
          {item.excerpt
            ? item.excerpt
            : item.content
              ? item.content.length > 120
                ? item.content.slice(0, 120) + '...'
                : item.content
              : '-'}
        </div>
        <div>
          <span className={styles.client_name}>
            {item?.creator.account_name}
          </span>
          <br></br>
          <span className={styles.client_name}>
            {item?.editor.account_name}
          </span>
        </div>
        <div className={styles.detail_ico}>
          <IconArrowRight />
        </div>
      </div>
    </li>
  );
};

export default memo(ListItem);
