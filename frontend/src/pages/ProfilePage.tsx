import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { Mail, Calendar, Camera, Loader2 } from 'lucide-react';
import { updateProfile } from '../store/slices/authSlice';

import avatarPlaceholder from '../assets/avatar-placeholder.png';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { authUser } = useAppSelector((state) => state.auth);

  const [isUpdating, setIsUpdating] = useState(false);

  if (!authUser) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result as string;
      setIsUpdating(true);

      await dispatch(updateProfile({ avatar_url: base64Image }));

      setIsUpdating(false);
    };
  };

  console.log('Данные пользователя:', authUser);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

        <div className="px-8 pb-8 text-center">
          <div className="relative -mt-16 mb-4 flex justify-center">
            <div className="relative group">
              {/* Avatar */}
              <img
                src={
                  authUser.avatar_url ? authUser.avatar_url : avatarPlaceholder
                }
                alt="Profile"
                className={`size-32 rounded-full border-4 border-white object-cover bg-gray-100 shadow-md ${isUpdating ? 'opacity-50' : ''}`}
              />

              {/* Buuton of loading */}
              <label
                className={`absolute bottom-0 right-0 p-2.5 bg-blue-600 rounded-full text-white shadow-lg transition-all
                  ${isUpdating ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
              >
                {isUpdating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Camera size={18} />
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdating}
                />
              </label>
            </div>
          </div>

          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            {authUser.name}
          </h1>
          <p className="text-gray-400 text-sm mb-8 font-medium italic">
            Your personal account
          </p>

          <div className="space-y-3 text-left max-w-sm mx-auto">
            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
              <Mail className="text-blue-600" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  Email Address
                </p>
                <p className="text-gray-800 font-semibold">{authUser.email}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
              <Calendar className="text-blue-600" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  Account created
                </p>
                <p className="text-gray-800 font-semibold">
                  {new Date(authUser.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
