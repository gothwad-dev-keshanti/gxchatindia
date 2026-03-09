import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, Camera, Mic, Image as ImageIcon, Heart, Send } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { auth, db } from '../firebase.ts';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';

export default function ChatScreen() {
  const { id: receiverId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiver, setReceiver] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatId = [auth.currentUser?.uid, receiverId].sort().join('_');

  useEffect(() => {
    if (!receiverId) return;

    // Fetch receiver info
    const fetchReceiver = async () => {
      const docRef = doc(db, "users", receiverId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReceiver(docSnap.data());
      }
    };
    fetchReceiver();

    // Listen for messages
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      
      // Sort in-memory to avoid composite index requirement
      msgs.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeA - timeB;
      });

      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [receiverId, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, "messages"), {
        chatId,
        senderId: auth.currentUser.uid,
        receiverId,
        text: newMessage,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {/* Header */}
      <div className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b border-zinc-100 bg-white">
        <div className="flex items-center gap-4">
          <Link to="/">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <img 
              src={receiver?.photoURL || `https://picsum.photos/seed/${receiverId}/100/100`} 
              className="w-8 h-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{receiver?.username || 'Loading...'}</span>
              <span className="text-[10px] text-zinc-500">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Camera size={24} />
          <MoreVertical size={24} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#efe7de] relative">
        {/* Subtle WhatsApp-style pattern overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://i.pinimg.com/originals/ab/ab/60/abab60fec0a3699933390f77239082f0.png")', backgroundSize: '400px' }}></div>
        
        <div className="relative z-10 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.senderId === auth.currentUser?.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] px-3 py-1.5 rounded-2xl text-[15px] shadow-sm relative ${
                  msg.senderId === auth.currentUser?.uid 
                    ? 'bg-[#dcf8c6] text-zinc-800 rounded-tr-none' 
                    : 'bg-white text-zinc-800 rounded-tl-none border border-zinc-200/50'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <div className="flex justify-end items-center gap-1 mt-0.5">
                  <span className="text-[10px] text-zinc-400">
                    {msg.timestamp?.toDate() ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                  {msg.senderId === auth.currentUser?.uid && (
                    <div className="flex">
                      <div className="w-3 h-3 text-blue-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 left-0 right-0 z-50 p-4 border-t border-zinc-100 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-zinc-100 rounded-full px-4 py-2 flex-1">
            <input 
              type="text" 
              placeholder="Message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
            <div className="flex items-center gap-3 text-zinc-500">
              <ImageIcon size={20} className="cursor-pointer hover:text-zinc-800" />
              <Mic size={20} className="cursor-pointer hover:text-zinc-800" />
            </div>
          </div>
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-500 p-2.5 rounded-full text-white disabled:opacity-50 transition-opacity"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
