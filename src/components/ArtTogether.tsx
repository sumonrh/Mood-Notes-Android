import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eraser, Palette, Save, Trash2, Sparkles, Image as ImageIcon, Undo, ChevronLeft } from 'lucide-react';

interface SavedArt {
  id: string;
  dataUrl: string;
  timestamp: string;
  isRainbow?: boolean;
}

export default function ArtTogether({ onSaveArt }: { onSaveArt?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#1a1a1a');
  const [isRainbow, setIsRainbow] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [savedArts, setSavedArts] = useState<SavedArt[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const PALETTE = [
    '#1a1a1a', '#8B4513', '#ffffff', '#FF0000', // Black, Brown, White, Red
    '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', // Orange, Yellow, Green, Blue
    '#4B0082', '#9400D3', '#ff9ff3', '#FFB7B2', // Indigo, Violet, Pink, Pastel Pink
    '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', // Pastel Orange, Pastel Yellow, Pastel Green, Pastel Blue
    '#FAD1FF', '#A8E6CF', '#DCEDC1'              // Lavender, Mint, Lime
  ];

  useEffect(() => {
    const saved = localStorage.getItem('cozy_art_gallery');
    if (saved) {
      setSavedArts(JSON.parse(saved));
    }
    
    // Initialize canvas with white background
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return {
      x: x * (canvas.width / rect.width),
      y: y * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setHistory(prev => [...prev.slice(-19), canvas.toDataURL()]);
    }
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.closePath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (isRainbow) {
      ctx.strokeStyle = `hsl(${hueRef.current}, 100%, 50%)`;
      hueRef.current = (hueRef.current + 2) % 360;
    } else {
      ctx.strokeStyle = color;
    }

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHistory(prev => [...prev.slice(-19), canvas.toDataURL()]);
    }
  };

  const saveArt = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      const newArt: SavedArt = {
        id: Date.now().toString(),
        dataUrl,
        timestamp: new Date().toLocaleString(),
        isRainbow: isRainbow
      };
      const updatedGallery = [newArt, ...savedArts];
      setSavedArts(updatedGallery);
      localStorage.setItem('cozy_art_gallery', JSON.stringify(updatedGallery));
      if (onSaveArt) onSaveArt();
    }
  };

  const deleteArt = (id: string) => {
    const updatedGallery = savedArts.filter(art => art.id !== id);
    setSavedArts(updatedGallery);
    localStorage.setItem('cozy_art_gallery', JSON.stringify(updatedGallery));
  };

  const undo = () => {
    if (history.length <= 1) {
      clearCanvas();
      setHistory([]);
      return;
    }
    const newHistory = [...history];
    newHistory.pop();
    const prevState = newHistory[newHistory.length - 1];
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas && prevState) {
      const img = new Image();
      img.src = prevState;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      setHistory(newHistory);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-app-text">Creative Sanctuary</h2>
        <p className="text-app-muted mt-1">Express your soul through colors... 🎨✨</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Toolbar */}
        <div className="lg:col-span-1 space-y-6 bg-white p-8 rounded-[3rem] border border-black/5 shadow-sm h-fit">
          <div className="space-y-4">
            <div className="flex justify-between items-center ml-2">
              <label className="text-xs font-bold uppercase tracking-widest text-app-muted">Colors</label>
              <button 
                onClick={() => setIsRainbow(!isRainbow)}
                className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md transition-all ${isRainbow ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white shadow-sm' : 'bg-app-bg text-app-muted'}`}
              >
                Rainbow
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {PALETTE.map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setIsRainbow(false);
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${!isRainbow && color === c ? 'scale-125 border-app-text shadow-md' : 'border-transparent hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <button
                onClick={() => setIsRainbow(!isRainbow)}
                className={`w-8 h-8 rounded-full border-2 transition-transform bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 ${isRainbow ? 'scale-125 border-app-text shadow-md' : 'border-transparent hover:scale-110'}`}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-app-muted ml-2">Brush Size</label>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full h-2 bg-black/5 rounded-full appearance-none cursor-pointer accent-app-blue"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button onClick={undo} className="flex items-center justify-center gap-2 py-3 bg-app-bg rounded-2xl text-app-text hover:bg-app-blue hover:text-white transition-all font-bold">
              <Undo size={18} /> <span className="text-xs">Undo</span>
            </button>
            <button onClick={clearCanvas} className="flex items-center justify-center gap-2 py-3 bg-app-bg rounded-2xl text-app-text hover:bg-app-pink hover:text-white transition-all font-bold">
              <Trash2 size={18} /> <span className="text-xs">Clear</span>
            </button>
            <button onClick={saveArt} className="col-span-2 flex items-center justify-center gap-2 py-4 bg-app-lime text-app-text rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95">
              <Save size={18} /> Save to Gallery
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <div className="bg-white p-4 rounded-[3.5rem] border border-black/5 shadow-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="w-full h-auto bg-white rounded-[2.5rem] cursor-crosshair touch-none border border-black/5"
            />
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-app-orange rounded-full flex items-center justify-center shadow-sm">
            <ImageIcon size={20} className="text-app-text" />
          </div>
          <h3 className="text-2xl font-bold text-app-text">Your Gallery</h3>
          <span className="px-3 py-1 bg-app-orange/10 text-app-orange rounded-full text-xs font-bold">
            {savedArts.length} pieces
          </span>
        </div>

        {savedArts.length === 0 ? (
          <div className="text-center py-20 app-card bg-white border-dashed border-2 border-black/5">
            <Sparkles size={40} className="mx-auto text-app-muted/30 mb-4" />
            <p className="text-app-muted italic">Your gallery is empty. Time to create some magic! ✨</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedArts.map((art) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className={`group relative bg-white p-3 rounded-[2.5rem] border border-black/5 shadow-sm transition-all duration-500 ${art.isRainbow ? 'ring-2 ring-app-orange/20' : ''}`}
              >
                <motion.img 
                  src={art.dataUrl} 
                  alt="Saved Art" 
                  className="w-full aspect-square object-cover rounded-[2rem] border border-black/5"
                  animate={art.isRainbow ? {
                    filter: [
                      "hue-rotate(0deg) drop-shadow(0 0 5px rgba(255, 100, 100, 0.4))",
                      "hue-rotate(90deg) drop-shadow(0 0 10px rgba(100, 255, 100, 0.4))",
                      "hue-rotate(180deg) drop-shadow(0 0 5px rgba(100, 100, 255, 0.4))",
                      "hue-rotate(270deg) drop-shadow(0 0 10px rgba(255, 100, 255, 0.4))",
                      "hue-rotate(360deg) drop-shadow(0 0 5px rgba(255, 100, 100, 0.4))"
                    ]
                  } : {}}
                  transition={art.isRainbow ? {
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  } : {}}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] flex items-center justify-center gap-4">
                  <button 
                    onClick={() => deleteArt(art.id)}
                    className="p-3 bg-white text-app-text rounded-full hover:bg-app-pink hover:text-white transition-all shadow-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="mt-3 px-4 flex justify-between items-center">
                  <span className="text-[10px] text-app-muted font-bold uppercase tracking-wider">{art.timestamp.split(',')[0]}</span>
                  {art.isRainbow ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles size={12} className="text-app-orange" />
                    </motion.div>
                  ) : (
                    <Sparkles size={12} className="text-app-orange" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

