'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SignupForm } from '@/components/auth/signup-form';
import { SignupFormData } from '@/lib/validation/validation';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { signupUser } from '@/services/auth.service';

export default function SignupPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();

  async function handleSignup(data: SignupFormData) {
    setLoading(true);
    try {
      const response = await signupUser(data);
      login(response.user);
      toast.success('Account created!', {
        description: 'Welcome to FurnishVista',
      });
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      toast.error('Signup failed', { description: message });
    } finally {
      setLoading(false);
    }
  }

  return <SignupForm onSubmit={handleSignup} isLoading={isLoading} />;
}

