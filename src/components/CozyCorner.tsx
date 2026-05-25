import { useState } from 'react';
import { Play, Sparkles, Coffee, Sun, Clock, Search, Mic } from 'lucide-react';
import { motion } from 'motion/react';

interface Video {
  id: string;
  title: string;
  type: 'yoga' | 'cozy';
  thumbnail: string;
  embedId: string;
  duration: string;
  color: string;
}

const VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Morning Yoga Flow',
    type: 'yoga',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    embedId: 'v7AYKMP6rOE',
    duration: '15 min',
    color: 'bg-app-lime'
  },
  {
    id: '2',
    title: 'Mindful Meditation',
    type: 'cozy',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    embedId: 'c1Ndym-IsQg',
    duration: '10 min',
    color: 'bg-app-pink'
  },
  {
    id: '3',
    title: 'Evening Chill Stretch',
    type: 'yoga',
    thumbnail: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=800',
    embedId: 'zW2S_H6BynI',
    duration: '12 min',
    color: 'bg-app-blue'
  },
  {
    id: '4',
    title: 'Deep Focus Beats',
    type: 'cozy',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800',
    embedId: '5qxFill0LIA',
    duration: '20 min',
    color: 'bg-app-lavender'
  },
  {
    id: '5',
    title: '5-Minute Refresh',
    type: 'cozy',
    thumbnail: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800',
    embedId: 'ZToicY62f1U',
    duration: '5 min',
    color: 'bg-app-orange'
  },
  {
    id: '6',
    title: 'Anxiety Relief',
    type: 'cozy',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    embedId: 'ENnZ_tVsUvY',
    duration: '25 min',
    color: 'bg-app-pink'
  },
  {
    id: '7',
    title: 'Full Body Reset',
    type: 'yoga',
    thumbnail: 'https://images.unsplash.com/photo-1528319725582-ddc0b6101130?auto=format&fit=crop&q=80&w=800',
    embedId: '16ifpRE6aVw',
    duration: '10 min',
    color: 'bg-app-blue'
  },
  {
    id: '8',
    title: 'Bedtime Sleep Story',
    type: 'cozy',
    thumbnail: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=800',
    embedId: 'N8jtZ_oatj0',
    duration: '30 min',
    color: 'bg-app-lime'
  },
  {
    id: '9',
    title: 'Stress Relief Yoga',
    type: 'yoga',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    embedId: 'sTANio_2uf0',
    duration: '10 min',
    color: 'bg-app-orange'
  },
  {
    id: '10',
    title: 'Guided Self-Love',
    type: 'cozy',
    thumbnail: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800',
    embedId: 'itZMM5gC6bw',
    duration: '15 min',
    color: 'bg-app-pink'
  }
];

export default function CozyCorner({ onMeditationComplete }: { onMeditationComplete?: () => void }) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    if (onMeditationComplete) {
      onMeditationComplete();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-app-text">Meditation & Mindfulness</h2>
        <p className="text-app-muted mt-1">Immerse yourself in peace and harmony... 🧘‍♀️✨</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {VIDEOS.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ y: -5 }}
            className={`${video.color} rounded-[3rem] p-8 shadow-sm group cursor-pointer relative overflow-hidden`}
            onClick={() => handleVideoSelect(video)}
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {video.type === 'yoga' ? <Sun size={20} className="text-app-text" /> : <Coffee size={20} className="text-app-text" />}
                </div>
                <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                  <Clock size={14} className="text-app-text" />
                  <span className="text-xs font-bold">{video.duration}</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                  <Play size={24} fill="currentColor" className="text-app-text ml-1" />
                </div>
                <h3 className="text-2xl font-bold text-app-text mb-2">{video.title}</h3>
                <p className="text-app-text/60 text-sm font-medium">Find your inner peace with this session.</p>
              </div>
            </div>
            
            {/* Background Image Overlay */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <img 
                src={video.thumbnail} 
                alt="" 
                className="w-full h-full object-cover rounded-l-[5rem]"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedVideo(null)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedVideo.embedId}?autoplay=1`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      )}
    </div>
  );
}

