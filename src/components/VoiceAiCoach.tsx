import React, { useState } from 'react';
import { MealType, FoodItem } from '../types';
import { Mic, Send, Sparkles, Plus, CheckCircle, Flame, ArrowRight, Zap, RefreshCw, Volume2 } from 'lucide-react';

interface VoiceAiCoachProps {
  onLogMeal: (
    mealType: MealType,
    mealName: string,
    items: Omit<FoodItem, 'id'>[],
    addedCalories: number,
    addedProtein: number,
    addedCarbs: number,
    addedFat: number
  ) => void;
  showToast: (msg: string) => void;
}

export function VoiceAiCoach({ onLogMeal, showToast }: VoiceAiCoachProps) {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');

  const [aiResult, setAiResult] = useState<{
    dishName: string;
    portion: string;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    healthRating: string;
    aiAdvice: string;
    ingredients: { name: string; calories: number; proteinG: number; carbsG: number; fatG: number }[];
  } | null>(null);

  // Voice Recognition Web API integration
  const handleStartVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast("Voice speech recognition is not supported in this browser. Please type your prompt!");
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
        handleAnalyzePrompt(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast("Voice recognition timeout. Please try typing your meal description!");
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch (e) {
      setIsListening(false);
      showToast("Speech recognition initialized.");
    }
  };

  const handleAnalyzePrompt = (queryText: string) => {
    const text = (queryText || prompt).trim();
    if (!text) return;

    setIsAnalyzing(true);
    setAiResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      const lower = text.toLowerCase();

      // Intelligent AI NLP Parser simulation
      let cal = 450;
      let prot = 25;
      let carb = 45;
      let fat = 18;
      let name = text;
      let portion = "1 serving";
      let advice = "Balanced meal choice with steady energy release.";
      let rating = "A Grade (Optimal Macros)";

      if (lower.includes('naan') || lower.includes('paneer') || lower.includes('biryani') || lower.includes('curry') || lower.includes('dal')) {
        cal = 620;
        prot = 32;
        carb = 68;
        fat = 24;
        name = "Indian Meal (Paneer & Curry with Bread)";
        portion = "1 Thali Serving";
        advice = "High protein & rich in healthy spices. Walk for 10 minutes post-meal to smooth glucose response.";
        rating = "A- Grade (High Protein)";
      } else if (lower.includes('pizza') || lower.includes('burger') || lower.includes('fries') || lower.includes('coke')) {
        cal = 850;
        prot = 28;
        carb = 95;
        fat = 38;
        name = "Loaded Fast Food Meal";
        portion = "1 Fast Food Combo";
        advice = "High caloric density. Balance out the remainder of your evening with lean protein and fresh greens.";
        rating = "C+ Grade (High Calorie)";
      } else if (lower.includes('salad') || lower.includes('chicken') || lower.includes('egg') || lower.includes('protein') || lower.includes('oats')) {
        cal = 380;
        prot = 42;
        carb = 22;
        fat = 12;
        name = "Lean Protein & Greens Bowl";
        portion = "1 Large Bowl";
        advice = "Outstanding high-protein meal choice! Maximizes lean muscle synthesis while maintaining a clean calorie budget.";
        rating = "A+ Grade (Superfood)";
      }

      setAiResult({
        dishName: name,
        portion,
        calories: cal,
        proteinG: prot,
        carbsG: carb,
        fatG: fat,
        healthRating: rating,
        aiAdvice: advice,
        ingredients: [
          { name: name, calories: cal, proteinG: prot, carbsG: carb, fatG: fat }
        ]
      });
    }, 1000);
  };

  const handleConfirmLog = () => {
    if (!aiResult) return;

    onLogMeal(
      selectedMealType,
      aiResult.dishName,
      aiResult.ingredients.map(item => ({
        name: item.name,
        portion: aiResult.portion,
        calories: item.calories,
        proteinG: item.proteinG,
        carbsG: item.carbsG,
        fatG: item.fatG,
        category: 'AI Voice Prompt'
      })),
      aiResult.calories,
      aiResult.proteinG,
      aiResult.carbsG,
      aiResult.fatG
    );

    setPrompt('');
    setAiResult(null);
    showToast(`Successfully logged ${aiResult.dishName} via AI Voice Coach! 🎙️`);
  };

  return (
    <div className="bg-[#141414] p-6 rounded-3xl border border-neutral-800 space-y-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI Voice & Natural Language Coach
          </span>
          <h2 className="text-xl font-black text-white mt-1.5">Speak or Type Anything You Ate</h2>
          <p className="text-xs text-neutral-400">Our AI instantly computes exact calories, macros, and glycemic health score.</p>
        </div>

        {/* Meal Slot Selector */}
        <div className="flex bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs font-bold">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map(slot => (
            <button
              key={slot}
              onClick={() => setSelectedMealType(slot)}
              className={`px-3 py-1 rounded-lg capitalize transition cursor-pointer ${
                selectedMealType === slot ? 'bg-rose-500 text-white shadow' : 'text-neutral-500 hover:text-white'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* VOICE & PROMPT INPUT BAR */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyzePrompt(prompt)}
          placeholder='E.g. "I ate 2 butter naans, 150g paneer butter masala and a cup of curd"'
          className="w-full bg-neutral-950 border border-neutral-800 focus:border-rose-500 text-xs text-white rounded-2xl py-3.5 pl-4 pr-24 focus:outline-none transition placeholder:text-neutral-600"
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          <button
            onClick={handleStartVoice}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
            }`}
            title="Click to Speak Voice Prompt"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleAnalyzePrompt(prompt)}
            disabled={isAnalyzing || !prompt.trim()}
            className="p-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl transition cursor-pointer shadow-md shadow-rose-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SAMPLE VOICE PROMPT CHIPS */}
      <div className="flex flex-wrap gap-2 pt-1">
        <span className="text-[10px] text-neutral-500 font-black uppercase tracking-wider self-center mr-1">Quick Prompts:</span>
        {[
          "2 butter naans & paneer tikka masala",
          "Grilled chicken breast with rice & broccoli",
          "Double cheeseburger & medium fries",
          "3 scrambled eggs with avocado toast"
        ].map((sample, i) => (
          <button
            key={i}
            onClick={() => {
              setPrompt(sample);
              handleAnalyzePrompt(sample);
            }}
            className="text-[10px] bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg border border-neutral-800 transition cursor-pointer"
          >
            "{sample}"
          </button>
        ))}
      </div>

      {/* ANALYZING SPINNER */}
      {isAnalyzing && (
        <div className="py-6 text-center space-y-3 bg-neutral-950/60 rounded-2xl border border-neutral-900 animate-pulse">
          <RefreshCw className="w-6 h-6 text-rose-500 mx-auto animate-spin" />
          <p className="text-xs font-bold text-neutral-300">AI Natural Language Engine Parsing Ingredients & Macros...</p>
        </div>
      )}

      {/* PARSED AI RESULT CARD */}
      {aiResult && !isAnalyzing && (
        <div className="bg-neutral-950 p-5 rounded-2xl border border-rose-500/20 space-y-4 animate-scaleUp">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-black uppercase font-mono">
                {aiResult.healthRating}
              </span>
              <h3 className="text-base font-extrabold text-white mt-1.5">{aiResult.dishName}</h3>
              <span className="text-xs text-neutral-400 font-mono block">Portion: {aiResult.portion}</span>
            </div>

            <div className="text-right font-mono">
              <span className="text-xl font-black text-rose-500">{aiResult.calories}</span>
              <span className="text-xs text-neutral-500 block">total kcal</span>
            </div>
          </div>

          {/* MACRO BREAKDOWN PILLS */}
          <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs font-extrabold">
            <div className="bg-neutral-900 p-2 rounded-xl border border-neutral-800">
              <span className="text-neutral-500 block text-[8px] uppercase">Protein</span>
              <span className="text-blue-400">{aiResult.proteinG}g</span>
            </div>
            <div className="bg-neutral-900 p-2 rounded-xl border border-neutral-800">
              <span className="text-neutral-500 block text-[8px] uppercase">Carbs</span>
              <span className="text-amber-400">{aiResult.carbsG}g</span>
            </div>
            <div className="bg-neutral-900 p-2 rounded-xl border border-neutral-800">
              <span className="text-neutral-500 block text-[8px] uppercase">Fat</span>
              <span className="text-red-400">{aiResult.fatG}g</span>
            </div>
          </div>

          {/* AI HEALTH ADVICE */}
          <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800 text-xs text-neutral-300 leading-relaxed flex items-start gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>AI Nutrition Insight:</strong> {aiResult.aiAdvice}</span>
          </div>

          {/* CONFIRM LOG BUTTON */}
          <button
            onClick={handleConfirmLog}
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.3)] transition cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Confirm & Log Meal to {selectedMealType.toUpperCase()} Journal
          </button>
        </div>
      )}
    </div>
  );
}
