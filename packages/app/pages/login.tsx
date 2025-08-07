import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { AuthForm } from '@/components/AuthForm';

const Login = () => {
  const [formData, setFormData] = useState({
    user_email: '',
    user_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, loading: authLoading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/todos');
      return;
    }
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(formData);
      login(response.token, response.user);
      router.push('/todos');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
      <AuthForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} loading={loading} error={error}>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </AuthForm>
      <p className="text-center mt-6 text-gray-600">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary-500 hover:text-primary-600">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;