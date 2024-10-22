import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './input';

// Define the props for the PasswordInput component
interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// Use forwardRef to pass the ref to the Input component
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref} // Forward the ref here
          type={isVisible ? 'text' : 'password'}
          className={`pr-10 ${className}`}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
          onClick={() => setIsVisible(!isVisible)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    );
  }
);

// Set a display name for easier debugging
PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
