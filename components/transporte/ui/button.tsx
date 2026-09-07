import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-[var(--tp-primary)] text-[var(--tp-primary-foreground)] hover:opacity-90',
  secondary: 'bg-[var(--tp-muted)] text-[var(--tp-foreground)] hover:bg-[var(--tp-border)]',
  ghost: 'bg-transparent text-[var(--tp-foreground)] hover:bg-[var(--tp-muted)]',
  destructive: 'bg-[var(--tp-destructive)] text-white hover:opacity-90',
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ className = '', variant = 'primary', ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${className}`}
    {...props}
  />
));
Button.displayName = 'Button';
