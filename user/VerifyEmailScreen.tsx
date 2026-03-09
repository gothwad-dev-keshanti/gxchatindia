import React, { useState, useEffect } from 'react';
import { auth } from '../firebase.ts';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, LogOut } from 'lucide-react';

export default function VerifyEmailScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        clearInterval(checkVerification);
        navigate('/');
      }
    }, 3000);

    return () => clearInterval(checkVerification);
  }, [navigate]);

  const handleResend = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await sendEmailVerification(auth.currentUser);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 bg-white">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
            <Mail size={40} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-900">Verify your email</h1>
          <p className="text-zinc-500 text-sm">
            We've sent a verification link to <span className="font-semibold text-zinc-900">{auth.currentUser?.email}</span>. 
            Please click the link in your email to continue.
          </p>
        </div>

        {message && <p className="text-emerald-600 text-sm font-medium">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-3 pt-4">
          <button 
            onClick={handleResend}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : 'Resend Email'}
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-zinc-500 font-medium py-2 hover:text-zinc-800 transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Can't find the email? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
}
