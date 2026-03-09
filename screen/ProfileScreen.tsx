import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  Mail, 
  Camera,
  QrCode,
  Image as ImageIcon,
  FileText,
  Star,
  ChevronRight
} from 'lucide-react';
import BottomNav from '../components/BottomNav.tsx';
import { auth, db } from '../firebase.ts';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchUserData();
  }, []);

  const utilityItems = [
    { icon: ImageIcon, label: 'Media', count: '0', color: 'bg-blue-50 text-blue-600' },
    { icon: FileText, label: 'Files', count: '0', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Star, label: 'Starred Messages', count: '0', color: 'bg-orange-50 text-orange-600' },
  ];

  const DEFAULT_LOGO = "https://cdn-icons-png.flaticon.com/512/2590/2590488.png";

  return (
    <div className="pb-24 max-w-lg mx-auto bg-white min-h-screen">
      {/* Professional Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-zinc-100 px-4 h-20 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-zinc-900">{userData?.username || 'profile'}</h1>
          <span className="text-[10px] text-zinc-400 font-medium">{auth.currentUser?.email}</span>
        </div>
        <div className="flex gap-4">
          <QrCode size={24} className="text-zinc-800 cursor-pointer" />
          <Link to="/settings">
            <Settings size={24} className="text-zinc-800 cursor-pointer" />
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-start gap-8 mb-8">
          {/* Left: Large Logo */}
          <div className="relative">
            <div className="p-[4px] rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-100">
              <div className="p-[3px] bg-white rounded-full">
                <img 
                  src={userData?.photoURL || DEFAULT_LOGO} 
                  className="w-28 h-28 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <button 
              onClick={() => navigate('/edit-profile')}
              className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full text-white border-4 border-white shadow-lg"
            >
              <Camera size={14} />
            </button>
          </div>
          
          {/* Right: Stats and Edit Button */}
          <div className="flex-1 pt-2">
            <div className="flex justify-between mb-6 px-2">
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-zinc-900">{userData?.followers?.length || 0}</span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-zinc-900">{userData?.following?.length || 0}</span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Following</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/edit-profile')}
              className="w-full py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold transition-all hover:bg-zinc-800 shadow-lg shadow-zinc-100 active:scale-[0.98]"
            >
              Edit Profile
            </button>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-1">{userData?.fullName || 'GxChat User'}</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            {userData?.bio || 'Hey there! I am using GxChat India to connect with friends.'}
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-bold transition-all hover:bg-zinc-200 active:scale-[0.98]">
            Share Profile
          </button>
          <button className="px-4 py-3 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-bold transition-all hover:bg-zinc-200 active:scale-[0.98]">
            ...
          </button>
        </div>
      </div>

      {/* Utility Sections (Replacing Instagram Tabs) */}
      <div className="mt-4 px-4 space-y-3">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 ml-1">Personal Space</h3>
        {utilityItems.map((item) => (
          <button 
            key={item.label}
            className="w-full flex items-center justify-between p-4 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-zinc-900">{item.label}</span>
                <span className="text-[10px] text-zinc-400 font-medium">{item.count} items</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
