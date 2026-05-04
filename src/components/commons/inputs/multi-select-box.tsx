// // components/MultiSelectBox.tsx
// import React, { useState } from "react";
// import Select, { MultiValue } from "react-select";
// import "./multi-select-box.module.scss"

// export interface Option {
//   value: string;
//   label: string;
//   [key: string]: any;
// }

// type MultiSelectBoxProps = {
//   options: Option[];
//   value?: Option[];
//   onChange?: (selected: Option[]) => void;
//   placeholder?: string;
//   isClearable?: boolean;
//   closeMenuOnSelect?: boolean;
// };

// const MultiSelectBox: React.FC<MultiSelectBoxProps> = ({
//   options,
//   value = [],
//   onChange,
//   placeholder = "Select...",
//   isClearable = true,
//   closeMenuOnSelect = false,
// }) => {
//   const [selected, setSelected] = useState<Option[]>(value);

//   const handleChange = (values: MultiValue<Option>) => {
//     const arr = values as Option[];
//     setSelected(arr);
//     onChange?.(arr);
//   };

//   return (
//     <Select<Option, true>

//       options={options}
//       value={selected}
//       onChange={handleChange}
//       isMulti
//       isClearable={isClearable}
//       closeMenuOnSelect={closeMenuOnSelect}
//       placeholder={placeholder}
//       classNamePrefix="react-select"
//       hideSelectedOptions={false}
//       styles={{
//         multiValueRemove: (base, state) => ({
//           ...base,
//           padding: '4px',
//           cursor: 'pointer',
//           backgroundColor: 'transparent',
//           '&:hover': {
//             backgroundColor: '#c2c5d910',
//           },
//         }),
//       }}
//     />
//   );
// };

// export default MultiSelectBox;


import React from 'react';
import { SelectInstance } from 'react-select';
import ReactSelect from './_select';

interface Props {
  options: any[];
  placeholder: string;
  onChange?: Function;
  isClearable: boolean;
  value?: any[];
  isDisabled?: boolean;
  isSearchable?: boolean;
  label?: string;
  isOptionDisabled?: Function;
}

const MultiSelect = React.forwardRef<SelectInstance, Props>(
  (props: Props, ref: any) => {
    return <ReactSelect {...props} ref={ref} isMulti={true} />;
  },
);
MultiSelect.displayName = 'MultiSelect';
export default MultiSelect;