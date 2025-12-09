import React from "react";
import { Select } from "chakra-react-select";

interface Option {
  value: any;
  label: string;
}
interface SelectProps {
  name: string;
  options: Option[];
  placeholder: string;
  value: Option | null | undefined;
  onChange: (value: any) => void;
}

const StyledSelect: React.FC<SelectProps> = ({
  name,
  options,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <Select
      name={name}
      options={options}
      placeholder={placeholder}
      isClearable={true}
      value={value}
      onChange={onChange}
      chakraStyles={{
        control: (provided) => ({
          ...provided,
          cursor: "pointer",
          fontSize: "sm",
          fontWeight: "500",
        }),
        option: (provided, state) => ({
          ...provided,
          fontSize: "sm",
          fontWeight: "500",
          backgroundColor: state.isSelected
            ? "gray.700"
            : state.isFocused
              ? "gray.600"
              : "gray.800",
          color: "white",
          _hover: {
            backgroundColor: "gray.600",
          },
        }),
        menu: (provided) => ({
          ...provided,
          fontSize: "sm",
          fontWeight: "500",
          backgroundColor: "gray.800",
        }),
        menuList: (provided) => ({
          ...provided,
          backgroundColor: "gray.800",
        }),
        singleValue: (provided) => ({
          ...provided,
          fontSize: "sm",
          fontWeight: "500",
          color: "white",
        }),
        placeholder: (provided) => ({
          ...provided,
          fontSize: "sm",
          fontWeight: "500",
          color: "gray.400",
        }),
      }}
    />
  )
};

export default StyledSelect;

