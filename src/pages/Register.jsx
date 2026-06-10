import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookOpen, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['BUYER', 'SELLER']),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'BUYER' },
  });

  const role = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerUser(data);
    setLoading(false);
    if (result.success) {
      toast.success('Account created! Welcome to BookMarket 🎉');
      navigate('/');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-dark-100">Create your account</h1>
          <p className="text-dark-500 text-sm mt-1">Join thousands of book lovers on BookMarket</p>
        </div>

        <div className="card-glass p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Role Toggle */}
            <div>
              <p className="label">I want to</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'BUYER', label: '🛒 Buy Books' },
                  { value: 'SELLER', label: '📦 Sell Books' },
                ].map(opt => (
                  <label key={opt.value} className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                    role === opt.value
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-dark-700 bg-dark-800 text-dark-400 hover:border-dark-600'
                  }`}>
                    <input type="radio" value={opt.value} {...register('role')} className="sr-only" />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <Input
              id="name"
              label="Full Name"
              type="text"
              placeholder="Arjun Sharma"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              id="reg-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                id="reg-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                error={errors.password?.message}
                className="pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-9 text-dark-500 hover:text-dark-300 transition-colors"
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-dark-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
