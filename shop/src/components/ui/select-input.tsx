import React from "react";
import Select from "@/components/ui/select/select";
import TooltipLabel from "@/components/ui/tooltip-label";
import { Controller } from "react-hook-form";
import { GetOptionLabel } from "react-select";

interface SelectInputProps {
  control: any;
  rules?: any;
  name: string;
  options: object[];
  getOptionLabel?: GetOptionLabel<unknown>;
  getOptionValue?: GetOptionLabel<unknown>;
  isMulti?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  [key: string]: unknown;
  placeholder?: string;
  required?: boolean;
  label?: string;
  toolTipText?: string;
  defaultValue?: object[]
}

const SelectInput = ({
  control,
  options,
  name,
  rules,
  getOptionLabel,
  getOptionValue,
  disabled,
  isMulti,
  isClearable,
  isLoading,
  placeholder,
  label,
  required,
  toolTipText,
  defaultValue,
  ...rest
}: SelectInputProps) => {
  const defaultvalueformated = defaultValue as [{name:string,id:string}];

  return (
    <>
      {label ? (
        <TooltipLabel
          htmlFor={name}
          toolTipText={toolTipText}
          label={label}
          required={required}
        />
      ) : (
        ""
      )}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultvalueformated ? defaultvalueformated[0] : undefined}
        rules={rules}
        {...rest}
        render={({ field }) => (
          <Select
            {...field}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            placeholder={placeholder}
            defaultValue={defaultValue}
            isMulti={isMulti}
            isClearable={isClearable}
            isLoading={isLoading}
            options={options}
            isDisabled={disabled as boolean}
          />
        )}
      />
    </>
  );
};

export default SelectInput;
