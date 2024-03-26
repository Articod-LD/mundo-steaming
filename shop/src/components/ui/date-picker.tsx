import ValidationError from "@/components/ui/form-validation-error";
import TooltipLabel from "@/components/ui/tooltip-label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";

interface DatePickerInputProps {
  control: any;
  minDate?: Date;
  maxDate?: Date;
  endDate?: Date;
  startDate?: Date;
  locale?: string;
  disabled?: boolean;
  placeholder?: string;
  todayButton?: string;
  name: string;
  label?: string;
  toolTipText?: string;
  required?: boolean;
  error?: string;
  dateFormat?: string;
  className?: string;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  control,
  minDate,
  startDate,
  locale,
  disabled,
  placeholder = "Start Date",
  todayButton = "Today",
  name,
  label,
  toolTipText,
  required,
  error,
  dateFormat,
  className,
  maxDate,
  endDate,
  ...rest
}) => {
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
        render={({ field }) => {
          return (
            <DatePicker
              wrapperClassName="w-full"
              startDate={new Date(startDate as Date)}
              placeholderText={placeholder}
              onChange={(date) => field.onChange(date)}
              selected={field.value}
              className={className}
              dateFormat={dateFormat}
            />
          );
        }}
        {...rest}
      />
      <ValidationError message={error} />
    </>
  );
};

export default DatePickerInput;
