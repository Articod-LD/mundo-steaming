import classNames from "classnames";

type CollapseProps = {
  title: any;
  buttonText?: String;
  onClick?: () => any;
};

export const Title: React.FC<CollapseProps> = ({
  title,
  buttonText,
  onClick,
}) => {
  return (
    <div
      className={classNames(
        "w-full mb-7",
        buttonText && "flex justify-between mt-12"
      )}
    >
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
  );
};
