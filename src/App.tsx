/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import MoodCalendar from './components/MoodCalendar';
import NotesEditor from './components/NotesEditor';
import TrendAnalysis from './components/TrendAnalysis';
import MoodAdvice from './components/MoodAdvice';
import GeneralNotes from './components/GeneralNotes';
import CozyCorner from './components/CozyCorner';
import ProfileSetup from './components/ProfileSetup';
import ArtTogether from './components/ArtTogether';
import AppGuide from './components/AppGuide';
import { Logo } from './components/Logo';
import { GoogleGenAI, Modality } from "@google/genai";
import { 
  Plus, 
  StickyNote, 
  Heart, 
  Sparkles, 
  Coffee, 
  Palette, 
  Bell, 
  Home, 
  Layout, 
  Trophy, 
  Music, 
  Menu as MenuIcon,
  Search,
  Mic,
  Play,
  User,
  ArrowRight,
  ChevronLeft,
  Shield,
  Clock,
  BellRing,
  Download,
  Lightbulb,
  RefreshCcw,
  Wifi,
  Signal,
  Battery,
  Zap,
  Volume2,
  VolumeX,
  Smartphone,
  History,
  Cloud
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import GooglePlayConsole from './components/GooglePlayConsole.tsx';

interface MoodEntry {
  date: string;
  mood: number;
  note: string;
}

interface Meal {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  name: string;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  color: string;
  url: string;
}

interface Profile {
  name: string;
  age: string;
  avatar?: string;
  privacyMode?: boolean;
  passcode?: string;
  notificationsEnabled?: boolean;
  dailyReminder?: string;
}

type ViewType = 'home' | 'mindfulness' | 'achievements' | 'music' | 'menu' | 'journal' | 'notes' | 'art' | 'guide';
type MenuSubView = 'main' | 'account' | 'privacy' | 'notifications' | 'googleplay';

const TRACKS: Track[] = [
  { id: '1', title: 'Rainy Night in Tokyo', artist: 'Lo-fi Beats', duration: '3:45', color: 'bg-app-blue', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'Forest Whispers', artist: 'Nature Sounds', duration: '5:20', color: 'bg-app-lime', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'Morning Coffee', artist: 'Acoustic Guitar', duration: '4:15', color: 'bg-app-orange', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: '4', title: 'Deep Space', artist: 'Ambient Synth', duration: '10:00', color: 'bg-app-lavender', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: '5', title: 'Smooth Jazz Mix', artist: 'Sanctuary Curations', duration: '4:30', color: 'bg-app-pink', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: '6', title: 'Ocean Waves', artist: 'Nature Sounds', duration: '8:00', color: 'bg-app-blue', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: '7', title: 'Sunset Drive', artist: 'Synthwave', duration: '4:50', color: 'bg-app-orange', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: '8', title: 'Midnight Study', artist: 'Lo-fi Beats', duration: '3:20', color: 'bg-app-lavender', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
  { id: '9', title: 'Celestial Piano', artist: 'Sanctuary Curations', duration: '6:15', color: 'bg-app-blue', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
  { id: '10', title: 'Zen Flute', artist: 'Nature Sounds', duration: '7:30', color: 'bg-app-lime', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
  { id: '11', title: 'Cosmic Drift', artist: 'Ambient Synth', duration: '12:00', color: 'bg-app-lavender', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
  { id: '12', title: 'Rainy Cafe', artist: 'Lo-fi Beats', duration: '4:00', color: 'bg-app-orange', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
  { id: '13', title: 'Window Rain', artist: 'Nature Sounds', duration: '5:30', color: 'bg-app-blue', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' },
  { id: '14', title: 'Study Session', artist: 'Lo-fi Beats', duration: '6:00', color: 'bg-app-lime', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3' },
  { id: '15', title: 'Binaural Focus', artist: 'Sanctuary Curations', duration: '15:00', color: 'bg-app-lavender', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '16', title: 'Classical Flow', artist: 'Acoustic Guitar', duration: '4:45', color: 'bg-app-pink', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: '17', title: 'Deep Concentration', artist: 'Binaural Beats', duration: '60:00', color: 'bg-app-blue', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: '18', title: 'Soft Piano', artist: 'Focus Solo', duration: '5:00', color: 'bg-app-orange', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: '19', title: 'White Noise Rain', artist: 'Nature Focus', duration: '10:00', color: 'bg-app-lime', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: '20', title: 'Cosmic Alpha', artist: 'Ambient Focus', duration: '15:00', color: 'bg-app-lavender', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' }
];

export default function App() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [view, setView] = useState<ViewType>('home');
  const [menuSubView, setMenuSubView] = useState<MenuSubView>('main');
  const [activeTab, setActiveTab] = useState<'Activity' | 'Mood' | 'Food' | 'Sleep'>('Activity');
  const [profile, setProfile] = useState<Profile | null>(null);

  // Android Virtual Hardware State
  const [systemTime, setSystemTime] = useState('09:41');
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);
  const [wifiOn, setWifiOn] = useState(true);
  const [cellularOn, setCellularOn] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState(70);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);
  const [activeSystemNotification, setActiveSystemNotification] = useState<{title: string, text: string} | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hrs = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      setSystemTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        if (isCharging) {
          return prev < 100 ? prev + 1 : 100;
        } else {
          return prev > 1 ? prev - 1 : 1;
        }
      });
    }, 30000); // Visual clock tick battery every 30 seconds
    return () => clearInterval(interval);
  }, [isCharging]);

  useEffect(() => {
    if (activeSystemNotification) {
      const timer = setTimeout(() => {
        setActiveSystemNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeSystemNotification]);

  const handlePushNotificationSim = () => {
    const notifications = [
      { title: "Cozy Notification 🏠", text: "Water reminder: Take a sip of water to refresh your body." },
      { title: "Journal Check ✏️", text: "Reflect on your mood today and scribble a brief diary entry." },
      { title: "Mindfulness Reminder 🧘", text: "Take a deep breath and close your eyes for 60 seconds." },
      { title: "Sanctuary Curations 🎵", text: "A new ambient soundtrack is ready: Forest Whispers." }
    ];
    const randomIndex = Math.floor(Math.random() * notifications.length);
    setActiveSystemNotification(notifications[randomIndex]);
    toast.message(notifications[randomIndex].title, {
      description: notifications[randomIndex].text,
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolumeLevel(Number(e.target.value));
    setShowVolumeSlider(true);
  };

  useEffect(() => {
    if (showVolumeSlider) {
      const timer = setTimeout(() => setShowVolumeSlider(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showVolumeSlider, volumeLevel]);

  const handleAndroidBack = () => {
    if (showPasscodeModal) {
      setShowPasscodeModal(null);
      setPasscodeInput('');
      return;
    }
    if (showMealModal) {
      setShowMealModal(null);
      setMealInput('');
      return;
    }
    if (menuSubView !== 'main') {
      setMenuSubView('main');
      return;
    }
    if (view === 'journal' || view === 'notes' || view === 'art' || view === 'guide') {
      setView('home');
      return;
    }
    if (view !== 'home') {
      setView('home');
      return;
    }
    toast.info("Press back again to exit (simulated) 🚪", {
      description: "You have returned to the initial home screen of the android interface.",
    });
  };

  const handleAndroidHome = () => {
    setView('home');
    setMenuSubView('main');
  };

  // Simple trackers for Food and Sleep
  const [waterIntake, setWaterIntake] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMealModal, setShowMealModal] = useState<Meal['type'] | null>(null);
  const [mealInput, setMealInput] = useState('');
  const [meditationCount, setMeditationCount] = useState(0);
  const [goals, setGoals] = useState<{id: string, text: string, completed: boolean}[]>([]);
  const [goalInput, setGoalInput] = useState('');
  const [artCount, setArtCount] = useState(0);
  const [showPasscodeModal, setShowPasscodeModal] = useState<'set' | 'verify' | 'verify_change' | 'set_new' | 'verify_disable' | null>(null);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastNotifiedRef = useRef<string | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW registration failed:', err));
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const savedProfile = localStorage.getItem('cozy_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      // Ensure defaults for old profiles
      const withDefaults = {
        notificationsEnabled: true,
        dailyReminder: '20:00',
        ...parsed
      };
      setProfile(withDefaults);
    } else {
      // Default profile matching the target mockup
      const defaultProfile = {
        name: "Sumon",
        age: "28",
        privacyMode: false,
        notificationsEnabled: true,
        dailyReminder: '20:00'
      };
      setProfile(defaultProfile);
      localStorage.setItem('cozy_profile', JSON.stringify(defaultProfile));
    }

    const savedEntries = localStorage.getItem('cozy_entries');
    if (savedEntries) setEntries(JSON.parse(savedEntries));

    const savedMeals = localStorage.getItem('cozy_meals');
    if (savedMeals) setMeals(JSON.parse(savedMeals));

    const savedWater = localStorage.getItem('cozy_water');
    if (savedWater) setWaterIntake(JSON.parse(savedWater));

    const savedSleep = localStorage.getItem('cozy_sleep');
    if (savedSleep) setSleepHours(JSON.parse(savedSleep));

    const savedMeditation = localStorage.getItem('cozy_meditation');
    if (savedMeditation) setMeditationCount(JSON.parse(savedMeditation));

    const savedGoals = localStorage.getItem('cozy_goals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));

    const savedArt = localStorage.getItem('cozy_art_gallery');
    if (savedArt) setArtCount(JSON.parse(savedArt).length);
  }, []);

  const handleResetTrackers = () => {
    setMeals([]);
    setWaterIntake(0);
    setSleepHours(0);
    setMeditationCount(0);
    toast.success("Trackers reset! ✨", {
      description: "Your daily progress has been cleared.",
      icon: <RefreshCcw className="text-app-lime" size={18} />,
    });
  };

  useEffect(() => {
    localStorage.setItem('cozy_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('cozy_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('cozy_water', JSON.stringify(waterIntake));
  }, [waterIntake]);

  useEffect(() => {
    localStorage.setItem('cozy_sleep', JSON.stringify(sleepHours));
  }, [sleepHours]);

  useEffect(() => {
    localStorage.setItem('cozy_meditation', JSON.stringify(meditationCount));
  }, [meditationCount]);

  useEffect(() => {
    localStorage.setItem('cozy_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (view !== 'menu') {
      setMenuSubView('main');
    }
  }, [view]);

  useEffect(() => {
    if (profile?.notificationsEnabled && profile?.dailyReminder) {
      const checkNotification = () => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        if (currentTime === profile.dailyReminder && lastNotifiedRef.current !== currentTime) {
          lastNotifiedRef.current = currentTime;
          toast.success("Time for your daily mood check-in! ✨", {
            description: "How are you feeling right now?",
            icon: <Sparkles className="text-app-lime" size={18} />,
          });
        }
      };

      // Run check immediately on mount or profile change
      checkNotification();
      
      const interval = setInterval(checkNotification, 10000); // Check every 10 seconds for better precision
      
      return () => clearInterval(interval);
    }
  }, [profile?.notificationsEnabled, profile?.dailyReminder]);

  const handleProfileComplete = (newProfile: Profile) => {
    setProfile(newProfile);
    localStorage.setItem('cozy_profile', JSON.stringify(newProfile));
  };

  const handleSave = (note: string, mood: number) => {
    const newEntry = {
      date: new Date().toISOString(),
      mood,
      note,
    };
    setEntries([...entries, newEntry]);
    setView('home');
    setActiveTab('Mood');
  };

  const handleAddGoal = () => {
    if (goalInput.trim()) {
      setGoals([...goals, { id: Date.now().toString(), text: goalInput, completed: false }]);
      setGoalInput('');
    }
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };


  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;

  const handleAddMeal = () => {
    if (mealInput && showMealModal) {
      const newMeal: Meal = {
        id: Date.now().toString(),
        type: showMealModal,
        name: mealInput,
      };
      setMeals([...meals, newMeal]);
      setMealInput('');
      setShowMealModal(null);
    }
  };

  const handleTrackPlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handlePlayMix = () => {
    const randomIndex = Math.floor(Math.random() * TRACKS.length);
    handleTrackPlay(TRACKS[randomIndex]);
  };

  const handleUpdateAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result as string;
        const updatedProfile = { ...profile, avatar: newAvatar };
        setProfile(updatedProfile);
        localStorage.setItem('cozy_profile', JSON.stringify(updatedProfile));
      };
      reader.readAsDataURL(file);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Great afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "☀️";
    if (hour >= 12 && hour < 17) return "🌤️";
    if (hour >= 17 && hour < 21) return "🌅";
    return "🌙";
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F5F2] text-app-text font-sans flex items-center justify-center p-0 md:p-6 relative select-none overflow-x-hidden">
      
      {/* Main Virtual Smartphone Device (Aesthetic Frame) */}
      <div className="relative w-full md:w-[412px] md:h-[845px] md:rounded-[48px] md:border-[10px] md:border-[#2C2D35] md:bg-[#F5F5F2] md:shadow-[0_25px_50px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col shrink-0">
        
        {/* Modern Front Camera Punch-Hole */}
        <div className="hidden md:block absolute top-[11px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-zinc-900 rounded-full z-[100] border border-zinc-800" />

        {/* Dynamic Android Virtual Status Bar */}
        <div className="w-full h-11 px-6 flex justify-between items-center bg-[#F5F5F2] text-app-text z-[90] text-xs font-semibold select-none shrink-0 pt-3.5 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-xs text-[#1A1A1A]">10:17</span>
            <div className="flex items-center gap-1 opacity-70">
              <Cloud size={12} className="text-[#1A1A1A]" />
              <Smartphone size={12} className="text-[#1A1A1A]" />
              <div className="w-1 h-1 bg-[#1A1A1A] rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#1A1A1A]">
            <Signal size={13} className="opacity-80" />
            <Wifi size={13} className="opacity-80" />
            <div className="flex items-center relative gap-0.5 bg-black/10 rounded px-1.5 py-0.5 min-w-[28px] h-5 justify-center">
              <span className="text-[10px] font-black leading-none text-[#1a1a1a]">72</span>
            </div>
          </div>
        </div>

        {/* Volume Level Popup Overlay */}
        {showVolumeSlider && (
          <div className="absolute top-16 right-4 bg-zinc-900/95 text-white p-3 rounded-2xl flex items-center gap-2 shadow-xl z-[150] backdrop-blur-sm select-none">
            {volumeLevel === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <div className="w-24 bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-app-lime h-full animate-pulse" style={{ width: `${volumeLevel}%` }} />
            </div>
          </div>
        )}

        {/* Android Sliding System Notification Toast */}
        {activeSystemNotification && (
          <motion.div
            initial={{ translateY: -100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: -100, opacity: 0 }}
            onClick={() => setActiveSystemNotification(null)}
            className="absolute top-14 left-4 right-4 bg-zinc-950 text-white rounded-3xl p-4 shadow-2xl z-[150] cursor-pointer border border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-app-lime/10 flex items-center justify-center text-app-lime">
                <Bell size={16} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-xs leading-none">{activeSystemNotification.title}</h4>
                <p className="text-[10px] text-white/60 mt-1">{activeSystemNotification.text}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* OVERVIEWS / RECENTS SCREEN */}
        {isRecentsOpen && (
          <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md z-[100] flex flex-col justify-between p-6 text-white select-none">
            <div className="flex justify-between items-center pt-6">
              <h3 className="font-semibold text-white/50 text-xs uppercase tracking-wider">Active Tasks</h3>
              <span className="text-[9px] uppercase font-bold tracking-widest text-app-lime bg-app-lime/10 px-2.5 py-1 rounded-full">Android Memory</span>
            </div>

            <div className="flex flex-col gap-4 my-auto max-w-xs mx-auto w-full">
              <div className="bg-white/5 border border-white/5 rounded-[2rem] p-5 text-left flex justify-between items-center shadow-lg">
                <div>
                  <h4 className="font-bold text-sm text-white">Mood Notes Core</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">Running Process V1.3.0 • Active</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="bg-white/5 border border-white/5 rounded-[2rem] p-5 text-left flex justify-between items-center shadow-lg">
                <div>
                  <h4 className="font-bold text-sm text-white">Ambient Player</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">{isPlaying ? 'Playing Lo-Fi...' : 'Standby / Idle'}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-amber-500" />
              </div>

              <div className="bg-white/5 border border-white/5 rounded-[2rem] p-5 text-left flex justify-between items-center shadow-lg">
                <div>
                  <h4 className="font-bold text-sm text-white">Google GenAI Client</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">gemini-3.5-flash • Connected</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setIsRecentsOpen(false);
                  toast.success("System optimized! 🧹", {
                    description: "Memory cleared successfully.",
                  });
                }}
                className="w-full py-4 bg-red-400/10 text-red-100 hover:bg-red-400/20 font-bold rounded-2xl border border-red-500/10 transition-all active:scale-95 text-xs cursor-pointer"
              >
                Clear All Background Tasks
              </button>
              <button
                onClick={() => setIsRecentsOpen(false)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 font-bold rounded-2xl transition-all active:scale-95 text-xs border border-white/5 cursor-pointer"
              >
                Back to Active App
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE VIEWPORT CONTAINING ACTUAL MOOD-NOTES CORE APP */}
        <div className="flex-1 w-full overflow-y-auto no-scrollbar relative bg-app-bg text-app-text min-h-0">
          <Toaster position="top-center" expand={true} richColors />
          
          {!profile ? (
            <ProfileSetup onComplete={handleProfileComplete} />
          ) : (
            <>
              <div className="min-h-full pb-32">
      {/* App Logo & Branding */}
      <div className="px-6 pt-6 flex items-center gap-2">
        <Logo size={32} />
        <span className="text-sm font-bold tracking-widest uppercase text-app-muted">Cozy Sanctuary</span>
      </div>

      {/* Top Header */}
      <header className="px-6 pt-4 pb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-app-blue ${profile.privacyMode ? 'blur-sm select-none' : ''}`}>
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight">
              {getGreeting()}, <span className={profile.privacyMode ? 'blur-sm select-none' : ''}>{profile.name}</span> {getGreetingEmoji()}
            </h1>
            {profile.privacyMode && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-app-lime uppercase tracking-widest mt-0.5">
                <Shield size={10} /> Privacy Mode Active
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {profile.privacyMode && (
            <button 
              onClick={() => {
                if (profile.passcode) {
                  setShowPasscodeModal('verify');
                } else {
                  const updated = { ...profile, privacyMode: false };
                  setProfile(updated);
                  localStorage.setItem('cozy_profile', JSON.stringify(updated));
                }
              }}
              className="px-3 py-1.5 bg-app-lime/10 text-app-lime rounded-full text-[10px] font-bold uppercase tracking-widest border border-app-lime/20 flex items-center gap-1.5"
            >
              <Shield size={10} /> Disable Privacy
            </button>
          )}
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-black/5">
            <Bell size={20} className="text-app-text" />
          </button>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar">
        {['Activity', 'Mood', 'Food', 'Sleep'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as any);
              setView('home');
            }}
            className={`pill-button whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-app-lime text-app-text shadow-sm' 
                : 'bg-white text-app-muted border border-black/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <main className="px-6 space-y-8">
        {view === 'home' && (
          <div className="space-y-8">
            {activeTab === 'Activity' && (
              <div className={`space-y-8 transition-all duration-500 ${profile.privacyMode ? 'blur-md pointer-events-none select-none' : ''}`}>
                {/* Quick Actions */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Quick Actions</h2>
                    <button 
                      onClick={handleResetTrackers}
                      className="flex items-center gap-2 text-[10px] font-bold text-app-muted uppercase tracking-widest hover:text-app-lime transition-colors"
                    >
                      <RefreshCcw size={12} /> Reset Trackers
                    </button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    <button onClick={() => setView('mindfulness')} className="flex flex-col items-center gap-2 min-w-[80px]">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-app-pink flex items-center justify-center shadow-sm">
                        <Coffee size={24} className="text-app-text" />
                      </div>
                      <span className="text-xs font-bold">Meditate</span>
                    </button>
                    <button onClick={() => setView('journal')} className="flex flex-col items-center gap-2 min-w-[80px]">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-app-orange flex items-center justify-center shadow-sm">
                        <Plus size={24} className="text-app-text" />
                      </div>
                      <span className="text-xs font-bold">Journal</span>
                    </button>
                    <button onClick={() => setView('art')} className="flex flex-col items-center gap-2 min-w-[80px]">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-app-blue flex items-center justify-center shadow-sm">
                        <Palette size={24} className="text-app-text" />
                      </div>
                      <span className="text-xs font-bold">Art</span>
                    </button>
                    <button onClick={() => setView('notes')} className="flex flex-col items-center gap-2 min-w-[80px]">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-app-lavender flex items-center justify-center shadow-sm">
                        <StickyNote size={24} className="text-app-text" />
                      </div>
                      <span className="text-xs font-bold">Notes</span>
                    </button>
                  </div>
                </div>

                {/* Activity Suggestions */}
                <div className="app-card bg-app-lime/20 border-none">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Daily Wisdom</h2>
                    <Sparkles size={20} className="text-app-text" />
                  </div>
                  <MoodAdvice latestEntry={latestEntry} />
                </div>
              </div>
            )}

            {activeTab === 'Mood' && (
              <div className={`space-y-8 transition-all duration-500 ${profile.privacyMode ? 'blur-md pointer-events-none select-none' : ''}`}>
                <div className="app-card overflow-hidden bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Mood History</h2>
                    <button className="text-app-muted">•••</button>
                  </div>
                  <MoodCalendar entries={entries} />
                </div>
                <TrendAnalysis entries={entries} />
              </div>
            )}

            {activeTab === 'Food' && (
              <div className={`space-y-8 transition-all duration-500 ${profile.privacyMode ? 'blur-md pointer-events-none select-none' : ''}`}>
                <div className="app-card bg-app-blue/10 border-none">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Water Intake</h2>
                    <button 
                      onClick={handleResetTrackers}
                      className="text-[10px] font-bold text-app-muted uppercase tracking-widest hover:text-app-blue transition-colors flex items-center gap-1"
                    >
                      <RefreshCcw size={10} /> Reset
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-6 py-4">
                    <div className="text-5xl font-bold text-app-text">{waterIntake} <span className="text-xl text-app-muted">glasses</span></div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}
                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-black/5 text-2xl font-bold"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => setWaterIntake(waterIntake + 1)}
                        className="w-12 h-12 rounded-full bg-app-blue text-white flex items-center justify-center shadow-md text-2xl font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="app-card bg-app-orange/10 border-none">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Meal Log</h2>
                    <button 
                      onClick={handleResetTrackers}
                      className="text-[10px] font-bold text-app-muted uppercase tracking-widest hover:text-app-orange transition-colors flex items-center gap-1"
                    >
                      <RefreshCcw size={10} /> Reset
                    </button>
                  </div>
                  <div className="space-y-3">
                    {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(type => (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-black/5">
                          <span className="font-bold">{type}</span>
                          <button 
                            onClick={() => setShowMealModal(type as any)}
                            className="text-app-orange font-bold text-sm"
                          >
                            + Add
                          </button>
                        </div>
                        <div className="pl-4 space-y-1">
                          {meals.filter(m => m.type === type).map(m => (
                            <div key={m.id} className="text-sm font-medium text-app-text/60 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-app-orange" />
                              {m.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Sleep' && (
              <div className={`space-y-8 transition-all duration-500 ${profile.privacyMode ? 'blur-md pointer-events-none select-none' : ''}`}>
                <div className="app-card bg-app-lavender/20 border-none">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Sleep Tracker</h2>
                    <button 
                      onClick={handleResetTrackers}
                      className="text-[10px] font-bold text-app-muted uppercase tracking-widest hover:text-app-lavender transition-colors flex items-center gap-1"
                    >
                      <RefreshCcw size={10} /> Reset
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-6 py-4">
                    <div className="text-5xl font-bold text-app-text">{sleepHours} <span className="text-xl text-app-muted">hours</span></div>
                    <input 
                      type="range" 
                      min="0" 
                      max="12" 
                      step="0.5"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                      className="w-full h-2 bg-white rounded-full appearance-none cursor-pointer accent-app-lavender"
                    />
                    <div className="text-sm font-bold text-app-muted">Recommended: 7-9 hours</div>
                  </div>
                </div>

                <div className="app-card bg-white border border-black/5">
                  <h2 className="text-xl font-bold mb-4">Sleep Quality</h2>
                  <div className="flex justify-between gap-2">
                    {['😴', '🥱', '😐', '🙂', '🤩'].map((emoji, i) => (
                      <button key={i} className="w-12 h-12 rounded-2xl bg-app-bg flex items-center justify-center text-2xl hover:bg-app-lavender/20 transition-colors">
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'mindfulness' && (
          <div className={`transition-all duration-500 ${profile.privacyMode ? 'blur-md pointer-events-none select-none' : ''}`}>
            <CozyCorner onMeditationComplete={() => setMeditationCount(prev => prev + 1)} />
          </div>
        )}
        {view === 'journal' && (
          <div className={`transition-all duration-500 ${profile.privacyMode ? 'blur-md pointer-events-none select-none' : ''}`}>
            <NotesEditor onSave={handleSave} />
          </div>
        )}
        {view === 'notes' && (
          <div className={`transition-all duration-500 ${profile.privacyMode ? 'blur-md pointer-events-none select-none' : ''}`}>
            <GeneralNotes />
          </div>
        )}
        {view === 'art' && (
          <div className={`transition-all duration-500 ${profile.privacyMode ? 'blur-md pointer-events-none select-none' : ''}`}>
            <ArtTogether onSaveArt={() => setArtCount(prev => prev + 1)} />
          </div>
        )}
        {view === 'guide' && (
          <div className="transition-all duration-500">
            <AppGuide onBack={() => setView('menu')} />
          </div>
        )}
        
        {view === 'achievements' && (
          <div className={`space-y-8 transition-all duration-500 ${profile.privacyMode ? 'blur-md pointer-events-none select-none' : ''}`}>
            <div>
              <h2 className="text-3xl font-bold text-app-text">Your Journey</h2>
              <p className="text-app-muted mt-1">Celebrating every step of your growth... 🏆✨</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Early Bird', icon: '🌅', desc: 'Logged mood before 8 AM', color: 'bg-app-blue', active: entries.some(e => new Date(e.date).getHours() < 8) },
                { title: 'Zen Master', icon: '🧘', desc: '5 meditation sessions', color: 'bg-app-lime', active: meditationCount >= 5 },
                { title: 'Artist', icon: '🎨', desc: 'Created 3 art pieces', color: 'bg-app-orange', active: artCount >= 3 },
                { title: 'Journalist', icon: '✍️', desc: '7 day journal streak', color: 'bg-app-pink', active: entries.length >= 7 },
              ].map((badge, i) => (
                <div key={i} className={`${badge.color} rounded-[2.5rem] p-6 shadow-sm text-center transition-all ${badge.active ? 'opacity-100 scale-100' : 'opacity-40 grayscale scale-95'}`}>
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <h3 className="font-bold text-app-text">{badge.title}</h3>
                  <p className="text-[10px] text-app-text/60 mt-1 uppercase tracking-wider font-bold">{badge.desc}</p>
                </div>
              ))}
            </div>

            <div className="app-card bg-white border border-black/5">
              <h3 className="text-lg font-bold mb-4">Milestones</h3>
              <div className="space-y-4">
                {[
                  { label: 'Total Meditations', value: meditationCount, progress: Math.min(100, (meditationCount / 10) * 100), color: 'bg-app-pink' },
                  { label: 'Journal Entries', value: entries.length, progress: Math.min(100, (entries.length / 10) * 100), color: 'bg-app-orange' },
                  { label: 'Mood Logs', value: entries.length, progress: Math.min(100, (entries.length / 30) * 100), color: 'bg-app-lime' },
                  { label: 'Art Pieces', value: artCount, progress: Math.min(100, (artCount / 3) * 100), color: 'bg-app-orange' },
                  { label: 'Hydration Goal', value: waterIntake, progress: Math.min(100, (waterIntake / 8) * 100), color: 'bg-app-blue' },
                ].map((m, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span>{m.label}</span>
                      <span>{m.value}</span>
                    </div>
                    <div className="h-3 bg-black/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${m.color} transition-all duration-1000`} 
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="app-card bg-white border border-black/5">
              <h3 className="text-lg font-bold mb-4">Goals</h3>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                  placeholder="Set a new goal..."
                  className="flex-1 px-4 py-2 bg-app-bg rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-app-lime/50"
                />
                <button 
                  onClick={handleAddGoal}
                  className="w-10 h-10 bg-app-lime rounded-xl flex items-center justify-center shadow-sm"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-3">
                {goals.length === 0 ? (
                  <p className="text-sm text-app-muted italic text-center py-4">No goals set yet. What's on your mind? ✨</p>
                ) : (
                  goals.map(goal => (
                    <div key={goal.id} className="flex items-center gap-3 p-3 bg-app-bg rounded-2xl border border-black/5 group">
                      <button 
                        onClick={() => toggleGoal(goal.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${goal.completed ? 'bg-app-lime border-app-lime' : 'border-black/10'}`}
                      >
                        {goal.completed && <Plus size={14} className="rotate-45" />}
                      </button>
                      <span className={`flex-1 text-sm font-medium ${goal.completed ? 'line-through text-app-muted' : 'text-app-text'}`}>
                        {goal.text}
                      </span>
                      <button 
                        onClick={() => deleteGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                      >
                        <Plus size={16} className="rotate-45" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
        {view === 'music' && (
          <div className={`space-y-8 transition-all duration-500 ${profile.privacyMode ? 'blur-md pointer-events-none select-none' : ''}`}>
            <div>
              <h2 className="text-3xl font-bold text-app-text">Music Sanctuary</h2>
              <p className="text-app-muted mt-1">Calming sounds for your soul... 🎵✨</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {TRACKS.map((track, i) => (
                <div 
                  key={i} 
                  onClick={() => handleTrackPlay(track)}
                  className={`${track.color} rounded-[2rem] p-6 flex items-center justify-between shadow-sm group cursor-pointer transition-all active:scale-95`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      {currentTrack?.id === track.id && isPlaying ? (
                        <div className="flex gap-1 items-end h-4">
                          <div className="w-1 bg-app-text animate-pulse h-full" />
                          <div className="w-1 bg-app-text animate-pulse h-2/3" />
                          <div className="w-1 bg-app-text animate-pulse h-full" />
                        </div>
                      ) : (
                        <Play size={20} fill="currentColor" className="text-app-text ml-1" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-app-text">{track.title}</h3>
                      <p className="text-xs text-app-text/60">{track.artist}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-app-text/40">{track.duration}</span>
                </div>
              ))}
            </div>

            {currentTrack && (
              <div className="app-card bg-white border border-black/5 p-6 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className={`w-12 h-12 ${currentTrack.color} rounded-2xl flex items-center justify-center`}>
                  <Music size={24} className="text-app-text" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{currentTrack.title}</div>
                  <div className="text-xs text-app-muted">{currentTrack.artist}</div>
                </div>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 bg-app-lime rounded-full flex items-center justify-center shadow-sm"
                >
                  {isPlaying ? <div className="w-3 h-3 bg-app-text rounded-sm" /> : <Play size={16} fill="currentColor" className="text-app-text ml-0.5" />}
                </button>
              </div>
            )}

            <div className="app-card bg-app-pink/20 border-none p-8 text-center">
              <Sparkles size={32} className="mx-auto text-app-pink mb-4" />
              <h3 className="text-xl font-bold mb-2">Curated for You</h3>
              <p className="text-app-text/60 text-sm mb-6">Based on your mood today, we recommend some upbeat jazz.</p>
              <button 
                onClick={handlePlayMix}
                className="bg-white text-app-text font-bold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                Play Mix
              </button>
            </div>
          </div>
        )}

        {view === 'menu' && (
          <div className="space-y-8">
            {menuSubView === 'main' && (
              <>
                <div className="text-center">
                  <Logo size={64} className="mx-auto mb-4" />
                  <div className="relative w-32 h-32 mx-auto mb-6 group">
                    <div className={`w-32 h-32 rounded-[3rem] overflow-hidden border-4 border-white shadow-xl bg-app-blue relative z-10 ${profile.privacyMode ? 'blur-md select-none' : ''}`}>
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    {!profile.privacyMode && (
                      <label className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center bg-black/40 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity">
                        <input type="file" accept="image/*" onChange={handleUpdateAvatar} className="hidden" />
                        <Plus size={32} className="text-white" />
                      </label>
                    )}
                  </div>
                  <h2 className={`text-3xl font-bold text-app-text ${profile.privacyMode ? 'blur-md select-none' : ''}`}>{profile.name}</h2>
                  <p className={`text-app-muted ${profile.privacyMode ? 'blur-md select-none' : ''}`}>{profile.age} years old • Sanctuary Member</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => setView('guide')}
                    className="app-card bg-white border border-black/5 flex items-center justify-between p-6 hover:bg-app-bg transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-app-orange/20 rounded-2xl flex items-center justify-center">
                        <Lightbulb size={24} className="text-app-orange" />
                      </div>
                      <span className="font-bold">How to Use</span>
                    </div>
                    <ArrowRight size={20} className="text-app-muted" />
                  </button>
                  <button 
                    onClick={() => setMenuSubView('account')}
                    className="app-card bg-white border border-black/5 flex items-center justify-between p-6 hover:bg-app-bg transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-app-lime/20 rounded-2xl flex items-center justify-center">
                        <User size={24} className="text-app-lime" />
                      </div>
                      <span className="font-bold">Account Settings</span>
                    </div>
                    <ArrowRight size={20} className="text-app-muted" />
                  </button>
                  <button 
                    onClick={() => setMenuSubView('privacy')}
                    className="app-card bg-white border border-black/5 flex items-center justify-between p-6 hover:bg-app-bg transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-app-pink/20 rounded-2xl flex items-center justify-center">
                        <Heart size={24} className="text-app-pink" />
                      </div>
                      <span className="font-bold">Privacy & Security</span>
                    </div>
                    <ArrowRight size={20} className="text-app-muted" />
                  </button>
                  <button 
                    onClick={() => setMenuSubView('notifications')}
                    className="app-card bg-white border border-black/5 flex items-center justify-between p-6 hover:bg-app-bg transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-app-blue/20 rounded-2xl flex items-center justify-center">
                        <Bell size={24} className="text-app-blue" />
                      </div>
                      <span className="font-bold">Notifications</span>
                    </div>
                    <ArrowRight size={20} className="text-app-muted" />
                  </button>
                  <button 
                    onClick={() => setMenuSubView('googleplay')}
                    className="app-card bg-white border border-black/5 flex items-center justify-between p-6 hover:bg-app-bg transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                        <Smartphone size={24} className="text-amber-500" />
                      </div>
                      <span className="font-bold cursor-pointer">Google Play Publisher</span>
                    </div>
                    <ArrowRight size={20} className="text-app-muted" />
                  </button>
                </div>

                {deferredPrompt && (
                  <button 
                    onClick={handleInstallClick}
                    className="w-full py-5 bg-app-lime text-white rounded-[2rem] font-bold hover:bg-app-lime/90 transition-all flex items-center justify-center gap-2 mb-4 shadow-lg shadow-app-lime/20"
                  >
                    <Download size={20} />
                    Install Sanctuary App
                  </button>
                )}

                <button 
                  onClick={() => {
                    if (profile.privacyMode) return;
                    localStorage.removeItem('cozy_profile');
                    window.location.reload();
                  }}
                  disabled={profile.privacyMode}
                  className={`w-full py-5 rounded-[2rem] font-bold transition-all ${
                    profile.privacyMode 
                      ? 'bg-black/5 text-app-muted cursor-not-allowed' 
                      : 'bg-app-pink/10 text-app-pink hover:bg-app-pink/20'
                  }`}
                >
                  {profile.privacyMode ? '🔒 Sanctuary Locked' : 'Reset Sanctuary'}
                </button>
              </>
            )}

            {menuSubView === 'account' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <button onClick={() => setMenuSubView('main')} className="p-2 hover:bg-black/5 rounded-full">
                    <ChevronLeft size={24} />
                  </button>
                  <h2 className="text-2xl font-bold">Account Settings</h2>
                </div>
                
                <div className="app-card bg-white border border-black/5 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-app-muted uppercase tracking-wider">Display Name</label>
                    <input 
                      type="text" 
                      value={profile.name}
                      onChange={(e) => {
                        const updated = { ...profile, name: e.target.value };
                        setProfile(updated);
                        localStorage.setItem('cozy_profile', JSON.stringify(updated));
                      }}
                      className={`w-full px-4 py-3 bg-app-bg rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-app-lime/50 ${profile.privacyMode ? 'blur-md select-none' : ''}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-app-muted uppercase tracking-wider">Age</label>
                    <input 
                      type="number" 
                      value={profile.age}
                      onChange={(e) => {
                        const updated = { ...profile, age: e.target.value };
                        setProfile(updated);
                        localStorage.setItem('cozy_profile', JSON.stringify(updated));
                      }}
                      className={`w-full px-4 py-3 bg-app-bg rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-app-lime/50 ${profile.privacyMode ? 'blur-md select-none' : ''}`}
                    />
                  </div>
                </div>
                <p className="text-sm text-app-muted px-4 italic">Changes are saved automatically to your local sanctuary.</p>
              </div>
            )}

            {menuSubView === 'privacy' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <button onClick={() => setMenuSubView('main')} className="p-2 hover:bg-black/5 rounded-full">
                    <ChevronLeft size={24} />
                  </button>
                  <h2 className="text-2xl font-bold">Privacy & Security</h2>
                </div>
                
                <div className="app-card bg-white border border-black/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-bold">Private Mode</div>
                      <div className="text-xs text-app-muted">Blur sensitive data in the UI for extra privacy</div>
                    </div>
                    <button 
                      onClick={() => {
                        if (!profile.privacyMode) {
                          // Turning ON: Just toggle it
                          const updated = { ...profile, privacyMode: true };
                          setProfile(updated);
                          localStorage.setItem('cozy_profile', JSON.stringify(updated));
                        } else {
                          // Turning OFF: Check for passcode
                          if (profile.passcode) {
                            setShowPasscodeModal('verify');
                          } else {
                            const updated = { ...profile, privacyMode: false };
                            setProfile(updated);
                            localStorage.setItem('cozy_profile', JSON.stringify(updated));
                          }
                        }
                      }}
                      className={`w-14 h-8 rounded-full transition-colors relative ${profile.privacyMode ? 'bg-app-lime' : 'bg-black/10'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${profile.privacyMode ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  
                  {profile.passcode ? (
                    <div className="pt-4 border-t border-black/5 flex flex-col gap-3">
                      <button 
                        onClick={() => setShowPasscodeModal('verify_change')}
                        className="w-full py-3 bg-app-bg rounded-xl text-app-text text-sm font-bold hover:bg-black/5 transition-all flex items-center justify-center gap-2"
                      >
                        <Shield size={16} /> Change Passcode
                      </button>
                      <button 
                        onClick={() => setShowPasscodeModal('verify_disable')}
                        className="w-full py-3 bg-red-50 rounded-xl text-red-600 text-sm font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Shield size={16} /> Disable Passcode
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-black/5">
                      <button 
                        onClick={() => setShowPasscodeModal('set')}
                        className="w-full py-3 bg-app-blue text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Shield size={16} /> Set Privacy Passcode
                      </button>
                    </div>
                  )}
                </div>
                <div className="app-card bg-app-blue/10 border-none flex items-start gap-4">
                  <Shield className="text-app-blue shrink-0" size={24} />
                  <div className="text-sm text-app-text/80">
                    Your data is stored locally on this device and is never uploaded to our servers.
                  </div>
                </div>
              </div>
            )}

            {menuSubView === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <button onClick={() => setMenuSubView('main')} className="p-2 hover:bg-black/5 rounded-full">
                    <ChevronLeft size={24} />
                  </button>
                  <h2 className="text-2xl font-bold">Notifications</h2>
                </div>
                
                <div className="app-card bg-white border border-black/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-bold">Daily Reminders</div>
                      <div className="text-xs text-app-muted">Get a nudge to log your mood</div>
                    </div>
                    <button 
                      onClick={() => {
                        const updated = { ...profile, notificationsEnabled: !profile.notificationsEnabled };
                        setProfile(updated);
                        localStorage.setItem('cozy_profile', JSON.stringify(updated));
                      }}
                      className={`w-14 h-8 rounded-full transition-colors relative ${profile.notificationsEnabled ? 'bg-app-blue' : 'bg-black/10'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${profile.notificationsEnabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  
                  {profile.notificationsEnabled && (
                    <div className="space-y-4 pt-4 border-t border-black/5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-app-muted uppercase tracking-wider flex items-center gap-2">
                          <Clock size={14} /> Reminder Time
                        </label>
                        <input 
                          type="time" 
                          value={profile.dailyReminder || '20:00'}
                          onChange={(e) => {
                            const updated = { ...profile, dailyReminder: e.target.value };
                            setProfile(updated);
                            localStorage.setItem('cozy_profile', JSON.stringify(updated));
                          }}
                          className="w-full px-4 py-3 bg-app-bg rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-app-blue/50"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          toast.success("Time for your daily mood check-in! ✨", {
                            description: "How are you feeling right now?",
                            icon: <Sparkles className="text-app-lime" size={18} />,
                          });
                        }}
                        className="w-full py-3 bg-app-blue text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <BellRing size={16} /> Send Test Reminder
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {menuSubView === 'googleplay' && (
              <GooglePlayConsole onBack={() => setMenuSubView('main')} />
            )}
          </div>
        )}
      </main>


      {/* Meal Modal */}
      {showMealModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4">Add {showMealModal}</h3>
            <input 
              autoFocus
              type="text" 
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              placeholder="What did you eat?"
              className="w-full px-6 py-4 bg-app-bg rounded-2xl border border-black/5 mb-6 focus:outline-none focus:ring-2 focus:ring-app-orange/50"
              onKeyDown={(e) => e.key === 'Enter' && handleAddMeal()}
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowMealModal(null)}
                className="flex-1 py-4 bg-app-bg text-app-muted font-bold rounded-2xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMeal}
                className="flex-1 py-4 bg-app-orange text-white font-bold rounded-2xl shadow-md"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Passcode Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-app-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield size={32} className="text-app-blue" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {showPasscodeModal === 'set' || showPasscodeModal === 'set_new' ? 'Set Privacy Passcode' : 'Enter Passcode'}
            </h3>
            <p className="text-app-muted text-sm mb-8">
              {showPasscodeModal === 'set' || showPasscodeModal === 'set_new'
                ? 'Create a 4-digit code to lock your private data.' 
                : showPasscodeModal === 'verify_change'
                ? 'Enter your current code to change it.'
                : showPasscodeModal === 'verify_disable'
                ? 'Enter your code to remove security.'
                : 'Enter your code to disable privacy mode.'}
            </p>
            
            <div className="flex justify-center gap-3 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    passcodeInput.length > i ? 'bg-app-blue border-app-blue scale-125' : 'border-black/10'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    if (num === 'C') {
                      setPasscodeInput('');
                    } else if (num === 'OK') {
                      if (showPasscodeModal === 'set' || showPasscodeModal === 'set_new') {
                        if (passcodeInput.length < 4) {
                          toast.error("Passcode must be 4 digits");
                          return;
                        }
                        const updated = { ...profile!, passcode: passcodeInput, privacyMode: true };
                        setProfile(updated);
                        localStorage.setItem('cozy_profile', JSON.stringify(updated));
                        setShowPasscodeModal(null);
                        setPasscodeInput('');
                        toast.success(showPasscodeModal === 'set_new' ? "Passcode updated! 🔒" : "Privacy passcode set! 🔒");
                      } else if (showPasscodeModal === 'verify_change') {
                        if (passcodeInput === profile?.passcode) {
                          setShowPasscodeModal('set_new');
                          setPasscodeInput('');
                        } else {
                          toast.error("Incorrect passcode");
                          setPasscodeInput('');
                        }
                      } else if (showPasscodeModal === 'verify_disable') {
                        if (passcodeInput === profile?.passcode) {
                          const updated = { ...profile!, passcode: undefined, privacyMode: false };
                          setProfile(updated);
                          localStorage.setItem('cozy_profile', JSON.stringify(updated));
                          setShowPasscodeModal(null);
                          setPasscodeInput('');
                          toast.success("Passcode removed! 🔓");
                        } else {
                          toast.error("Incorrect passcode");
                          setPasscodeInput('');
                        }
                      } else {
                        if (passcodeInput === profile?.passcode) {
                          const updated = { ...profile!, privacyMode: false };
                          setProfile(updated);
                          localStorage.setItem('cozy_profile', JSON.stringify(updated));
                          setShowPasscodeModal(null);
                          setPasscodeInput('');
                          toast.success("Privacy disabled");
                        } else {
                          toast.error("Incorrect passcode");
                          setPasscodeInput('');
                        }
                      }
                    } else {
                      if (passcodeInput.length < 4) {
                        setPasscodeInput(prev => prev + num);
                      }
                    }
                  }}
                  className={`h-16 rounded-2xl flex items-center justify-center font-bold text-xl transition-all active:scale-90 ${
                    num === 'OK' ? 'bg-app-lime text-app-text' : 'bg-app-bg text-app-text hover:bg-black/5'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button 
              onClick={() => {
                setShowPasscodeModal(null);
                setPasscodeInput('');
              }}
              className="text-app-muted font-bold text-sm hover:text-app-text transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* Audio Element */}
      {currentTrack && (
        <audio 
          ref={audioRef}
          src={currentTrack.url} 
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
              </div>
            </>
          )}
        </div>

        {/* Floating Bottom Navigation */}
        {profile && !isRecentsOpen && (
          <nav className="absolute bottom-[72px] left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-pill px-4 py-2.5 flex justify-between items-center z-50 shadow-xl bg-white/95 backdrop-blur-md border border-black/5">
            <button 
              onClick={() => setView('home')}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                view === 'home' ? 'bg-[#A2E02A] text-app-text shadow-md scale-110' : 'text-app-muted hover:text-app-text/80'
              }`}
            >
              <Home size={22} />
            </button>
            <button 
              onClick={() => setView('mindfulness')}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                view === 'mindfulness' ? 'bg-[#A2E02A] text-app-text shadow-md scale-110' : 'text-app-muted hover:text-app-text/80'
              }`}
            >
              <Layout size={22} />
            </button>
            <button 
              onClick={() => setView('achievements')}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                view === 'achievements' ? 'bg-[#A2E02A] text-app-text shadow-md scale-110' : 'text-app-muted hover:text-app-text/80'
              }`}
            >
              <Trophy size={22} />
            </button>
            <button 
              onClick={() => setView('music')}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                view === 'music' ? 'bg-[#A2E02A] text-app-text shadow-md scale-110' : 'text-app-muted hover:text-app-text/80'
              }`}
            >
              <Music size={22} />
            </button>
            <button 
              onClick={() => setView('menu')}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                view === 'menu' ? 'bg-[#A2E02A] text-app-text shadow-md scale-110' : 'text-app-muted hover:text-app-text/80'
              }`}
            >
              <MenuIcon size={22} />
            </button>
          </nav>
        )}

        {/* Virtual Android Navigation Bar */}
        <div className="flex w-full h-14 bg-[#F5F5F2] items-center justify-around px-8 pb-4 pt-2 z-[90] shrink-0 select-none">
          {/* Left key: Recents (|||) */}
          <button 
            onClick={() => setIsRecentsOpen(true)} 
            title="Active Tasks" 
            className="w-12 h-12 flex items-center justify-center gap-[3px] hover:bg-black/5 rounded-full transition-colors active:scale-90 cursor-pointer"
          >
            <div className="w-[3px] h-[13px] bg-app-text/70 rounded-full" />
            <div className="w-[3px] h-[13px] bg-app-text/70 rounded-full" />
            <div className="w-[3px] h-[13px] bg-app-text/70 rounded-full" />
          </button>
          
          {/* Center key: Home (O) */}
          <button 
            onClick={handleAndroidHome} 
            title="System Home" 
            className="w-12 h-12 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors active:scale-95 cursor-pointer"
          >
            <div className="w-[14px] h-[14px] rounded-[4px] border-2 border-app-text/70" />
          </button>

          {/* Right key: Back (<) */}
          <button 
            onClick={handleAndroidBack} 
            title="System Back" 
            className="w-12 h-12 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors active:scale-90 cursor-pointer"
          >
            <ChevronLeft size={18} className="text-app-text/70" />
          </button>
        </div>

      </div>
    </div>
  );
}


