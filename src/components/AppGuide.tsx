import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  BookOpen, 
  Heart, 
  Sparkles, 
  Calendar, 
  Coffee, 
  Clock, 
  Shield, 
  Music,
  Palette,
  Lightbulb
} from 'lucide-react';

interface AppGuideProps {
  onBack: () => void;
}

export default function AppGuide({ onBack }: AppGuideProps) {
  const sections = [
    {
      icon: <Heart className="text-app-pink" />,
      title: "Mood Journaling",
      description: "Log your mood daily with a note. The AI will provide personalized advice and track your emotional journey over time."
    },
    {
      icon: <Coffee className="text-app-orange" />,
      title: "Daily Trackers",
      description: "Keep track of your meals, water intake, and sleep. These reset every night at midnight to give you a fresh start."
    },
    {
      icon: <Sparkles className="text-app-blue" />,
      title: "AI Insights",
      description: "Our AI analyzes your notes to find triggers and patterns, helping you understand what makes you feel your best."
    },
    {
      icon: <Music className="text-app-lavender" />,
      title: "Cozy Sounds",
      description: "Listen to curated lo-fi beats and nature sounds in the Music tab to help you relax or focus."
    },
    {
      icon: <Shield className="text-app-lime" />,
      title: "Privacy Mode",
      description: "Enable Privacy Mode in settings to blur your sensitive data. You can also set a passcode for extra security."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-app-text">How to Use</h2>
          <p className="text-app-muted text-sm font-bold uppercase tracking-widest">Sanctuary Guide</p>
        </div>
      </div>

      <div className="app-card bg-app-blue/10 border-none p-8 flex items-start gap-6">
        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm shrink-0">
          <BookOpen size={32} className="text-app-blue" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Welcome to your Sanctuary</h3>
          <p className="text-app-text/70 leading-relaxed">
            This app is designed to be a safe space for your mind. Here's a quick guide to help you make the most of your journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="app-card bg-white border border-black/5 p-6 flex gap-5 items-start"
          >
            <div className="w-12 h-12 bg-app-bg rounded-2xl flex items-center justify-center shrink-0">
              {section.icon}
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1">{section.title}</h4>
              <p className="text-sm text-app-muted leading-relaxed">{section.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="app-card bg-app-lime/10 border-none p-8 text-center">
        <Lightbulb size={32} className="mx-auto text-app-lime mb-4" />
        <h3 className="text-xl font-bold mb-2">Pro Tip</h3>
        <p className="text-app-text/60 text-sm">
          The more you journal, the better the AI becomes at understanding your unique patterns!
        </p>
      </div>
    </motion.div>
  );
}
