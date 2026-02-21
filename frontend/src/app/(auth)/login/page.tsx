'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginForm } from '@/components/auth/login-form';
import { LoginFormData } from '@/lib/validation/validation';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { loginUser } from '@/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();

  async function handleLogin(data: LoginFormData) {
    setLoading(true);
    try {
      const response = await loginUser(data);
      login(response.user);
      toast.success('Welcome back!', {
        description: `Signed in as ${response.user.name}`,
      });
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      toast.error('Login failed', { description: message });
    } finally {
      setLoading(false);
    }
  }

  return <LoginForm onSubmit={handleLogin} isLoading={isLoading} />;
}

