import { cn } from '../../utils/helpers';
import Spinner from './Spinner';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'text-dark-400 hover:text-dark-100 hover:bg-dark-800 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm',
  outline: 'border border-primary-500 text-primary-400 hover:bg-primary-500/10 px-5 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm active:scale-95',
};

const sizes = {
  sm: 'text-xs px-3 py-1.5',
  md: '',
  lg: 'text-base px-6 py-3',
  icon: 'p-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" />
          {typeof children === 'string' ? 'Loading...' : children}
        </span>
      ) : children}
    </button>
  );
}
