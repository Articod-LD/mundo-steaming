import cn from "classnames";
import { TriangleArrowDown } from "@/components/icons/triangle-arrow-down";
import { TriangleArrowUp } from "@/components/icons/triangle-arrow-up";
import classNames from "classnames";

type Props = {
  title: string | React.ReactNode;
  className?: string;
};

const TitleWithSort = ({
  title,
  className,
}: Props) => {
  return (
    <span className={classNames("inline-flex items-center", className)}>
      <span title={`Sort by ${title}`}>{title}</span>

    </span>
  );
};

export default TitleWithSort;
