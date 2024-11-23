import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';

export default function UserProfile() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-6 mb-8">
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold">{user.displayName}</h2>
          <div className="flex items-center gap-2 text-gray-600 mt-2">
            <Mail className="w-4 h-4" />
            {user.email}
          </div>
          {user.metadata.creationTime && (
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <Calendar className="w-4 h-4" />
              Member since {new Date(user.metadata.creationTime).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Account Settings</h3>
          <div className="space-y-2">
            <button className="btn-secondary w-full justify-start">
              Update Profile
            </button>
            <button className="btn-secondary w-full justify-start">
              Change Password
            </button>
            <button 
              onClick={signOut}
              className="btn-secondary w-full justify-start text-red-600 hover:text-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 