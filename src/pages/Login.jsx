import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-dark-100">Welcome back</h1>
          <p className="text-dark-500 text-sm mt-1">Sign in to your BookMarket account</p>
        </div>

        {/* Card */}
        <div className="card-glass p-8 shadow-2xl">
          {/* Demo hint */}
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 mb-6 text-xs text-primary-400">
            <strong>Demo:</strong> Enter any email &amp; password (6+ chars) to log in.
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 mt-3 pointer-events-none" style={{ marginTop: 0, top: '43px', transform: 'none' }} />
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                className="pl-9"
                {...register('email')}
              />
            </div>

            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                className="pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-9 text-dark-500 hover:text-dark-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</a>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-800" /></div>
            <div className="relative flex justify-center"><span className="bg-dark-900 px-3 text-xs text-dark-600">or</span></div>
          </div>

          <p className="text-center text-sm text-dark-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
