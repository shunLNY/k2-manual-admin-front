/** @format */

import React from 'react';
import { UseFormRegister } from 'react-hook-form';

import styles from './form-element.module.scss';

interface TextFieldProps {
  requiredText?: string;
  name: string;
  type?: string;
  register?: UseFormRegister<any>;
  required?: boolean;
  validation?: { [key: string]: any };
  placeholder?: string;
  style?: React.CSSProperties;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  value?: any;
  disabled?: boolean;
  error?: boolean;
  step?: string;
  inputMode?:
  | 'text'
  | 'search'
  | 'email'
  | 'tel'
  | 'url'
  | 'none'
  | 'numeric'
  | 'decimal';
  pattern?: string;
  maxLength?: number;
  min?: number | string;
}

export default function TextField(props: TextFieldProps) {
  const {
    requiredText,
    name,
    type = 'text',
    register,
    required = false,
    validation,
    placeholder,
    style,
    defaultValue,
    onChange,
    value,
    onKeyDown,
    disabled,
    error,
    step,
    inputMode,
    pattern,
    maxLength,
    min,
  } = props;

  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        {...(register
          ? register(name, {
            required: required ? requiredText : false,
            setValueAs: validation?.setValueAs,
            ...validation,
          })
          : {})}
        className={`${styles.text_input} ${error ? styles.input_error : ''}`}
        style={style}
        defaultValue={defaultValue}
        onChange={onChange}
        value={value !== undefined && value !== null ? value : undefined}
        // value={value || undefined} // for controlled component error comment out
        onKeyDown={onKeyDown}
        disabled={disabled}
        step={step} // Pass the step value
        inputMode={inputMode} // Pass the inputMode value
        pattern={pattern} // Pass the pattern value
        maxLength={maxLength}
        min={min}
        id={name}
        name={name}
      />

      {/* <input
				{...register(name, {
					required: required ? requiredText : false,
					...validation,
				})}
				{...props}
				className={styles.text_input}
				type={type}
				placeholder={placeholder}
				style={style}
			/> */}
    </>
  );
}
