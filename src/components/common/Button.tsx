import clsx from "clsx";

type ButtonProps = {
  isLoading?: boolean;
  text: string;
  isDisabled?: boolean;
  className?: string;
  onClick?: () => void;
};

const Button = ({
  text,
  isLoading,
  isDisabled,
  className,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={clsx(
        "bg-blue-500 text-white p-2 rounded w-full flex justify-center items-center gap-2",
        className
      )}
    >
      {isLoading && (
        <>
          <div className="w-4 h-4 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
          <p>Cargando</p>
        </>
      )}

      {!isLoading && <p>{text}</p>}
    </button>
  );
};

export default Button;
