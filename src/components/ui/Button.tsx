import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-[#00B86B] text-white hover:bg-[#00A05D]': variant === 'primary',
            'bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]': variant === 'secondary',
            'border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]': variant === 'outline',
            'text-[#0F172A] hover:bg-[#F8FAFC]': variant === 'ghost',
          },
          {
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-11 px-8': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button }; 