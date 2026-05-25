import { useState, useEffect } from 'react';
import { Plus, Trash2, StickyNote, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
}

const COLORS = [
  'bg-amber-50 border-amber-200',
  'bg-emerald-50 border-emerald-200',
  'bg-sky-50 border-sky-200',
  'bg-rose-50 border-rose-200',
  'bg-violet-50 border-violet-200',
];

export default function GeneralNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('cozy_general_notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cozy_general_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title || 'Untitled Note',
      content: newNote.content,
      date: new Date().toLocaleDateString(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    
    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '' });
    setIsAdding(false);
  };

  const updateNote = () => {
    if (!editingNote) return;
    setNotes(notes.map(n => n.id === editingNote.id ? editingNote : n));
    setEditingNote(null);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cozy-muted" size={18} />
          <input 
            type="text"
            placeholder="Search your notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-cozy-accent/10 focus:ring-2 focus:ring-cozy-accent/20 outline-none transition-all"
          />
        </div>
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditingNote(null);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-cozy-accent text-white rounded-2xl font-bold hover:bg-[#7a8a7a] transition-all shadow-md active:scale-95 whitespace-nowrap"
        >
          <Plus size={20} />
          <span>New Quick Note</span>
        </button>
      </div>

      <AnimatePresence>
        {(isAdding || editingNote) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-8 bg-white rounded-3xl border border-cozy-accent/20 shadow-xl"
          >
            <input 
              type="text"
              placeholder="Note Title"
              value={editingNote ? editingNote.title : newNote.title}
              onChange={(e) => editingNote 
                ? setEditingNote({ ...editingNote, title: e.target.value })
                : setNewNote({ ...newNote, title: e.target.value })
              }
              className="w-full text-2xl font-sans font-semibold text-cozy-accent mb-4 outline-none placeholder-cozy-muted/30"
            />
            <textarea 
              placeholder="Write anything you need to..."
              value={editingNote ? editingNote.content : newNote.content}
              onChange={(e) => editingNote
                ? setEditingNote({ ...editingNote, content: e.target.value })
                : setNewNote({ ...newNote, content: e.target.value })
              }
              className="w-full h-32 text-lg font-sans text-cozy-text outline-none resize-none placeholder-cozy-muted/30"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingNote(null);
                }}
                className="px-6 py-2 text-cozy-muted font-bold hover:text-cozy-text transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={editingNote ? updateNote : addNote}
                className="px-8 py-2 bg-cozy-accent text-white rounded-xl font-bold hover:bg-[#7a8a7a] transition-all"
              >
                {editingNote ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.length === 0 && !isAdding && !editingNote && (
            <div className="col-span-full py-20 text-center bg-white/50 rounded-3xl border border-dashed border-cozy-accent/20">
              <StickyNote size={48} className="mx-auto text-cozy-muted/30 mb-4" />
              <p className="text-cozy-muted">No notes found. Capture your thoughts!</p>
            </div>
          )}
          
          {filteredNotes.map((note) => (
            <motion.div 
              layout
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => {
                setEditingNote(note);
                setIsAdding(false);
              }}
              className={`p-6 rounded-3xl border ${note.color} group relative hover:shadow-md transition-all h-fit cursor-pointer`}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="absolute top-4 right-4 p-2 text-cozy-muted hover:text-cozy-warm opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
              <h4 className="text-lg font-bold text-cozy-text mb-2 pr-8">{note.title}</h4>
              <p className="text-cozy-text/70 text-sm mb-4 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
              <div className="text-[10px] font-bold text-cozy-muted uppercase tracking-widest">
                {note.date}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
