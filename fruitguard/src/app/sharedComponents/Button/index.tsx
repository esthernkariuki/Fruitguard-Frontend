import { ReactNode } from "react";

interface ButtonProps {
  buttonText: string;
  variant: 'primary' | 'secondary' | 'default';
  onClickHandler: () => void;
  icon?: ReactNode;
  className?: string; 
}

const Button = ({ buttonText, variant, onClickHandler, icon, className = '' }: ButtonProps) => {
  const buttonVariants = () => {
    switch (variant) {
      case 'primary': return 'bg-[#FFF661] text-[#683929] border-none';
      case 'secondary': return 'text-[#683929] border border-[#683929] ';
      default: return 'bg-[#683929] text-white border-none';
    }
  };

  return (
    <button
      onClick={onClickHandler}
      className={`${buttonVariants()}  cursor-pointer rounded flex items-center gap-3 justify-center ${className}`}
    >
      {icon}
      {buttonText}
    </button>
  );
};

export default Button;
