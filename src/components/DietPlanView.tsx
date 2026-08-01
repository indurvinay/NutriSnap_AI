import React, { useState, useEffect } from 'react';
import { UserProfile, DailyLog, DietType, CuisineType, RecommendedMeal, DayDietPlan, MealType, FoodItem } from '../types';
import { generatePersonalizedDietPlan } from '../data/dietPlanGenerator';
import { VoiceAiCoach } from './VoiceAiCoach';
import {
  Sparkles,
  Utensils,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Flame,
  BookOpen,
  ShoppingBag,
  Timer,
  AlertCircle,
  TrendingUp,
  RotateCcw,
  Check,
  Zap,
  Target,
  Share2,
  Calendar,
  Globe,
  RefreshCw,
  Sliders,
  Copy,
  Users,
  ArrowRight,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';

interface DietPlanViewProps {
  profile: UserProfile;
  todayLog: DailyLog;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogMeal: (
    mealType: MealType,
    mealName: string,
    items: Omit<FoodItem, 'id'>[],
    addedCalories: number,
    addedProtein: number,
    addedCarbs: number,
    addedFat: number
  ) => void;
  onUpgradePrompt: () => void;
  showToast: (msg: string) => void;
}

export function DietPlanView({
  profile,
  todayLog,
  onUpdateProfile,
  onLogMeal,
  onUpgradePrompt,
  showToast
}: DietPlanViewProps) {
  // Wizard state: if user wants to build/customize a fresh diet plan step-by-step
  const [isWizardActive, setIsWizardActive] = useState<boolean>(!profile.dietType);
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Wizard selections
  const [selectedDiet, setSelectedDiet] = useState<DietType>(profile.dietType || 'high_protein');
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType>(profile.cuisinePreference || 'all');
  const [selectedFoods, setSelectedFoods] = useState<Record<string, boolean>>({
    'Paneer & Oats Pancakes': true,
    'Tandoori Chicken Tikka': true,
    'Teriyaki Soba Noodles': true,
    'Greek Shakshuka': true,
    'Carne Asada Steak': true,
    'Egg White Avocado Toast': true,
    'Miso Glazed Wild Cod': true,
    'Masala Makhana & Sprouts': true
  });

  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'schedule' | 'adherence' | 'fasting' | 'shopping'>('schedule');
  const [selectedMealRecipe, setSelectedMealRecipe] = useState<RecommendedMeal | null>(null);
  const [cookingPortionScale, setCookingPortionScale] = useState<number>(1);
  
  // Custom swapped meals state override per meal ID
  const [swappedMeals, setSwappedMeals] = useState<Record<string, RecommendedMeal>>({});

  // Shopping list item check states
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // Fasting Timer State
  const [fastingHours, setFastingHours] = useState<number>(16);
  const [isFasting, setIsFasting] = useState<boolean>(false);
  const [fastingElapsedSeconds, setFastingElapsedSeconds] = useState<number>(0);

  // Generate current plan based on profile
  const dietPlan = generatePersonalizedDietPlan(profile);
  const activeDayPlan: DayDietPlan = dietPlan.days[selectedDayIdx] || dietPlan.days[0];

  // Intermittent Fasting Interval Timer
  useEffect(() => {
    let intervalId: any = null;
    if (isFasting) {
      intervalId = setInterval(() => {
        setFastingElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isFasting]);

  // Compute Today's Consumed Totals for Adherence Tracking
  let todayConsumedCal = 0;
  let todayConsumedProt = 0;
  let todayConsumedCarb = 0;
  let todayConsumedFat = 0;

  if (todayLog && todayLog.meals) {
    Object.values(todayLog.meals).forEach(m => {
      todayConsumedCal += m.totalCalories || 0;
      todayConsumedProt += m.totalProtein || 0;
      todayConsumedCarb += m.totalCarbs || 0;
      todayConsumedFat += m.totalFat || 0;
    });
  }

  // Calculate Adherence Score
  const calMatch = Math.min(100, Math.round((todayConsumedCal / (dietPlan.targetCalories || 1)) * 100));
  const protMatch = Math.min(100, Math.round((todayConsumedProt / (dietPlan.targetProtein || 1)) * 100));
  const carbMatch = Math.min(100, Math.round((todayConsumedCarb / (dietPlan.targetCarbs || 1)) * 100));
  const fatMatch = Math.min(100, Math.round((todayConsumedFat / (dietPlan.targetFat || 1)) * 100));

  const overallAdherence = Math.round((calMatch + protMatch + carbMatch + fatMatch) / 4);

  // Format Fasting Timer seconds
  const formatFastingTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fastingTargetSecs = fastingHours * 3600;
  const fastingProgressPct = Math.min(100, (fastingElapsedSeconds / fastingTargetSecs) * 100);

  const getFastingPhase = (secs: number) => {
    const hrs = secs / 3600;
    if (hrs < 4) return { stage: "Anabolic Digesting", desc: "Body is absorbing nutrients from your last meal.", color: "text-blue-400" };
    if (hrs < 8) return { stage: "Blood Sugar Balancing", desc: "Insulin levels drop and glycogen breakdown begins.", color: "text-amber-400" };
    if (hrs < 12) return { stage: "Glycogen Depletion", desc: "Stored carbohydrates are depleted; lipolysis initiates.", color: "text-orange-400" };
    if (hrs < 16) return { stage: "Nutritional Ketosis", desc: "Fatty acids are converted into ketones for brain energy.", color: "text-rose-500 font-bold" };
    return { stage: "Autophagy & Deep Repair", desc: "Cellular recycling and growth hormone surge active.", color: "text-emerald-400 font-black" };
  };

  const activeFastingPhase = getFastingPhase(fastingElapsedSeconds);

  // Finalize Wizard Setup when user presses "DONE"
  const handleCompleteWizard = () => {
    onUpdateProfile({
      ...profile,
      dietType: selectedDiet,
      cuisinePreference: selectedCuisine
    });
    setIsWizardActive(false);
    showToast(`Complete Personalized ${selectedDiet.toUpperCase()} Diet Plan created! 🎉`);
  };

  // Perform AI Meal Swap
  const handleSwapMealWithAlternative = (meal: RecommendedMeal) => {
    if (!meal.swapAlternatives || meal.swapAlternatives.length === 0) {
      showToast("No alternative meal swap available for this item.");
      return;
    }

    const nextAlt = meal.swapAlternatives[0];
    const updatedMeal: RecommendedMeal = {
      ...meal,
      name: nextAlt.name,
      calories: nextAlt.calories,
      proteinG: nextAlt.proteinG,
      carbsG: nextAlt.carbsG,
      fatG: nextAlt.fatG,
      ingredients: nextAlt.ingredients,
      description: `AI Swapped Alternative: ${nextAlt.name} with exact macro alignment (${nextAlt.calories} kcal).`
    };

    setSwappedMeals(prev => ({
      ...prev,
      [meal.id]: updatedMeal
    }));

    showToast(`Swapped meal for ${nextAlt.name}! 🔄`);
  };

  // One-click log recommended meal to today's food journal
  const handleQuickLogRecommendedMeal = (meal: RecommendedMeal) => {
    const activeMeal = swappedMeals[meal.id] || meal;
    onLogMeal(
      activeMeal.mealType,
      activeMeal.name,
      activeMeal.ingredients.map(ing => ({
        name: ing,
        portion: '1 serving',
        calories: Math.round(activeMeal.calories / activeMeal.ingredients.length),
        proteinG: Number((activeMeal.proteinG / activeMeal.ingredients.length).toFixed(1)),
        carbsG: Number((activeMeal.carbsG / activeMeal.ingredients.length).toFixed(1)),
        fatG: Number((activeMeal.fatG / activeMeal.ingredients.length).toFixed(1)),
        category: 'AI Recommended Plan'
      })),
      activeMeal.calories,
      activeMeal.proteinG,
      activeMeal.carbsG,
      activeMeal.fatG
    );
    showToast(`Logged ${activeMeal.name} to your food journal! 🥗`);
  };

  const dietTypes: { id: DietType; label: string; tag: string }[] = [
    { id: 'high_protein', label: 'High Protein', tag: 'Hypertrophy' },
    { id: 'keto', label: 'Keto', tag: 'Fat Burn' },
    { id: 'balanced', label: 'Balanced', tag: 'Vitality' },
    { id: 'low_carb', label: 'Low Carb', tag: 'Deficit' },
    { id: 'mediterranean', label: 'Mediterranean', tag: 'Heart Health' },
    { id: 'vegan', label: 'Vegan', tag: 'Plant-Based' },
    { id: 'intermittent_fasting', label: '16:8 Fasting', tag: 'Autophagy' }
  ];

  const cuisines: { id: CuisineType; label: string; flag: string }[] = [
    { id: 'all', label: 'Global Cuisine', flag: '🌐' },
    { id: 'indian', label: 'Indian Flavour', flag: '🇮🇳' },
    { id: 'asian', label: 'Asian & Korean', flag: '🇯🇵' },
    { id: 'mediterranean', label: 'Mediterranean', flag: '🇬🇷' },
    { id: 'mexican', label: 'Mexican Fiesta', flag: '🇲🇽' },
    { id: 'western', label: 'Western Clean', flag: '🇺🇸' }
  ];

  const sampleFoodCatalog = [
    { name: 'Paneer & Oats Pancakes', category: 'Breakfast', cal: 420, protein: 32 },
    { name: 'Tandoori Chicken Tikka', category: 'Lunch', cal: 580, protein: 48 },
    { name: 'Teriyaki Soba Noodles', category: 'Lunch', cal: 520, protein: 38 },
    { name: 'Greek Shakshuka', category: 'Breakfast', cal: 390, protein: 26 },
    { name: 'Carne Asada Steak', category: 'Dinner', cal: 620, protein: 52 },
    { name: 'Egg White Avocado Toast', category: 'Breakfast', cal: 360, protein: 28 },
    { name: 'Miso Glazed Wild Cod', category: 'Dinner', cal: 450, protein: 44 },
    { name: 'Masala Makhana & Sprouts', category: 'Snack', cal: 220, protein: 14 }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none" id="component-diet-plan">
      
      {/* ----------------- STEP-BY-STEP DIET WIZARD MODE ----------------- */}
      {isWizardActive ? (
        <div className="bg-[#141414] p-8 rounded-3xl border border-neutral-800 space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
            <div>
              <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> AI Diet Builder & Customizer
              </span>
              <h2 className="text-2xl font-black text-white mt-2">Design Your Master Diet Plan</h2>
              <p className="text-xs text-neutral-400">Step {wizardStep} of 3: Customize your preferences and food items.</p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-neutral-400">
              <span className={wizardStep >= 1 ? "text-rose-500" : ""}>1. Protocol</span> ➔ 
              <span className={wizardStep >= 2 ? "text-rose-500" : ""}>2. Cuisine</span> ➔ 
              <span className={wizardStep >= 3 ? "text-rose-500" : ""}>3. Food Choice</span>
            </div>
          </div>

          {/* STEP 1: SELECT MACRO PROTOCOL & DIET TYPE */}
          {wizardStep === 1 && (
            <div className="space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-500" /> Choose Macro & Diet Protocol
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dietTypes.map(dt => {
                  const isSelected = selectedDiet === dt.id;
                  return (
                    <div
                      key={dt.id}
                      onClick={() => setSelectedDiet(dt.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'bg-rose-500/10 border-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-extrabold">{dt.label}</span>
                        {isSelected ? <CheckCircle2 className="w-4 h-4 text-rose-500" /> : <div className="w-4 h-4 rounded-full border border-neutral-700" />}
                      </div>
                      <span className="text-[10px] bg-neutral-950 px-2 py-0.5 rounded font-mono font-bold text-neutral-400 w-fit">
                        {dt.tag}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setWizardStep(2)}
                  className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.3)] transition cursor-pointer flex items-center gap-2"
                >
                  Next: Select Cuisine <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT CUISINE PREFERENCE */}
          {wizardStep === 2 && (
            <div className="space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-500" /> Choose Regional Cuisine Profile
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {cuisines.map(c => {
                  const isSelected = selectedCuisine === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCuisine(c.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-500/10 border-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.flag}</span>
                        <span className="text-sm font-extrabold">{c.label}</span>
                      </div>
                      {isSelected ? <CheckCircle2 className="w-4 h-4 text-rose-500" /> : <div className="w-4 h-4 rounded-full border border-neutral-700" />}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setWizardStep(1)}
                  className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs font-bold rounded-xl border border-neutral-800 transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setWizardStep(3)}
                  className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.3)] transition cursor-pointer flex items-center gap-2"
                >
                  Next: Customize Food Items <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT PREFERRED FOOD ITEMS & PRESS DONE */}
          {wizardStep === 3 && (
            <div className="space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Utensils className="w-4 h-4 text-rose-500" /> Choose Preferred Food Items for Your Plan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sampleFoodCatalog.map(food => {
                  const isChecked = !!selectedFoods[food.name];
                  return (
                    <div
                      key={food.name}
                      onClick={() => setSelectedFoods(prev => ({ ...prev, [food.name]: !isChecked }))}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isChecked
                          ? 'bg-rose-500/10 border-rose-500 text-white'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <span className="text-[9px] bg-neutral-950 text-neutral-400 px-2 py-0.5 rounded font-mono font-bold uppercase block w-fit mb-1">
                          {food.category}
                        </span>
                        <h4 className="text-xs font-extrabold text-white">{food.name}</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">{food.cal} kcal · {food.protein}g protein</span>
                      </div>

                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                        isChecked ? 'bg-rose-500 border-rose-500 text-white' : 'border-neutral-700'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FINAL DONE BUTTON */}
              <div className="flex justify-between pt-4 border-t border-neutral-900">
                <button
                  onClick={() => setWizardStep(2)}
                  className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs font-bold rounded-xl border border-neutral-800 transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleCompleteWizard}
                  className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.4)] transition cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                >
                  <CheckCircle2 className="w-4 h-4" /> DONE: GENERATE MY COMPLETE DIET PLAN
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ----------------- COMPLETED 7-DAY DIET PLAN DISPLAY ----------------- */
        <div className="space-y-6 animate-fadeIn">
          {/* TOP HEADER & DIET ARCHITECT DISPLAY */}
          <div className="bg-[#141414] p-6 rounded-3xl border border-neutral-800 space-y-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Active Customized AI Diet Plan
                  </span>
                  <span className="bg-neutral-800 text-neutral-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono">
                    {profile.goal.toUpperCase()} GOAL
                  </span>
                </div>
                <h1 className="text-2xl font-black text-white mt-1.5 flex items-center gap-2">
                  {dietPlan.title}
                </h1>
                <p className="text-xs text-neutral-400 max-w-2xl mt-1 leading-relaxed">
                  {dietPlan.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsWizardActive(true);
                    setWizardStep(1);
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-rose-400 text-xs font-bold rounded-xl border border-neutral-800 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" /> Re-build Diet Plan
                </button>

                <div className="flex items-center gap-3 bg-neutral-900/80 p-3 rounded-2xl border border-neutral-800 shrink-0 font-mono">
                  <div className="text-right">
                    <span className="text-[9px] text-neutral-500 uppercase font-black block">Target Energy</span>
                    <span className="text-lg font-black text-rose-500">{dietPlan.targetCalories} <span className="text-xs font-normal text-neutral-400">kcal</span></span>
                  </div>
                  <div className="h-8 w-[1px] bg-neutral-800" />
                  <div className="text-right">
                    <span className="text-[9px] text-neutral-500 uppercase font-black block">Target Protein</span>
                    <span className="text-lg font-black text-blue-400">{dietPlan.targetProtein}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION SUB-TABS */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Calendar className="w-4 h-4" /> 7-Day Meal Schedule
              </button>

              <button
                onClick={() => setActiveTab('adherence')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'adherence'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Target className="w-4 h-4" /> Adherence ({overallAdherence}%)
              </button>

              <button
                onClick={() => setActiveTab('fasting')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'fasting'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Timer className="w-4 h-4" /> Fasting Timer {isFasting && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
              </button>

              <button
                onClick={() => setActiveTab('shopping')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'shopping'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> Grocery Checklist
              </button>
            </div>

            <button
              onClick={() => {
                showToast("Copied complete diet plan summary to clipboard!");
              }}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-xs font-bold border border-neutral-800 flex items-center gap-1.5 transition cursor-pointer shrink-0 ml-2"
            >
              <Share2 className="w-3.5 h-3.5 text-rose-400" /> Export Summary
            </button>
          </div>

          {/* TAB 1: 7-DAY MEAL SCHEDULE & AI SWAPPER */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* DAY OF THE WEEK SELECTOR */}
              <div className="grid grid-cols-7 gap-2">
                {dietPlan.days.map((day, idx) => {
                  const isSelected = selectedDayIdx === idx;
                  return (
                    <button
                      key={day.dayNumber}
                      onClick={() => setSelectedDayIdx(idx)}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                        isSelected
                          ? 'bg-rose-500 border-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-[1.02]'
                          : 'bg-[#141414] border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider">{day.dayName.slice(0, 3)}</span>
                      <span className="text-base font-extrabold font-mono my-1">Day {day.dayNumber}</span>
                      <span className={`text-[9px] font-mono font-bold ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                        {day.dayCalories} kcal
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* DAY MACRO SUMMARY HEADER */}
              <div className="bg-[#141414] p-4 rounded-2xl border border-neutral-800 flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm">{activeDayPlan.dayName} Menu</span>
                  <span className="text-neutral-500">({activeDayPlan.meals.length} Meals)</span>
                </div>

                <div className="flex items-center gap-4 font-bold">
                  <span className="text-rose-400">{activeDayPlan.dayCalories} kcal</span>
                  <span className="text-blue-400">{activeDayPlan.dayProtein}g Protein</span>
                  <span className="text-amber-400">{activeDayPlan.dayCarbs}g Carbs</span>
                  <span className="text-red-400">{activeDayPlan.dayFat}g Fat</span>
                </div>
              </div>

              {/* RECOMMENDED MEALS CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDayPlan.meals.map(baseMeal => {
                  const meal = swappedMeals[baseMeal.id] || baseMeal;
                  return (
                    <div
                      key={meal.id}
                      className="bg-[#141414] rounded-2xl border border-neutral-800 p-5 space-y-4 hover:border-neutral-700 transition flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                              {meal.mealType}
                            </span>
                            <span className="text-[9px] font-mono font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded">
                              GI: {meal.glycemicIndex?.toUpperCase() || 'LOW'}
                            </span>
                          </div>

                          <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-neutral-500" /> {meal.prepTimeMinutes} mins
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-white leading-snug">{meal.name}</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">{meal.description}</p>
                      </div>

                      {/* MACRO PILLS */}
                      <div className="grid grid-cols-4 gap-2 pt-2 font-mono text-[10px] font-bold text-center">
                        <div className="bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                          <span className="text-neutral-500 block text-[8px] uppercase">Calories</span>
                          <span className="text-rose-400 text-xs font-black">{meal.calories}</span>
                        </div>
                        <div className="bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                          <span className="text-neutral-500 block text-[8px] uppercase">Protein</span>
                          <span className="text-blue-400 text-xs font-black">{meal.proteinG}g</span>
                        </div>
                        <div className="bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                          <span className="text-neutral-500 block text-[8px] uppercase">Carbs</span>
                          <span className="text-amber-400 text-xs font-black">{meal.carbsG}g</span>
                        </div>
                        <div className="bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                          <span className="text-neutral-500 block text-[8px] uppercase">Fat</span>
                          <span className="text-red-400 text-xs font-black">{meal.fatG}g</span>
                        </div>
                      </div>

                      {/* ACTION BUTTONS: RECIPE & PORTION SCALER, AI SWAP & JOURNAL LOG */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-900">
                        <button
                          onClick={() => {
                            setSelectedMealRecipe(meal);
                            setCookingPortionScale(1);
                          }}
                          className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-rose-400 border border-rose-500/30 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-[0_0_10px_rgba(244,63,94,0.15)]"
                          title="View Interactive Cooking Recipe & Portion Scaler"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-rose-500" /> 👩‍🍳 Recipe & Scaler
                        </button>

                        <button
                          onClick={() => handleSwapMealWithAlternative(baseMeal)}
                          className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                          title="Swap for AI Alternative"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> 🔄 AI Swap
                        </button>

                        <button
                          onClick={() => handleQuickLogRecommendedMeal(meal)}
                          className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition shadow-[0_0_15px_rgba(244,63,94,0.3)] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> ➕ Log Meal to Journal
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: REAL-TIME ADHERENCE TRACKER & AI SUGGESTIONS */}
          {activeTab === 'adherence' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ADHERENCE GAUGE TILE */}
                <div className="bg-[#141414] p-6 rounded-3xl border border-neutral-800 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg width="140" height="140" className="transform -rotate-90">
                      <circle cx="70" cy="70" r="58" stroke="#222" strokeWidth="10" fill="transparent" />
                      <circle
                        cx="70"
                        cy="70"
                        r="58"
                        stroke="#f43f5e"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 58}
                        strokeDashoffset={(2 * Math.PI * 58) * (1 - overallAdherence / 100)}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-white font-mono">{overallAdherence}%</span>
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-0.5">ADHERENCE</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Daily Plan Match</h3>
                    <p className="text-xs text-neutral-400 mt-1">Based on today's logged food items versus active diet targets.</p>
                  </div>
                </div>

                {/* CONSUMED VS TARGET COMPARISON BARS */}
                <div className="md:col-span-2 bg-[#141414] p-6 rounded-3xl border border-neutral-800 space-y-4">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-rose-500" /> Today's Macro Alignment Breakdown
                  </h3>

                  <div className="space-y-3.5 pt-1">
                    {/* Calories */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400 font-bold">Calories</span>
                        <span className="text-white font-bold">{todayConsumedCal} <span className="text-neutral-500">/ {dietPlan.targetCalories} kcal ({calMatch}%)</span></span>
                      </div>
                      <div className="w-full bg-neutral-900 border border-neutral-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full transition-all duration-700" style={{ width: `${calMatch}%` }} />
                      </div>
                    </div>

                    {/* Protein */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400 font-bold">Protein</span>
                        <span className="text-white font-bold">{todayConsumedProt}g <span className="text-neutral-500">/ {dietPlan.targetProtein}g ({protMatch}%)</span></span>
                      </div>
                      <div className="w-full bg-neutral-900 border border-neutral-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full transition-all duration-700" style={{ width: `${protMatch}%` }} />
                      </div>
                    </div>

                    {/* Carbs */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400 font-bold">Carbohydrates</span>
                        <span className="text-white font-bold">{todayConsumedCarb}g <span className="text-neutral-500">/ {dietPlan.targetCarbs}g ({carbMatch}%)</span></span>
                      </div>
                      <div className="w-full bg-neutral-900 border border-neutral-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: `${carbMatch}%` }} />
                      </div>
                    </div>

                    {/* Fat */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400 font-bold">Fats</span>
                        <span className="text-white font-bold">{todayConsumedFat}g <span className="text-neutral-500">/ {dietPlan.targetFat}g ({fatMatch}%)</span></span>
                      </div>
                      <div className="w-full bg-neutral-900 border border-neutral-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full transition-all duration-700" style={{ width: `${fatMatch}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTERMITTENT FASTING TIMER */}
          {activeTab === 'fasting' && (
            <div className="bg-[#141414] p-8 rounded-3xl border border-neutral-800 space-y-6 text-center">
              <div className="space-y-2 max-w-md mx-auto">
                <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5" /> Intermittent Fasting Protocol
                </span>
                <h2 className="text-xl font-black text-white">{fastingHours}:{24 - fastingHours} Fasting Window</h2>
                <p className="text-xs text-neutral-400">Track your metabolic fasting state, glycogen depletion, and cellular autophagy.</p>
              </div>

              {/* PROTOCOL SELECTOR CHIPS */}
              <div className="flex justify-center gap-2">
                {[16, 18, 20].map(hrs => (
                  <button
                    key={hrs}
                    onClick={() => {
                      setFastingHours(hrs);
                      setFastingElapsedSeconds(0);
                      setIsFasting(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      fastingHours === hrs
                        ? 'bg-rose-500 text-white font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                        : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
                    }`}
                  >
                    {hrs}:{24 - hrs} ({hrs} hrs fast)
                  </button>
                ))}
              </div>

              {/* BIG COUNTDOWN CIRCULAR RING */}
              <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-4">
                <svg width="250" height="250" className="transform -rotate-90">
                  <circle cx="125" cy="125" r="105" stroke="#222" strokeWidth="12" fill="transparent" />
                  <circle
                    cx="125"
                    cy="125"
                    r="105"
                    stroke="#f43f5e"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 105}
                    strokeDashoffset={(2 * Math.PI * 105) * (1 - fastingProgressPct / 100)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                  <span className="text-4xl font-black text-white font-mono tracking-tight">
                    {formatFastingTime(fastingElapsedSeconds)}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Target: {fastingHours}h 00m
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 ${activeFastingPhase.color}`}>
                    {activeFastingPhase.stage}
                  </span>
                </div>
              </div>

              {/* METABOLIC PHASE DESCRIPTON */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 max-w-md mx-auto text-left">
                <span className="text-[10px] text-neutral-500 font-black uppercase tracking-wider block">Current Metabolic Phase</span>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{activeFastingPhase.desc}</p>
              </div>

              {/* START / STOP CONTROLS */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsFasting(!isFasting)}
                  className={`px-8 py-3 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                    isFasting
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      : 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                  }`}
                >
                  {isFasting ? 'Pause Fasting Timer' : 'Start Fasting Timer Now'}
                </button>

                {fastingElapsedSeconds > 0 && (
                  <button
                    onClick={() => {
                      setIsFasting(false);
                      setFastingElapsedSeconds(0);
                    }}
                    className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-2xl text-xs font-bold border border-neutral-800 transition cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIZED SUPERMARKET AISLE GROCERY CHECKLIST */}
          {activeTab === 'shopping' && (
            <div className="bg-[#141414] p-6 rounded-3xl border border-neutral-800 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-rose-500" /> Aisle-by-Aisle Grocery Checklist
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">Categorized supermarket ingredients for your active {dietPlan.title}.</p>
                </div>
                <button
                  onClick={() => {
                    const allItems = dietPlan.shoppingAisles.flatMap(a => a.items).join("\n- ");
                    navigator.clipboard.writeText(`CalTrack AI Grocery List:\n- ${allItems}`);
                    showToast("Copied grocery checklist to clipboard!");
                  }}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-rose-400 rounded-lg text-xs font-bold border border-neutral-800 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy List
                </button>
              </div>

              <div className="space-y-6 pt-2">
                {dietPlan.shoppingAisles.map((aisle, aIdx) => (
                  <div key={aIdx} className="space-y-3">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider text-rose-400 border-b border-neutral-900 pb-1.5">
                      {aisle.category} ({aisle.items.length})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {aisle.items.map((item, iIdx) => {
                        const isChecked = !!checkedIngredients[item];
                        return (
                          <div
                            key={iIdx}
                            onClick={() => setCheckedIngredients(prev => ({ ...prev, [item]: !isChecked }))}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              isChecked
                                ? 'bg-rose-500/5 border-rose-500/20 text-neutral-500 line-through'
                                : 'bg-neutral-900/60 border-neutral-800 text-white hover:border-neutral-700'
                            }`}
                          >
                            <span className="text-xs font-bold">{item}</span>
                            <div className={`w-4.5 h-4.5 rounded-lg border flex items-center justify-center transition ${
                              isChecked ? 'bg-rose-500 border-rose-500 text-white' : 'border-neutral-700'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RECIPE DETAILS & PORTION SCALER COOKING MODAL */}
      {selectedMealRecipe && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-md">
                  {selectedMealRecipe.mealType} Recipe · {selectedMealRecipe.cuisine.toUpperCase()}
                </span>
                <h2 className="text-xl font-extrabold text-white mt-2">{selectedMealRecipe.name}</h2>
              </div>
              <button
                onClick={() => setSelectedMealRecipe(null)}
                className="text-neutral-500 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* PORTION SCALER CONTROL */}
            <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-900 flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-400 font-bold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-400" /> Portion Serving Scale:
              </span>
              <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                {[1, 2, 4].map(scale => (
                  <button
                    key={scale}
                    onClick={() => setCookingPortionScale(scale)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      cookingPortionScale === scale ? 'bg-rose-500 text-white' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    {scale}x {scale === 1 ? 'Solo' : scale === 2 ? 'Duo' : 'Family'}
                  </button>
                ))}
              </div>
            </div>

            {/* SCALED MACROS */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono text-[10px] font-bold">
              <div className="bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block">Calories</span>
                <span className="text-rose-400 text-xs font-black">{Math.round(selectedMealRecipe.calories * cookingPortionScale)}</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block">Protein</span>
                <span className="text-blue-400 text-xs font-black">{Math.round(selectedMealRecipe.proteinG * cookingPortionScale)}g</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block">Carbs</span>
                <span className="text-amber-400 text-xs font-black">{Math.round(selectedMealRecipe.carbsG * cookingPortionScale)}g</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block">Fat</span>
                <span className="text-red-400 text-xs font-black">{Math.round(selectedMealRecipe.fatG * cookingPortionScale)}g</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider text-rose-400">Ingredients Needed ({cookingPortionScale}x)</h3>
              <ul className="grid grid-cols-2 gap-2 text-xs text-neutral-300">
                {selectedMealRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="bg-neutral-900 p-2 rounded-xl border border-neutral-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider text-rose-400">Preparation & Cooking Steps</h3>
              <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-4 rounded-2xl border border-neutral-900">
                {selectedMealRecipe.recipe}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  handleQuickLogRecommendedMeal(selectedMealRecipe);
                  setSelectedMealRecipe(null);
                }}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.3)] transition cursor-pointer"
              >
                Log Meal to Journal Right Now
              </button>
              <button
                onClick={() => setSelectedMealRecipe(null)}
                className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs font-bold rounded-xl border border-neutral-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
