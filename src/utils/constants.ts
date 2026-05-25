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

export enum CategoryStatus {
  PUBLISHED = 'public',
  PRIVATE = 'private',
}

export enum AccountStatus{
  EDITOR = 'editor',
  ADMIN = 'admin'
}