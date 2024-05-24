import routes from "@/config/routes";
import classNames from "classnames";
import Link from "next/link";

type CollapseProps = {
  title: any;
  buttonText?: string;
  onClick?: () => any;
  isBack?: boolean;
  textBack?: string;
};

export const Title: React.FC<CollapseProps> = ({
  title,
  buttonText,
  onClick,
  isBack = false,
  textBack,
}) => {
  return (
    <div
      className={classNames(
        "w-full mb-7",
        buttonText && "flex justify-between mt-12"
      )}
    >
      <div className="flex">
        <div className="inline-block relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:border-2 after:border-brand pb-2">
          <h4 className="font-bold text-3xl uppercase">{title}</h4>
        </div>
        <button
          className={classNames(
            "p-2 bg-brand rounded-xl mt-4 transition ease-in-out hover:scale-105 hover:bg-red-800 duration-30 uppercase text-white",
            buttonText ? "flex" : "hidden"
          )}
          onClick={onClick}
        >
          + {buttonText}
        </button>
      </div>
      {isBack && (
        <div className="flex mt-3 relative text-white z-10">
          <Link href={routes.home}>HOME</Link> / {textBack}
        </div>
      )}
    </div>
  );
};
