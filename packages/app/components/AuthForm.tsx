import React from 'react';
import Input from './atoms/Input';


interface AuthFormProps {
  formData: {
    user_email: string;
    user_password: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  error?: string;
  children?: React.ReactNode;
}

export const AuthForm  = ({
  formData,
  onChange,
  onSubmit,
  loading = false,
  error = '',
  children,
}: AuthFormProps) => {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        id="user_email"
        name="user_email"
        value={formData.user_email}
        onChange={onChange}
        required
      />

      <Input
        label="Password"
        type="password"
        id="user_password"
        name="user_password"
        value={formData.user_password}
        onChange={onChange}
        required
      />

      {children}
    </form>
  );
};