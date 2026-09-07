import { type InputHTMLAttributes, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-lg border border-[var(--tp-border)] bg-[var(--tp-card)] px-3 py-2 text-sm text-[var(--tp-foreground)] outline-none focus:ring-2 focus:ring-[var(--tp-primary)] ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';
