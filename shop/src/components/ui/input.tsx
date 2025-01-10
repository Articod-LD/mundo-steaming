import classNames from "classnames";
import cn from "classnames";
import React, { InputHTMLAttributes } from "react";

export interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  className?: string;
  inputClassName?: string;
  label?: string;
  note?: string;
  name: string;
  error?: string;
  type?: string;
  shadow?: boolean;
  variant?: "normal" | "solid" | "outline";
  dimension?: "small" | "medium" | "big";
  showLabel?: boolean;
  isRequired?: boolean;
  isEditar?: boolean;
}

const classes = {
  root: "px-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0",
  normal:
    "bg-gray-100 border border-border-base focus:shadow focus:bg-light focus:border-accent",
  solid:
    "bg-gray-100 border border-border-100 focus:bg-light focus:border-accent",
  outline: "border border-border-base focus:border-accent text-black",
  shadow: "focus:shadow",
};
const sizeClasses = {
  small: "text-sm h-10",
  medium: "h-12",
  big: "h-14",
};
const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  (
    {
      className,
      label,
      note,
      name,
      error,
      children,
      variant = "normal",
      dimension = "medium",
      shadow = false,
      type = "text",
      inputClassName,
      isEditar = false,
      disabled,
      showLabel = true,
      isRequired = false,
      ...rest
    },
    ref
  ) => {
    const rootClassName = cn(
      classes.root,
      {
        [classes.normal]: variant === "normal",
        [classes.solid]: variant === "solid",
        [classes.outline]: variant === "outline",
      },
      {
        [classes.shadow]: shadow,
      },
      sizeClasses[dimension],
      inputClassName
    );
    let numberDisable = type === "number" && disabled ? "number-disable" : "";
    return (
      <div className={className}>
        {showLabel ? (
          <label
            htmlFor={name}
            className={classNames(
              "text-sm font-normal leading-none",
              isEditar ? "text-gray-600" : "text-white"
            )}
          >
            {label}
            {isRequired && <span className="text-red-500 px-1">*</span>}
          </label>
        ) : (
          ""
        )}
        {type === "textarea" ? (
          <textarea
            id={name}
            name={name}
            cols={3}
            rows={6}
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            className={`${rootClassName} resize-none h-20 ${
              disabled
                ? `cursor-not-allowed border-[#D4D8DD] bg-[#EEF1F4] ${numberDisable} select-none`
                : ""
            }`}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            {...rest}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            className={`${rootClassName} ${
              disabled
                ? `cursor-not-allowed border-[#D4D8DD] bg-[#EEF1F4] ${numberDisable} select-none`
                : ""
            }`}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            {...rest}
          />
        )}
        {note && <p className="mt-2 text-xs text-white">{note}</p>}
        {error && (
          <p className="my-2 text-xs text-red-500 text-start">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
