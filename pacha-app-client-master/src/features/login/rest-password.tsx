import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/ui/input-password';
import {
  queryKey,
  RestFormData,
  restformSchema,
  useRestPassword,
} from '@/services/auth';
import { useAuthStore } from '@/store';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  setIsRestPassword: (val: boolean) => void;
};
export const RestForm: React.FC<Props> = ({ setIsRestPassword }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestFormData>({
    resolver: zodResolver(restformSchema),
    defaultValues: {
      email: '',
      newPassword: '',
    },
  });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useRestPassword();
  const {} = useAuthStore();
  const handleGoBack = () => {
    setIsRestPassword(false);
  };
  const onSubmit = async (data: RestFormData) => {
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKey.allHasPass });
        handleGoBack();
      },
    });
  };

  return (
    <motion.div
      className="w-full max-w-md space-y-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold">change you password</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <Input
              id="email"
              type="email"
              placeholder="Enter your Email"
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
              placeholder="Enter new password"
              {...register('newPassword')}
              aria-invalid={errors.newPassword ? 'true' : 'false'}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.newPassword.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Button
            type="submit"
            variant={'default'}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Change Password'
            )}
          </Button>
          <div className="text-center mt-4">
            <Button
              type="button"
              variant={'ghost'}
              onClick={handleGoBack}
              className="w-full"
            >
              Go to signIn
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};
