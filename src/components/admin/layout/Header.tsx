'use client';

import React from 'react';
import { User, Bell, Search } from 'lucide-react';
import { auth } from '@/lib/firebase';

export default function Header() {
  const user = auth?.currentUser;

  return (
    <header className="h-16 border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Search Bar (Placeholder for UI) */}
      <div className="flex-1 max-w-md relative group hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-accent transition-colors" />
        <input 
          type="text" 
          placeholder="Search something..." 
          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-full pl-10 pr-4 py-1.5 text-sm text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <button className="p-2 rounded-full text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-neutral-950" />
        </button>

        <div className="h-6 w-px bg-neutral-800 mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-neutral-200">{user?.displayName || 'Admin'}</p>
            <p className="text-xs text-neutral-500 lowercase">{user?.email || 'admin@rapidforge.io'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden">
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-neutral-400" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
