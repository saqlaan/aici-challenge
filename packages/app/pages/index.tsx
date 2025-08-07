import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/todos');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Welcome to Todo App
      </h1>
      
      {!user && (
        <div className="space-y-4">
          <p className="text-lg text-gray-600 mb-8">
            Please login or register to manage your todos
          </p>
          
          <div className="space-x-4">
            <Link href="/login">
              <button className="btn-primary">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-secondary">
                Register
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
