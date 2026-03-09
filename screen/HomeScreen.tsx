import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase.ts';
import TopNav from '../components/TopNav.tsx';
import BottomNav from '../components/BottomNav.tsx';
import { Link } from 'react-router-dom';
import { Search, Edit, Plus } from 'lucide-react';

export default function HomeScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        // Get all users except current user
        const q = query(usersRef, where("uid", "!=", auth.currentUser?.uid));
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 pt-16 w-full bg-white">
      <TopNav />
      
      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Chat List Title */}
      <div className="px-4 py-2 flex justify-between items-center">
        <h2 className="font-bold text-lg text-zinc-900">Messages</h2>
        <div className="flex gap-4 text-blue-500 text-sm font-bold">
          <span className="cursor-pointer hover:opacity-70">Edit</span>
        </div>
      </div>

      {/* User List (Chats) */}
      <div className="flex flex-col">
        {loading ? (
          <div className="flex justify-center p-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <Link 
              to={`/chat/${user.uid}`} 
              key={user.uid} 
              className="flex items-center gap-4 px-4 py-3.5 hover:bg-zinc-50 transition-colors group"
            >
              <div className="relative">
                <img 
                  src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} 
                  alt={user.username}
                  className="w-14 h-14 rounded-full object-cover border border-zinc-100 shadow-sm group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 border-b border-zinc-50 pb-3.5">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="text-[15px] font-bold text-zinc-900">{user.username}</h3>
                  <span className="text-[11px] text-zinc-400">12:45 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-zinc-500 truncate max-w-[200px]">
                    {user.fullName || 'Tap to start chatting'}
                  </p>
                  <div className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    2
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <p className="text-zinc-500 text-sm">No users found to chat with.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[450px] pointer-events-none z-40">
        <div className="flex justify-end px-6">
          <button className="p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-all active:scale-95 pointer-events-auto">
            <Plus size={24} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
