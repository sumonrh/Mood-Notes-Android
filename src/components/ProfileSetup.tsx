import React, { useState } from 'react';
import { User, Sparkles, ArrowRight, Heart, Star, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

interface Profile {
  name: string;
  age: string;
  avatar?: string;
  privacyMode?: boolean;
  notificationsEnabled?: boolean;
  dailyReminder?: string;
}

export default function ProfileSetup({ onComplete }: { onComplete: (profile: Profile) => void }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age) {
      onComplete({ 
        name, 
        age, 
        avatar: avatar || undefined,
        privacyMode: false,
        notificationsEnabled: true,
        dailyReminder: '20:00'
      });
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-xl border border-black/5 relative overflow-hidden"
      >
        <div className="text-center mb-6 relative z-10">
          <Logo size={48} className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-app-text tracking-tight">Cozy Sanctuary</h1>
        </div>

        <div className="absolute -top-10 -right-10 w-40 h-40 bg-app-blue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-app-pink/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 text-center mb-10">
          <div className="relative w-24 h-24 mx-auto mb-6 group cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 z-20 cursor-pointer"
            />
            <div className="w-24 h-24 bg-app-bg rounded-[2.5rem] flex items-center justify-center text-4xl shadow-inner border-2 border-white overflow-hidden relative z-10">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="group-hover:opacity-0 transition-opacity">✨</span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={24} className="text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-app-text mb-2">Create Your Account</h1>
          <p className="text-app-muted text-sm px-8">Welcome to your personal sanctuary! 🌿🧘‍♀️</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-app-muted ml-4">What's your name? 🎨</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-app-text transition-colors" size={20} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full pl-14 pr-6 py-4 bg-app-bg/50 border border-black/5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-app-lime/20 focus:bg-white transition-all font-sans text-app-text"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-app-muted ml-4">How old are you? 🎂</label>
            <div className="relative group">
              <Star className="absolute left-5 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-app-text transition-colors" size={20} />
              <input 
                type="number" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age..."
                className="w-full pl-14 pr-6 py-4 bg-app-bg/50 border border-black/5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-app-lime/20 focus:bg-white transition-all font-sans text-app-text"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-app-lime text-app-text rounded-[2rem] font-bold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 group"
          >
            Enter Sanctuary <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-black/5 flex justify-center gap-6 text-app-muted/40">
          <Heart size={20} />
          <Sparkles size={20} />
          <Star size={20} />
        </div>
      </motion.div>
    </div>
  );
}

