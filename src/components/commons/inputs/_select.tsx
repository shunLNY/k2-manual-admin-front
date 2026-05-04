import React, { useEffect, useState } from 'react';
import Select, {
  components,
  DropdownIndicatorProps,
  SelectInstance,
} from 'react-select';
import classNames from 'classnames';
import { IconTextBottom } from '../../icons/icons';
import styles from './_select.module.scss';

/**
 *
 * @param {options} Array {value: 1, label: 'Label1'}
 * @returns
 */

const ReactSelect = React.forwardRef<SelectInstance, any>(
  (props: any, ref: any) => {
    const [target, setTarget] = useState<HTMLElement>();
    const DropdownIndicator = (props: any) => {
      return (
        <components.DropdownIndicator {...props}>
          <IconTextBottom
          // style={{ transform: 'rotate(90deg)', color: '#999fc0' }}
          />
        </components.DropdownIndicator>
      );
    };
    useEffect(() => {
      setTarget(document.body);
    }, []);

    if (target === undefined) return null;

    return (
      <>
        <label className={styles.select_label}>
          {/* {props.label || 'Select'} */}
          {props.label}
        </label>
        <Select
          {...props}
          ref={ref}
          className={classNames(styles.react_select, props.className)}
          classNamePrefix={classNames('react-select')}
          isSearchable={props.isSearchable || false}
          placeholder={props.placeholder || '--選択--'}
          // instanceId="selectbox"
          menuPlacement={'auto'}
          menuPosition={'fixed'}
          closeMenuOnScroll={true}
          defaultValue={props.defaultValue || ''}
          styles={{
            input: (styles) => ({ ...styles, color: '#222234' }),
            options: (styles: any) => ({
              ...styles,
              color: '#222234',
            }),
            control: (styles: any) => ({
              ...styles,
              border: props.hasError
                ? '1px solid var(--destructive) !important'
                : '1px solid transparent !important',
            }),
          }}
          components={{ DropdownIndicator }}
          noOptionsMessage={() => '選択項目がありません'}
          isDisabled={props.isDisabled}
        />
      </>
    );
  },
);
ReactSelect.displayName = 'ReactSelect';
export default ReactSelect;