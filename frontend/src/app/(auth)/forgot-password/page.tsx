'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { ForgotPasswordFormData } from '@/lib/validation/validation';
import { requestPasswordReset } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleReset(data: ForgotPasswordFormData) {
    setIsLoading(true);
    try {
      await requestPasswordReset(data.email);
      toast.success('Reset link sent', {
        description: 'Check your email for a password reset link',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error('Request failed', { description: message });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return <ForgotPasswordForm onSubmit={handleReset} isLoading={isLoading} />;
}

