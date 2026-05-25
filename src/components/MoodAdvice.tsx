import { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Heart, Lightbulb, Loader2, AlertCircle } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: number;
  note: string;
}

const STATIC_ADVICE = {
  low: [
    { advice: "Take a deep breath. You've handled difficult days before, and you'll get through this one too.", aiMood: "Gentle & Supportive" },
    { advice: "Be extra kind to yourself today. Maybe a warm cup of tea or 5 minutes of quiet could help?", aiMood: "Quietly Empathetic" },
    { advice: "It's okay to not be okay. Your feelings are valid. What's one tiny thing that could make you 1% more comfortable right now?", aiMood: "Softly Present" },
    { advice: "Remember that moods are like clouds—they pass. This feeling is temporary.", aiMood: "Patiently Waiting with You" }
  ],
  neutral: [
    { advice: "You're maintaining a steady balance today. How about a short walk to keep that momentum going?", aiMood: "Steady & Balanced" },
    { advice: "A neutral day is a great time for a small act of self-care. What's something you usually enjoy?", aiMood: "Calmly Observant" },
    { advice: "Stay present in the moment. You're doing a good job navigating the middle ground.", aiMood: "Mindfully Attuned" },
    { advice: "Consider writing down one thing you're grateful for today, even if it's something small.", aiMood: "Thoughtfully Reflective" }
  ],
  high: [
    { advice: "Your energy is wonderful! Take a moment to really soak in this positive feeling.", aiMood: "Radiantly Joyful" },
    { advice: "Celebrate this win, no matter how small. You've earned this moment of joy!", aiMood: "Bouncing with Excitement" },
    { advice: "Keep this momentum going! Is there someone you'd like to share this positive energy with?", aiMood: "Vibrantly Inspired" },
    { advice: "Write down what's making you feel so good—it'll be a great reminder for future days.", aiMood: "Glowingly Happy for You" }
  ]
};

export default function MoodAdvice({ latestEntry }: { latestEntry: MoodEntry | null }) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [aiMood, setAiMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (!latestEntry) return;

    const getAdvice = async () => {
      // Check cache first
      const cacheKey = `mood_advice_v2_${latestEntry.date}_${latestEntry.mood}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setAdvice(parsed.advice);
          setAiMood(parsed.aiMood);
          setIsFallback(false);
          return;
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }

      setLoading(true);
      setIsFallback(false);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const prompt = `
          The user just logged a mood of ${latestEntry.mood}/10.
          Their journal entry is: "${latestEntry.note}"
          
          Based on this, provide:
          1. A short, supportive, and actionable piece of advice or encouragement (under 3 sentences).
          2. A very short description of your own "AI mood" in response to theirs (e.g., "Feeling empathetic," "Radiating joy with you").
          
          Return the response as a JSON object with keys "advice" and "aiMood".
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });

        const result = JSON.parse(response.text || "{}");
        const finalAdvice = result.advice || "You're doing great! Keep taking care of yourself.";
        const finalAiMood = result.aiMood || "Supportive";
        
        setAdvice(finalAdvice);
        setAiMood(finalAiMood);
        localStorage.setItem(cacheKey, JSON.stringify({ advice: finalAdvice, aiMood: finalAiMood }));
      } catch (err: any) {
        // Handle quota or availability errors specifically and silently
        const isQuotaOrAvailabilityError = 
          err?.message?.includes('RESOURCE_EXHAUSTED') || 
          err?.message?.includes('UNAVAILABLE') ||
          err?.status === 429 || 
          err?.status === 503 ||
          err?.error?.status === 'RESOURCE_EXHAUSTED' ||
          err?.error?.status === 'UNAVAILABLE' ||
          err?.error?.code === 429 ||
          err?.error?.code === 503;
        
        if (!isQuotaOrAvailabilityError) {
          console.error("Advice error:", err);
        }
        
        // Fallback logic
        let fallbackList = STATIC_ADVICE.neutral;
        if (latestEntry.mood <= 4) fallbackList = STATIC_ADVICE.low;
        else if (latestEntry.mood >= 8) fallbackList = STATIC_ADVICE.high;
        
        const randomItem = fallbackList[Math.floor(Math.random() * fallbackList.length)];
        setAdvice(randomItem.advice);
        setAiMood(randomItem.aiMood);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    };

    getAdvice();
  }, [latestEntry]);

  const displayAdvice = latestEntry ? advice : "Your energy is wonderful! Take a moment to really soak in this positive feeling.";
  const displayAiMood = latestEntry ? aiMood : "Radiantly Joyful";
  const displayIsFallback = latestEntry ? isFallback : true;

  return (
    <div className="relative overflow-hidden">
      {/* Star Shape watermark background in the card */}
      <div className="absolute top-2 right-2 opacity-5 text-app-text select-none pointer-events-none">
        <Sparkles size={80} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              {!latestEntry || latestEntry.mood >= 8 ? (
                <Lightbulb size={20} className="text-[#A2E02A]" />
              ) : latestEntry.mood <= 4 ? (
                <Heart size={20} className="text-app-pink" />
              ) : (
                <Lightbulb size={20} className="text-app-lime" />
              )}
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-[10px] text-app-text/60">Daily Wisdom</h3>
              {displayAiMood && !loading && (
                <div className="text-[10px] font-bold text-app-orange/90 flex items-center gap-1 mt-0.5">
                  <div className="w-1 h-1 rounded-full bg-app-orange animate-pulse" />
                  AI is {displayAiMood}
                </div>
              )}
            </div>
          </div>
          {displayIsFallback && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-app-muted bg-app-bg px-2.5 py-1 rounded-full border border-black/5">
              <Sparkles size={10} />
              <span>Classic Wisdom</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-app-text/60 py-4">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-lg font-bold">Reflecting on your day...</span>
          </div>
        ) : (
          <p className="text-[#1A1A1A] font-bold text-lg md:text-xl leading-relaxed tracking-tight break-words">
            "{displayAdvice}"
          </p>
        )}
      </div>
    </div>
  );
}

