import React from 'react';
import TopNav from '../components/TopNav.tsx';
import BottomNav from '../components/BottomNav.tsx';
import { Phone, Video, Plus, Search } from 'lucide-react';

export default function CallsScreen() {
  return (
    <div className="min-h-screen pb-24 pt-16 w-full bg-zinc-50">
      <TopNav />
      
      {/* Search Bar */}
      <div className="px-4 my-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search calls..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Recent Calls */}
      <div className="px-4 mb-4">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Recent</h4>
        <div className="flex flex-col gap-4 bg-white rounded-2xl border border-zinc-100 p-10 items-center justify-center text-center">
          <div className="p-4 bg-zinc-50 rounded-full mb-4">
            <Phone size={32} className="text-zinc-300" />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">No call history</h3>
          <p className="text-sm text-zinc-500">Calls you make or receive will appear here.</p>
        </div>
      </div>

      {/* Floating Action */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[450px] pointer-events-none z-40">
        <div className="flex justify-end px-6">
          <button className="p-4 bg-blue-600 text-white rounded-full shadow-xl pointer-events-auto">
            <Plus size={24} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
