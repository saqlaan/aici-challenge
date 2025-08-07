import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary-600 text-white p-4 py-0 h-[65px] items-center flex">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Todo App
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span>Welcome, {user.user_email}!</span>
              <Link href="/todos" className="hover:text-primary-200">
                My Todos
              </Link>
              <button
                onClick={logout}
                className="bg-primary-700 hover:bg-primary-800 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-primary-200">
                Login
              </Link>
              <Link href="/register" className="hover:text-primary-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
