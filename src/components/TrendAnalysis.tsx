import { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Brain, AlertCircle, Loader2, Sparkles, TrendingUp, Calendar, Info } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format, subDays, startOfDay, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';

interface MoodEntry {
  date: string;
  mood: number;
  note: string;
}

type TimeRange = '7d' | '30d' | 'all';

export default function TrendAnalysis({ entries }: { entries: MoodEntry[] }) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [isFallback, setIsFallback] = useState(false);

  const chartData = useMemo(() => {
    if (entries.length === 0) return [];

    const now = new Date();
    let start: Date;
    
    if (timeRange === '7d') start = subDays(now, 6);
    else if (timeRange === '30d') start = subDays(now, 29);
    else start = new Date(Math.min(...entries.map(e => new Date(e.date).getTime())));

    const days = eachDayOfInterval({ start: startOfDay(start), end: startOfDay(now) });

    return days.map(day => {
      const dayEntries = entries.filter(e => format(new Date(e.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((acc, curr) => acc + curr.mood, 0) / dayEntries.length 
        : null;

      return {
        date: format(day, timeRange === '7d' ? 'EEE' : 'MMM d'),
        fullDate: format(day, 'yyyy-MM-dd'),
        mood: avgMood,
      };
    });
  }, [entries, timeRange]);

  useEffect(() => {
    if (entries.length < 3) return;

    const analyzeTrends = async () => {
      // Check cache first - hash the entries to see if they changed
      const entriesHash = entries.length + '_' + entries[entries.length-1].date + '_' + entries[entries.length-1].mood;
      const cacheKey = `trend_analysis_${entriesHash}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        setAnalysis(cached);
        setIsFallback(false);
        return;
      }

      setLoading(true);
      setError(null);
      setIsFallback(false);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const prompt = `
          Analyze the following mood journal entries and identify potential mood triggers and patterns.
          Specifically look for:
          1. Weekend vs. Weekday patterns (e.g., "Your mood tends to be lower on weekends").
          2. Correlations between journaling topics and mood (e.g., "You reported feeling happier after journaling about family").
          3. Time of day patterns if available.
          4. Overall trend (improving, declining, stable).

          Provide 3-4 concise, supportive, and actionable insights.
          Format the output as a short list of bullet points.

          Entries:
          ${entries.map(e => `Date: ${e.date}, Mood: ${e.mood}/10, Note: ${e.note}`).join('\n')}
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
        });

        const text = response.text || "No analysis available.";
        setAnalysis(text);
        localStorage.setItem(cacheKey, text);
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
          console.error("Analysis error:", err);
        } else {
          console.log("Using Pattern Analysis due to AI service limits.");
        }
        
        // Static Fallback Logic
        setIsFallback(true);
        const avgMood = entries.reduce((a, b) => a + b.mood, 0) / entries.length;
        const weekendMoods = entries.filter(e => isWeekend(new Date(e.date)));
        const weekdayMoods = entries.filter(e => !isWeekend(new Date(e.date)));
        
        const avgWeekend = weekendMoods.length ? weekendMoods.reduce((a, b) => a + b.mood, 0) / weekendMoods.length : null;
        const avgWeekday = weekdayMoods.length ? weekdayMoods.reduce((a, b) => a + b.mood, 0) / weekdayMoods.length : null;

        let fallbackInsights = [
          `Your average mood over the last ${entries.length} entries is ${avgMood.toFixed(1)}/10.`,
          "Consistency is key! You're doing a great job logging your journey.",
        ];

        if (avgWeekend !== null && avgWeekday !== null) {
          if (avgWeekend > avgWeekday + 1) {
            fallbackInsights.push("You seem to feel noticeably brighter on weekends! Try to bring some of that weekend joy into your week.");
          } else if (avgWeekday > avgWeekend + 1) {
            fallbackInsights.push("Your mood tends to dip a bit on weekends. Consider planning a small, relaxing activity for your next day off.");
          }
        }

        if (avgMood > 7) {
          fallbackInsights.push("You've been in a positive flow lately. Keep practicing the habits that are serving you well!");
        } else if (avgMood < 4) {
          fallbackInsights.push("It looks like you've been having a tough stretch. Remember to be gentle with yourself and reach out if you need support.");
        }

        setAnalysis(fallbackInsights.map(i => `* ${i}`).join('\n'));
      } finally {
        setLoading(false);
      }
    };

    analyzeTrends();
  }, [entries]);

  const getMoodColor = (mood: number | null) => {
    if (mood === null) return 'bg-gray-50';
    if (mood <= 2) return 'bg-[#FF5C5C]';
    if (mood <= 4) return 'bg-[#B2E2F2]';
    if (mood <= 6) return 'bg-[#E2B2F2]';
    if (mood <= 8) return 'bg-[#FFD2A0]';
    return 'bg-[#D7FE63]';
  };

  const getMoodLabel = (mood: number | null) => {
    if (mood === null) return 'No data';
    if (mood <= 2) return 'Stormy';
    if (mood <= 4) return 'Cloudy';
    if (mood <= 6) return 'Misty';
    if (mood <= 8) return 'Bright';
    return 'Radiant';
  };

  if (entries.length < 3) {
    return (
      <div className="app-card bg-white border-dashed border-2 border-black/5 text-center py-12">
        <div className="w-12 h-12 bg-app-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} className="text-app-blue" />
        </div>
        <h3 className="text-xl font-bold text-app-text mb-2">Gathering your story</h3>
        <p className="text-app-muted text-sm max-w-xs mx-auto">
          As you share more of your journey (at least 3 entries), I'll be able to help you see the beautiful patterns in your life. ✨
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Card */}
      <div className="app-card bg-white border border-black/5 p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-app-lavender rounded-full flex items-center justify-center shadow-sm">
              <Brain size={24} className="text-app-text" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-app-text">Deep Reflections</h3>
              <p className="text-xs text-app-muted font-bold uppercase tracking-widest">AI Insights</p>
            </div>
          </div>
          {isFallback && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-app-muted bg-app-bg px-2 py-1 rounded-full">
              <Sparkles size={10} />
              <span>Pattern Analysis</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-app-muted gap-4">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-lg font-bold">Listening to the whispers of your notes...</span>
          </div>
        ) : error ? (
          <div className="p-6 bg-app-pink/10 rounded-2xl text-app-pink text-sm font-bold flex items-center gap-3">
            <AlertCircle size={18} />
            {error}
          </div>
        ) : (
          <div className="space-y-4 text-app-text leading-relaxed">
            {analysis?.split('\n').filter(line => line.trim()).map((line, i) => (
              <p key={i} className="opacity-80 font-medium italic">
                {line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim()) ? (
                  <span className="flex gap-3">
                    <Sparkles size={16} className="text-app-lime mt-1 flex-shrink-0" />
                    {line.replace(/^([-*]|\d+\.)\s*/, '')}
                  </span>
                ) : line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

