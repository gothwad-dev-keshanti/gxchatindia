import React from 'react';
import { Search, ArrowLeft, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MessagesListScreen() {
  const chats = [
    { id: 1, user: 'alex_gx', lastMsg: 'Sent a reel', time: '1h', avatar: 'https://picsum.photos/seed/user1/100/100', unread: true },
    { id: 2, user: 'sarah_design', lastMsg: 'That looks amazing!', time: '3h', avatar: 'https://picsum.photos/seed/user2/100/100', unread: false },
    { id: 3, user: 'jordan_dev', lastMsg: 'Active 2h ago', time: '5h', avatar: 'https://picsum.photos/seed/user3/100/100', unread: false },
  ];

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-4">
          <Link to="/">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-xl font-bold">alex_gx</h2>
        </div>
        <Edit size={24} />
      </div>

      {/* Search */}
      <div className="px-4 my-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 rounded-xl text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Notes (Stories-like) */}
      <div className="flex overflow-x-auto px-4 py-4 gap-4 no-scrollbar">
        <div className="flex flex-col items-center gap-1 min-w-[70px]">
          <div className="relative">
            <img src="https://picsum.photos/seed/me/100/100" className="w-16 h-16 rounded-full grayscale opacity-50" />
            <div className="absolute -top-2 left-0 bg-white border border-zinc-200 rounded-xl px-2 py-1 text-[10px]">
              Note...
            </div>
          </div>
          <span className="text-[10px] text-zinc-500">Your note</span>
        </div>
      </div>

      {/* Chat List */}
      <div className="mt-4">
        <div className="px-4 flex justify-between items-center mb-4">
          <span className="font-bold">Messages</span>
          <span className="text-blue-500 text-sm font-semibold">Requests</span>
        </div>
        
        {chats.map(chat => (
          <Link to="/chat/1" key={chat.id} className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors">
            <img 
              src={chat.avatar} 
              className="w-14 h-14 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <h3 className={`text-sm ${chat.unread ? 'font-bold' : 'font-medium'}`}>{chat.user}</h3>
              <p className={`text-sm ${chat.unread ? 'text-black font-semibold' : 'text-zinc-500'}`}>
                {chat.lastMsg} • {chat.time}
              </p>
            </div>
            {chat.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
