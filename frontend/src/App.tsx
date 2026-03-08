import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { checkAuth } from './store/slices/authSlice';
import { Loader } from 'lucide-react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';

function App() {
  const dispatch = useAppDispatch();
  const { authUser, isCheckingAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader className="size-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="bottom-right" />
      {authUser && <Navbar />}
      <main className={`flex-1 ${authUser ? 'pt-16' : ''}`}>
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to={'/login'} />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to={'/'} />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to={'/'} />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />}
          />

          <Route path="*" element={<Navigate to={'/'} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
