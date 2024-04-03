"use client";
export const SubmitButton: React.FunctionComponent<any> = ({
  title,
  onClick,
  className,
  isDisabled,
}) => {
  return (
    <button
      type="submit"
      disabled={isDisabled === undefined ? false : isDisabled}
      className={
        isDisabled === true
          ? `px-5 mt-2 p-2.5 flex-1 text-white rounded-md outline-none text-white-normal bg-gray-500 ${className}`
          : `px-5 mt-2 p-2.5 flex-1 text-white bg-[#0e6431] rounded-md outline-none text-white-normal hover:bg-[#0d5a2c] ${className}`
      }
      onClick={onClick}
    >
      {title}
    </button>
  );
};
