import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ui/theme-toggle';
import { BackgroundImage, LoginForm, RestForm } from '@/features/login';
import { useAllHasPassword } from '@/services/auth';

export const LoginPage: React.FC = () => {
  const [isRestPassword, setIsRestPassword] = useState<boolean>(false);
  const { data: allHassPassword, isPending: loadIsAllHasPassword } =
    useAllHasPassword();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Background image for desktop */}
      <BackgroundImage />

      {/* Login form */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'spring', stiffness: 50 }}
      >
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        {isRestPassword ? (
          <RestForm setIsRestPassword={setIsRestPassword} />
        ) : (
          <LoginForm
            allHassPassword={allHassPassword ?? false}
            loadIsAllHasPassword={loadIsAllHasPassword}
            setIsRestPassword={setIsRestPassword}
          />
        )}
      </motion.div>
    </div>
  );
};
