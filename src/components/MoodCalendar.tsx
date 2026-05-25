import { useState } from 'react';
import { 
  format, 
  startOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  addDays,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  addMonths,
  subMonths,
  getDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Heart, X, Calendar as CalendarIcon, Smile, Frown, Meh, Angry, Annoyed, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MoodEntry {
  date: string;
  mood: number;
  note: string;
}

export default function MoodCalendar({ entries }: { entries: MoodEntry[] }) {
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });

  // For month grid alignment
  const startDayOffset = (getDay(monthStart) + 6) % 7; // Adjust to Monday start
  const emptyDays = Array.from({ length: startDayOffset });

  const handlePrev = () => {
    if (viewMode === 'week') setCurrentDate(addDays(currentDate, -7));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'week') setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  const getMoodConfig = (mood: number) => {
    if (mood <= 2) return { emoji: '😠', color: 'bg-[#FF5C5C]', icon: Angry };
    if (mood <= 4) return { emoji: '😑', color: 'bg-[#B2E2F2]', icon: Annoyed };
    if (mood <= 6) return { emoji: '😮‍💨', color: 'bg-[#E2B2F2]', icon: Meh };
    if (mood <= 8) return { emoji: '🥺', color: 'bg-[#FFD2A0]', icon: Frown };
    return { emoji: '😊', color: 'bg-[#D7FE63]', icon: Smile };
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-bold text-app-text min-w-[140px] text-center">
            {viewMode === 'week' 
              ? `${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 6), 'MMM d')}`
              : format(currentDate, 'MMMM yyyy')
            }
          </span>
          <button 
            onClick={handleNext}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-app-bg p-1 rounded-xl">
            <button
              onClick={() => setViewMode('week')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'week' ? 'bg-white shadow-sm' : 'text-app-muted'}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'month' ? 'bg-white shadow-sm' : 'text-app-muted'}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
          {!isSameDay(currentDate, new Date()) && (
            <button 
              onClick={handleToday}
              className="text-[10px] font-bold text-app-lime uppercase tracking-widest px-3 py-1.5 bg-app-lime/10 rounded-full"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {viewMode === 'week' ? (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {weekDays.map((day, idx) => {
            const dayEntries = entries.filter(e => isSameDay(new Date(e.date), day));
            const latestEntry = dayEntries.length > 0 ? dayEntries[dayEntries.length - 1] : null;
            const config = latestEntry ? getMoodConfig(latestEntry.mood) : { emoji: '?', color: 'bg-gray-100', icon: Meh };

            return (
              <div 
                key={idx} 
                onClick={() => latestEntry && setSelectedEntry(latestEntry)}
                className="flex flex-col items-center gap-2 min-w-[64px]"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm cursor-pointer transition-all ${
                    latestEntry ? config.color : 'bg-gray-50 border border-dashed border-gray-200'
                  }`}
                >
                  {latestEntry ? config.emoji : ''}
                </motion.div>
                <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">
                  {format(day, 'EEE')}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-app-muted py-2">
              {d}
            </div>
          ))}
          {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
          {monthDays.map((day, idx) => {
            const dayEntries = entries.filter(e => isSameDay(new Date(e.date), day));
            const latestEntry = dayEntries.length > 0 ? dayEntries[dayEntries.length - 1] : null;
            const config = latestEntry ? getMoodConfig(latestEntry.mood) : null;

            return (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.1 }}
                onClick={() => latestEntry && setSelectedEntry(latestEntry)}
                className={`aspect-square rounded-xl flex items-center justify-center text-lg cursor-pointer transition-all relative ${
                  latestEntry ? config?.color : 'bg-gray-50/50 border border-dashed border-gray-100'
                } ${isSameDay(day, new Date()) ? 'ring-2 ring-app-lime ring-offset-2' : ''}`}
              >
                <span className={`text-[10px] absolute top-1 left-1 font-bold ${latestEntry ? 'text-app-text/40' : 'text-app-muted/30'}`}>
                  {format(day, 'd')}
                </span>
                {latestEntry && config?.emoji}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Entry Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntry(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-black/5"
            >
              <div className="p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-20 h-20 rounded-3xl shadow-lg flex items-center justify-center text-4xl ${getMoodConfig(selectedEntry.mood).color}`}>
                    {getMoodConfig(selectedEntry.mood).emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-app-muted mb-1">
                      <CalendarIcon size={14} />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {format(new Date(selectedEntry.date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-app-text">
                      Mood Level: {selectedEntry.mood}/10
                    </h3>
                  </div>
                </div>

                <div className="bg-app-bg/50 p-8 rounded-3xl border border-black/5">
                  <p className="text-xl font-medium text-app-text leading-relaxed italic">
                    "{selectedEntry.note}"
                  </p>
                </div>

                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={() => setSelectedEntry(null)}
                    className="px-8 py-3 bg-app-text text-white rounded-full font-bold hover:opacity-90 transition-all active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

