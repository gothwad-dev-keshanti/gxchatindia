import React from 'react';
import { Camera, Search, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopNav() {
  return (
    <div className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-100 px-4 h-16 flex justify-between items-center z-50">
      <div className="flex items-center gap-3">
        <div className="p-2 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer">
          <Camera size={24} className="text-zinc-800" />
        </div>
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="https://i.ibb.co/4RFKFmPR/file-00000000bf907207abbf3e9db6cfe8a1.png" 
            alt="GxChat India Logo" 
            className="w-9 h-9 object-contain"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-xl font-bold tracking-tight italic font-serif text-zinc-900">GxChat India</h1>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="p-2 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer">
          <Search size={22} className="text-zinc-800" />
        </div>
        <div className="p-2 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer">
          <MoreVertical size={22} className="text-zinc-800" />
        </div>
      </div>
    </div>
  );
}
