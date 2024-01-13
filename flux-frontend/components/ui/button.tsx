import { ComponentProps } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Icons } from '@/constants/icons';

interface ButtonProps extends ComponentProps<'button'> {
  isLoading?: boolean;
}

export const Button = ({ isLoading, ...props }: ButtonProps) => {
  return (
    <button
      disabled={isLoading || props.disabled}
      {...props}
      className={clsx(
        twMerge(
          'bg-[#54BD95] flex justify-center w-full text-white font-semibold hover:bg-[#47ac85] transition-all rounded-md text-base px-4 py-2',
          props.className,
        ),
        {
          ['opacity-80 cursor-wait']: isLoading,
        },
      )}
    >
      {isLoading ? <Icons.Loader className='animate-spin' /> : props.children}
    </button>
  );
};
