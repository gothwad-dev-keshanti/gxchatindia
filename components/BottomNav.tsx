import React from 'react';
import { MessageSquare, CircleDashed, Search, Phone, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { icon: MessageSquare, path: '/', label: 'Chats' },
    { icon: CircleDashed, path: '/status', label: 'Status' },
    { icon: Search, path: '/explore', label: 'Search' },
    { icon: Phone, path: '/calls', label: 'Calls' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all"
          >
            <Icon 
              size={24} 
              className={isActive ? 'text-blue-600' : 'text-zinc-400'} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={`text-[10px] font-bold ${isActive ? 'text-blue-600' : 'text-zinc-400'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
