/** @format */
import type { Category } from './types';

export const API_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:4000';

export const NEXT_PUBLIC_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const PAGE_LIMIT = 10;

// Regular Expression
export const emailRegex = /\S+@\S+\.\S+/;
// export const furiganaRegex =
// 	/^([ア-ン゛゜ァ-ォャ-ョー「」、]*|[0-9]*|\s*|　*)*$/;
// export const furiganaRegex =
// 	/^[ｱ-ﾝｧ-ｫｬ-ｮｰﾞﾟ\u30A1-\u30F6\u3099-\u309C A-Z0-9\(\)\-\/]*$/;
export const furiganaRegex =
  /^[ｱ-ﾝｧ-ｫｬ-ｮｰﾞﾟ\u30A1-\u30F6\u3099-\u309C\uFF10-\uFF19A-Z0-9()\s().\-ー．（）･｡／]*$/;
// export const fullHalfKanaRegex = /^[ｧ-ﾝﾞﾟA-Z0-9\s().\-ー．（）･｡／]*$/;
export const fullHalfKanaRegex = /^[ア-ン゛ｱ-ﾝﾞﾟ゛A-Z0-9（）()．.\s\-\/]+$/;

export const phoneRegex =
  /^[0][(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3,4}[-.]?[\s\.]?[0-9]{4,6}$/im;
export const jpPhoneRegex = /^[0-9]{4}[-]?[0-9]{2,3}[-]?[0-9]{3,4}$/im;
export const passwordRegex = /^[A-Za-z0-9!"'$%()*,:;<=>?\[\]^`_@./#&+-{|}~]*$/;
export const noLetterRegex = /[^A-Z][^a-z][^あ-んー][^ア-ケー]/;
export const japaneseRegex =
  /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u3131-\ud79d]/;
export const englishRegex = /^[a-zA-Z\s]*$/;
export const onlyJapaneseRegex =
  /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;

// Error Messages
export const invalidEmail = '有効なメールアドレスを入力してください。';
export const invalidPhone = '有効な電話番号を入力してください。';
export const invalidFax = '有効なFAX番号を入力してください。';
export const invalidFurigana = '有効なフリガナを入力してください。';
export const inavlidPass = '有効なパスワードを入力してください。';
export const invalidCredentials = 'Invalid username or password.';
export const invalidJpCredentials = 'ユーザ名またはパスワードが無効です。';
export const invalidPermissionNumber = '有効な許可番号を入力してください。';
export const loginUserExceed =
  'ログイン試行回数の上限を超えました。しばらくたってから再度お試しください。';
export const notMatchPass = '入力されたパスワードは一致しません。';
export const duplicateEmail = 'このメールアドレスは既に使用されています。';
export const createSuccessfulMessage = 'データの作成が完了しました！';
export const updateSuccessfulMessage = 'データの更新が完了しました！';
export const deleteSuccessfulMessage = 'データの削除が完了しました！';
export const failMessage = 'エラーが発生しました！';

/**
 * react toastify local config
 */

export const toastLocalConfig = {
  autoClose: 1500,
  closeOnClick: true,
  draggable: true,
};

export enum ArticleStatus {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export const BlogsListInfo = [
  {
    id: '1',
    status: ArticleStatus.PUBLIC,
    title: 'The Rise of AI in Daily Life',
    content: 'AI is becoming part of our everyday routines...',
    thumbnail_path: '/images/blog1.jpg',
    publish_start_at: '2025-07-01T08:00:00Z',
    publish_end_at: '2025-07-31T23:59:59Z',
    creator: 'Amy Moe',
    editor: 'John Doe',
  },
  {
    id: '2',
    status: ArticleStatus.PRIVATE,
    title: 'Behind the Scenes of Web Development',
    content:
      'Let’s explore what makes web development challenging and rewarding...',
    thumbnail_path: '/images/blog2.jpg',
    publish_start_at: '2025-06-15T10:00:00Z',
    publish_end_at: '2025-08-15T18:00:00Z',
    creator: 'Michael Tanaka',
    editor: 'Sara Smith',
  },
  {
    id: '3',
    status: ArticleStatus.PRIVATE,
    title: 'Top 10 VS Code Extensions for Productivity',
    content: 'Boost your development speed with these extensions...',
    thumbnail_path: '/images/blog3.jpg',
    publish_start_at: '2025-07-20T09:30:00Z',
    publish_end_at: '2025-08-20T21:00:00Z',
    creator: 'Emily Zhang',
    editor: 'Amy Moe',
  },
  {
    id: '4',
    status: ArticleStatus.PUBLIC,
    title: 'Exploring Japan’s Tech Startups',
    content: 'Japan is home to some innovative new tech companies...',
    thumbnail_path: '/images/blog4.jpg',
    publish_start_at: '2025-07-10T07:00:00Z',
    publish_end_at: '2025-07-31T23:59:59Z',
    creator: 'Taro Yamada',
    editor: 'Yuki Nakamura',
  },
  {
    id: '5',
    status: ArticleStatus.PUBLIC,
    title: 'Mastering React in 30 Days',
    content: 'Follow this plan to become a React expert...',
    thumbnail_path: '/images/blog5.jpg',
    publish_start_at: '2025-07-05T12:00:00Z',
    publish_end_at: '2025-08-05T12:00:00Z',
    creator: 'Jane Kim',
    editor: 'Mark Lee',
  },
];


export enum CategoryStatus {
  PUBLISHED = 'public',
  PRIVATE = 'private',
}

export const Category_list_info: Category[] = [
  {
    id: '1',
    sort_order: 1,
    status: CategoryStatus.PUBLISHED,
    category_name: 'K2 (Main)',
    category_slug: 'k2',
    creatorId: '2',
    editorId: '1',
    blog_categories: [{}, {}],
    createdAt: '2026/04/20',
    updatedAt: '2026/04/20',
    creator: { id: '2', account_id: '2', role: 'admin', account_name: 'John', email: 'john@abc.com', password: 'password' },
    editor: { id: '1', account_id: '1', role: 'admin', account_name: 'SHUN LAE', email: 'shunlae@abc.com', password: 'password' },
    category_id: '1',
    // LEVEL 2
    child_categories: [
      {
        id: '1-1',
        sort_order: 1,
        status: CategoryStatus.PUBLISHED,
        category_name: 'Child Category (Level 2)',
        category_slug: 'child-2',
        blog_categories: [{}],
        // LEVEL 3
        child_categories: [
          {
            id: '1-1-1',
            sort_order: 1,
            status: CategoryStatus.PUBLISHED,
            category_name: 'Grandchild Category (Level 3)',
            category_slug: 'child-3',
            blog_categories: [{}, {}],
            // LEVEL 4 (MAX)
            child_categories: [
              {
                id: '1-1-1-1',
                sort_order: 1,
                status: CategoryStatus.PUBLISHED,
                category_name: 'Great-Grandchild Category (Level 4)',
                category_slug: 'child-4',
                blog_categories: [{}],
                child_categories: [] // Limit reached
              }
            ]
          }
        ],
    createdAt: '2026/04/20',
    updatedAt: '2026/04/20',
    creator: { id: '2', account_id: '2', role: 'admin', account_name: 'John', email: 'john@abc.com', password: 'password' },
    editor: { id: '1', account_id: '1', role: 'admin', account_name: 'SHUN LAE', email: 'shunlae@abc.com', password: 'password' },
      }
    ]
  },
  {
    id: '2',
    sort_order: 2,
    status: CategoryStatus.PRIVATE,
    category_name: 'S1 (Main)',
    category_slug: 's1',
    creatorId: '2',
    editorId: '1',
    blog_categories: Array(5).fill({}),
    createdAt: '2026/04/20',
    updatedAt: '2026/04/20',
    creator: { id: '2', account_id: '2', role: 'admin', account_name: 'John', email: 'john@abc.com', password: 'password' },
    editor: { id: '1', account_id: '1', role: 'admin', account_name: 'SHUN LAE', email: 'shunlae@abc.com', password: 'password' },
    category_id: '2',
    child_categories: []
  },
  {
    id: '3',
    sort_order: 3,
    status: CategoryStatus.PUBLISHED,
    category_name: 'SEO (Main)',
    category_slug: 'seo',
    creatorId: '2',
    editorId: '1',
    blog_categories: Array(21).fill({}),
    createdAt: '2026/04/20',
    updatedAt: '2026/04/20',
    creator: { id: '2', account_id: '2', role: 'admin', account_name: 'John', email: 'john@abc.com', password: 'password' },
    editor: { id: '1', account_id: '1', role: 'admin', account_name: 'SHUN LAE', email: 'shunlae@abc.com', password: 'password' },
    category_id: '3',
    child_categories: [
      {
        id: '3-1',
        sort_order: 1,
        status: CategoryStatus.PUBLISHED,
        category_name: 'SEO Sub Category',
        category_slug: 'seo-sub',
        blog_categories: Array(5).fill({}),
        child_categories: []
      }
    ]
  }
];

export enum AccountStatus{
  EDITOR = 'editor',
  ADMIN = 'admin'
}

export const AccountListInfo = [
  {
    id: '1',
    role: AccountStatus.ADMIN,
    account_name: "SHUN LAE",
    email:"shunlae@abc.com",
    password:"123456",
  },
  {
    id: '2',
    role: AccountStatus.EDITOR,
    account_name: "John",
    email:"john@abc.com",
    password:"123456",
  },
  {
    id: '3',
    role: AccountStatus.ADMIN,
    account_name: "Selena",
    email:"selena@abc.com",
    password:"123456",
  },
]