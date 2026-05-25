import { useState } from 'react';
import { Save, Smile, Frown, Meh } from 'lucide-react';

export default function NotesEditor({ onSave }: { onSave: (note: string, mood: number) => void }) {
  const [note, setNote] = useState('');
  const [mood, setMood] = useState(5);

  const getMoodEmoji = (m: number) => {
    if (m <= 3) return <Frown className="text-red-500" size={32} />;
    if (m <= 7) return <Meh className="text-yellow-500" size={32} />;
    return <Smile className="text-green-500" size={32} />;
  };

  return (
    <div className="p-10 bg-white rounded-[2rem] shadow-sm border border-cozy-accent/10 max-w-2xl mx-auto">
      <h2 className="text-3xl font-sans font-semibold text-cozy-accent mb-10">How are you feeling, truly?</h2>
      
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-cozy-muted">Inner State</label>
          <div className="flex items-center gap-4">
            {getMoodEmoji(mood)}
            <span className="text-4xl font-sans font-semibold text-cozy-accent">{mood}</span>
          </div>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="w-full h-1.5 bg-cozy-bg rounded-full appearance-none cursor-pointer accent-cozy-accent"
        />
        <div className="flex justify-between mt-4 text-[10px] font-bold tracking-widest text-cozy-muted/50">
          <span>SOFT & QUIET</span>
          <span>VIBRANT & FULL</span>
        </div>
      </div>

      <div className="mb-10">
        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-cozy-muted mb-4">Your Thoughts</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full h-56 p-6 bg-cozy-bg/50 border-none rounded-3xl focus:ring-2 focus:ring-cozy-accent/20 transition-all resize-none text-cozy-text placeholder-cozy-muted/40 font-sans text-lg leading-relaxed"
          placeholder="Let your thoughts flow onto the page..."
        />
      </div>

      <button
        onClick={() => onSave(note, mood)}
        disabled={!note.trim()}
        className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-cozy-accent text-white rounded-2xl font-bold hover:bg-[#7a8a7a] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
      >
        <Save size={20} />
        <span className="tracking-wide">Seal this moment</span>
      </button>
    </div>
  );
}
