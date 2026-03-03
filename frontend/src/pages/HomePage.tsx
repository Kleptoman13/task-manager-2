import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/slices/authSlice';

export default function HomePage() {
  const dispatch = useAppDispatch();

  const { authUser } = useAppSelector((state) => state.auth);

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(logout());
  };

  return (
    <div>
      <button
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center transition-colors"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
