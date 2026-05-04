/** @format */

import { memo, useRef } from 'react';

import styles from './keyword-input.module.scss';
import { IconMagnifyingGlass, IconXMark } from '@/components/icons/icons';

type Props = {
  value: string;
  onSearch?: (value: string) => void;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
};

function KeywordInput({ onSearch, ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = () => {
    if (props.onChange) {
      if (inputRef.current) {
        props.onChange(inputRef.current.value);
      }
    }
  };

  const clearInput = () => {
    props.onChange('');
  };

  const handleSearch = () => {
    if (onSearch) {
      if (inputRef.current) {
        const inputValue = inputRef.current.value.trim();
        onSearch(inputValue);
      }
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      handleSearch();
    }
  };

  let { className } = props;
  let classes = [styles.search_bar, className].join(' ');
  return (
    <>
      <div className={classes}>
        <IconMagnifyingGlass />
        <input
          // onKeyDown={handleEnter}
          className={styles.search_input}
          placeholder={props.placeholder || 'キーワード検索'}
          ref={inputRef}
          value={props.value}
          onChange={handleChange}
        />
        <button onClick={clearInput} className={styles.search_clear}>
          <IconXMark />
        </button>
      </div>
    </>
  );
}

export default memo(KeywordInput);
