import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { auth, db } from '../firebase.ts';
import TopNav from '../components/TopNav.tsx';
import BottomNav from '../components/BottomNav.tsx';
import { Link } from 'react-router-dom';
import { Search, UserPlus, Sparkles, TrendingUp } from 'lucide-react';

export default function ExploreScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        
        // Fetch all users (for search)
        const allUsersQuery = query(usersRef, where("uid", "!=", auth.currentUser?.uid));
        const allUsersSnapshot = await getDocs(allUsersQuery);
        const allUsersList = allUsersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(allUsersList);

        // Fetch top 21 newest users (recommended) - fetch 21 to ensure we get 20 if current user is in the list
        const recommendedQuery = query(
          usersRef, 
          orderBy("createdAt", "desc"),
          limit(21)
        );
        const recommendedSnapshot = await getDocs(recommendedQuery);
        const recommendedList = recommendedSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...(doc.data() as any)
          }))
          .filter((user: any) => user.uid !== auth.currentUser?.uid)
          .slice(0, 20);
        
        setRecommendedUsers(recommendedList);

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
    <div className="min-h-screen pb-24 pt-16 w-full bg-zinc-50">
      <TopNav />
      
      {/* Search Bar */}
      <div className="px-4 my-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search people in GxChat India..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {searchTerm ? (
        /* Search Results */
        <div className="px-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Search Results</h3>
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <Link 
                  to={`/chat/${user.uid}`} 
                  key={user.uid} 
                  className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0"
                >
                  <img 
                    src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} 
                    className="w-12 h-12 rounded-full object-cover border border-zinc-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-zinc-900">{user.username}</h4>
                    <p className="text-xs text-zinc-500">{user.fullName}</p>
                  </div>
                  <UserPlus size={18} className="text-blue-500" />
                </Link>
              ))
            ) : (
              <p className="p-10 text-center text-sm text-zinc-500">No users found.</p>
            )}
          </div>
        </div>
      ) : (
        /* Recommended Section */
        <div className="px-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-orange-500" />
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Recommended for you</h3>
          </div>
          
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden mb-6">
            {loading ? (
              <div className="flex justify-center p-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : recommendedUsers.length > 0 ? (
              recommendedUsers.map((user, index) => (
                <Link 
                  to={`/chat/${user.uid}`} 
                  key={user.uid} 
                  className="flex items-center gap-4 px-4 py-4 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0"
                >
                  <div className="relative">
                    <img 
                      src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} 
                      className="w-14 h-14 rounded-full object-cover border border-zinc-100"
                      referrerPolicy="no-referrer"
                    />
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-bold px-1 rounded-full border border-white">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[15px] font-bold text-zinc-900">{user.username}</h4>
                    <p className="text-xs text-zinc-500">{user.fullName || 'New member'}</p>
                  </div>
                  <button className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                    Chat
                  </button>
                </Link>
              ))
            ) : (
              <p className="p-10 text-center text-sm text-zinc-500">No recommendations yet.</p>
            )}
          </div>

          {/* Trending Section */}
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-blue-500" />
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Trending in GxChat</h3>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 text-center mb-6">
            <p className="text-sm text-zinc-500">Discover what's happening in GxChat India.</p>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
