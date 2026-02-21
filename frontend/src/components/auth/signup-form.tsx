'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signupSchema, SignupFormData } from '@/lib/validation/validation';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-destructive' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-warning' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-chart-2' };
  return { score, label: 'Strong', color: 'bg-success' };
}

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  isLoading: boolean;
}

export function SignupForm({ onSubmit, isLoading }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  function validate(): boolean {
    const result = signupSchema.safeParse({ name, email, password, confirmPassword });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};

      if (fieldErrors.name?.[0]) newErrors.name = fieldErrors.name[0];
      if (fieldErrors.email?.[0]) newErrors.email = fieldErrors.email[0];
      if (fieldErrors.password?.[0]) newErrors.password = fieldErrors.password[0];
      if (fieldErrors.confirmPassword?.[0]) newErrors.confirmPassword = fieldErrors.confirmPassword[0];

      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  function validateField(field: keyof typeof signupSchema.shape | 'confirmPassword') {
    const result = signupSchema.safeParse({ name, email, password, confirmPassword });
    
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      if (field === 'name' && fieldErrors.name) setErrors((prev) => ({ ...prev, name: fieldErrors.name![0] }));
      if (field === 'email' && fieldErrors.email) setErrors((prev) => ({ ...prev, email: fieldErrors.email![0] }));
      if (field === 'password' && fieldErrors.password) setErrors((prev) => ({ ...prev, password: fieldErrors.password![0] }));
      if (field === 'confirmPassword' && fieldErrors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: fieldErrors.confirmPassword![0] }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ name, email, password, confirmPassword });
  }

  function clearError(field: string) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Start designing beautiful spaces today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Sarah Mitchell"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError('name'); }}
                  onBlur={() => validateField('name')}
                  className="pl-10"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive" role="alert">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="sarah@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                  onBlur={() => validateField('email')}
                  className="pl-10"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'signup-email-error' : undefined}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p id="signup-email-error" className="text-sm text-destructive" role="alert">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                  onBlur={() => validateField('password')}
                  className="pl-10 pr-10"
                  aria-invalid={!!errors.password}
                  aria-describedby="password-strength"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div id="password-strength" className="space-y-1.5">
                  <div
                    className="flex gap-1"
                    role="meter"
                    aria-label="Password strength"
                    aria-valuenow={strength.score}
                    aria-valuemin={0}
                    aria-valuemax={5}
                    aria-valuetext={strength.label}
                  >
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          level <= strength.score ? strength.color : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength: <span className="font-medium">{strength.label}</span>
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-sm text-destructive" role="alert">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                  onBlur={() => validateField('confirmPassword')}
                  className="pl-10"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && (
                <p id="confirm-error" className="text-sm text-destructive" role="alert">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <UserPlus className="h-4 w-4" />
                </motion.div>
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
