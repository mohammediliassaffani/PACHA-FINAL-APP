import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/ui/input-password';
import { formSchema, useLogin } from '@/services/auth';
import { useAuthStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

type LoginFormData = z.infer<typeof formSchema>;
type Props = {
  setIsRestPassword: (val: boolean) => void;
  allHassPassword: boolean;
  loadIsAllHasPassword: boolean;
};
export const LoginForm: React.FC<Props> = ({
  setIsRestPassword,
  allHassPassword,
  loadIsAllHasPassword,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const { setUser, setTokens } = useAuthStore();

  const onSubmit = async (data: LoginFormData) => {
    mutate(data, {
      onSuccess: (data) => {
        setTokens(data.tokens);
        setUser(data.user);
        navigate('/dashboard');
      },
    });
  };

  const handleGoToRestPassword = () => {
    setIsRestPassword(true);
  };

  return (
    <motion.div
      className="w-full max-w-md space-y-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold">Nice to see you again</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <Input
              id="email"
              type="email"
              placeholder="Email or phone number"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="relative">
            <PasswordInput
              id="password"
              placeholder="Enter password"
              {...register('password')}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isSubmitting || isPending ? 'Signing in...' : 'Sign in'}
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
          {allHassPassword && !loadIsAllHasPassword && (
            <div className="text-center mt-4">
              <Button
                type="button"
                variant={'ghost'}
                onClick={handleGoToRestPassword}
                className="w-full"
              >
                Reset Password
              </Button>
            </div>
          )}
        </div>
      </form>
    </motion.div>
  );
};
