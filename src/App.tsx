import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.ts';
import HomeScreen from '../screen/HomeScreen.tsx';
import ExploreScreen from '../screen/ExploreScreen.tsx';
import ProfileScreen from '../screen/ProfileScreen.tsx';
import EditProfileScreen from '../screen/EditProfileScreen.tsx';
import StatusScreen from '../screen/StatusScreen.tsx';
import CallsScreen from '../screen/CallsScreen.tsx';
import SettingsScreen from '../screen/SettingsScreen.tsx';
import LoginScreen from '../user/LoginScreen.tsx';
import SignupScreen from '../user/SignupScreen.tsx';
import VerifyEmailScreen from '../user/VerifyEmailScreen.tsx';
import CompleteProfileScreen from '../user/CompleteProfileScreen.tsx';
import MessagesListScreen from '../screen/MessagesListScreen.tsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.ts';
import ChatScreen from '../screen/ChatScreen.tsx';
import ReelsScreen from '../screen/ReelsScreen.tsx';
import AdminDashboard from '../admin/AdminDashboard.tsx';
import CreatePostScreen from '../screen/CreatePostScreen.tsx';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [splashLoading, setSplashLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setAuthLoading(false);
    });

    const timer = setTimeout(() => {
      setSplashLoading(false);
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const loading = authLoading || splashLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex-1 flex flex-col items-center justify-center">
          <img 
            src="https://i.ibb.co/4RFKFmPR/file-00000000bf907207abbf3e9db6cfe8a1.png" 
            alt="GxChat India Logo" 
            className="w-24 h-24 mb-4 object-contain"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-3xl font-bold italic font-serif text-zinc-800">GxChat India</h1>
        </div>
        <div className="pb-12 flex flex-col items-center gap-1">
          <span className="text-zinc-400 text-sm font-medium">from</span>
          <span className="text-zinc-800 font-bold tracking-widest uppercase text-xs">Gothwad technologies</span>
          <span className="text-zinc-400 text-[10px] uppercase tracking-tighter mt-1">made in india</span>
        </div>
      </div>
    );
  }

  // Guard Logic
  const needsVerification = user && !user.emailVerified && !user.providerData.some((p: any) => p.providerId === 'google.com');
  const needsProfileCompletion = user && !userData && !authLoading;

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={
            !user ? <Navigate to="/login" /> : 
            needsVerification ? <Navigate to="/verify-email" /> :
            needsProfileCompletion ? <Navigate to="/complete-profile" /> :
            <HomeScreen />
          } />
          
          <Route path="/verify-email" element={
            user && !user.emailVerified ? <VerifyEmailScreen /> : <Navigate to="/" />
          } />

          <Route path="/complete-profile" element={
            user && !userData ? <CompleteProfileScreen /> : <Navigate to="/" />
          } />
          <Route path="/status" element={user ? <StatusScreen /> : <Navigate to="/login" />} />
          <Route path="/explore" element={user ? <ExploreScreen /> : <Navigate to="/login" />} />
          <Route path="/calls" element={user ? <CallsScreen /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <SettingsScreen /> : <Navigate to="/login" />} />
          <Route path="/reels" element={user ? <ReelsScreen /> : <Navigate to="/login" />} />
          <Route path="/create" element={user ? <CreatePostScreen /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfileScreen /> : <Navigate to="/login" />} />
          <Route path="/edit-profile" element={user ? <EditProfileScreen /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <SignupScreen /> : <Navigate to="/" />} />
          <Route path="/messages" element={user ? <MessagesListScreen /> : <Navigate to="/login" />} />
          <Route path="/chat/:id" element={user ? <ChatScreen /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user ? <AdminDashboard /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
