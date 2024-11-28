import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function UserMenu() {
  const { user, signIn, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) {
    return (
      <button 
        onClick={signIn}
        className="btn-primary flex items-center gap-2"
      >
        <UserIcon className="w-4 h-4" />
        Sign In
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg"
      >
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-gray-600" />
          </div>
        )}
        <span className="text-sm font-medium">{user.displayName}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <button 
            onClick={() => {
              signOut();
              setShowDropdown(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </div>
          </button>
        </div>
      )}
    </div>
  );
} 