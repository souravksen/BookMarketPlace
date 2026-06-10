import { cn } from '../../utils/helpers';

const variants = {
  default: 'bg-dark-800 text-dark-300 border border-dark-700',
  primary: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
  success: 'bg-green-400/10 text-green-400 border border-green-400/20',
  warning: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
  danger: 'bg-red-400/10 text-red-400 border border-red-400/20',
  info: 'bg-blue-400/10 text-blue-400 border border-blue-400/20',
  purple: 'bg-purple-400/10 text-purple-400 border border-purple-400/20',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  );
}
