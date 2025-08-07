import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authService } from '../services/auth';
import { AuthForm } from '@/components/AuthForm';

const Register = () => {
  const [formData, setFormData] = useState({
    user_email: '',
    user_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.register(formData);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
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
      <h1 className="text-3xl font-bold text-center mb-8">Register</h1>
      <AuthForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} loading={loading} error={error}>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </AuthForm>

      <p className="text-center mt-6 text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-500 hover:text-primary-600">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
