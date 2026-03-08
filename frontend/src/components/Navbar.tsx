import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/slices/authSlice';
import { LayoutDashboard, User, LogOut, CheckSquare } from 'lucide-react';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { authUser } = useAppSelector((state) => state.auth);

  if (!authUser) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <CheckSquare className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-gray-900 hidden sm:block">
              TASK<span className="text-blue-600">FLOW</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive('/')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard size={18} />
              <span className="hidden md:inline">Dashboard</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive('/profile')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <User size={18} />
              <span className="hidden md:inline">Profile</span>
            </Link>

            <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>

            {/* Logout Button */}
            <button
              onClick={() => dispatch(logout())}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
