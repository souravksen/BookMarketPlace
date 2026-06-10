import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Input = forwardRef(({ label, error, className, id, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={cn('input-field', error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500', className)}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
