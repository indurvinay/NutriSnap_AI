import React, { useState, useEffect } from 'react';
import { UserProfile, DailyLog, MealType, FoodItem, Meal } from './types';
import { INITIAL_PROFILE, INITIAL_LOGS, calculateMifflinTargets } from './data/mockData';
import { MacroRings } from './components/MacroRings';
import { Onboarding } from './components/Onboarding';
import { Scanner } from './components/Scanner';
import { SearchFood } from './components/SearchFood';
import { HistoryStats } from './components/HistoryStats';
import { Subscription } from './components/Subscription';
import { AuthScreens } from './components/AuthScreens';
import { ProfileSettings } from './components/ProfileSettings';
import { DietPlanView } from './components/DietPlanView';
import { GlycemicShield } from './components/GlycemicShield';
import { MacroSquadView } from './components/MacroSquadView';
import { MetabolismTracker } from './components/MetabolismTracker';
import { supabase } from './utils/supabaseClient';

import {
  Flame,
  Calendar,
  Sparkles,
  Camera,
  Search,
  BarChart3,
  User,
  LogOut,
  Moon,
  Sun,
  Sunrise,
  Cookie,
  Plus,
  Trash2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Coffee,
  RotateCcw,
  Sparkle,
  Settings,
  Utensils,
  X
} from 'lucide-react';

const LOCAL_STORAGE_PROFILE_KEY = "caltrack_ai_profile_v2";
const LOCAL_STORAGE_LOGS_KEY = "caltrack_ai_logs_v2";

const mapProfileDbToTs = (db: any): UserProfile => {
  return {
    name: db.name,
    age: db.age,
    gender: db.gender,
    weightKg: Number(db.weight_kg),
    heightCm: Number(db.height_cm),
    activityLevel: db.activity_level,
    goal: db.goal,
    dailyCalorieTarget: db.daily_calorie_target,
    dailyProteinTarget: db.daily_protein_target,
    dailyCarbsTarget: db.daily_carbs_target,
    dailyFatTarget: db.daily_fat_target,
    isOnboardingCompleted: db.is_onboarding_completed,
    streakCurrent: db.streak_current,
    streakLongest: db.streak_longest,
    streakLastDate: db.streak_last_date || undefined,
    isPremium: db.is_premium,
    breakfastReminder: db.breakfast_reminder,
    lunchReminder: db.lunch_reminder,
    dinnerReminder: db.dinner_reminder,
  };
};

const mapProfileTsToDb = (ts: UserProfile) => {
  return {
    name: ts.name,
    age: ts.age,
    gender: ts.gender,
    weight_kg: ts.weightKg,
    height_cm: ts.heightCm,
    activity_level: ts.activityLevel,
    goal: ts.goal,
    daily_calorie_target: ts.dailyCalorieTarget,
    daily_protein_target: ts.dailyProteinTarget,
    daily_carbs_target: ts.dailyCarbsTarget,
    daily_fat_target: ts.dailyFatTarget,
    is_onboarding_completed: ts.isOnboardingCompleted,
    streak_current: ts.streakCurrent,
    streak_longest: ts.streakLongest,
    streak_last_date: ts.streakLastDate || null,
    is_premium: ts.isPremium,
    breakfast_reminder: ts.breakfastReminder ?? true,
    lunch_reminder: ts.lunchReminder ?? true,
    dinner_reminder: ts.dinnerReminder ?? true,
  };
};

export default function App() {
  // Navigation layout active states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scanner' | 'search' | 'stats' | 'dietplan' | 'upgrade' | 'profile'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("caltrack_logged_in");
      return stored === "true";
    } catch {
      return false;
    }
  });
  const [activeEmail, setActiveEmail] = useState<string>(() => {
    try {
      return localStorage.getItem("caltrack_active_user_email") || "";
    } catch {
      return "";
    }
  });
  const [activeDate, setActiveDate] = useState<string>(''); // YYYY-MM-DD
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  
  // Custom HUD Toast alerts
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [localReflection, setLocalReflection] = useState<string>('');

  // Initialize dates
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    setActiveDate(todayStr);
  }, []);

  interface RegisteredUser {
    name: string;
    email: string;
    password?: string;
    profile?: UserProfile;
    logs?: Record<string, DailyLog>;
  }

  // Hydrate states from browser localStorage user registry or Supabase Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setActiveEmail(session.user.email || '');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setActiveEmail(session.user.email || '');
      } else {
        setIsLoggedIn(false);
        setActiveEmail('');
        setProfile(null);
        setLogs({});
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadData = async () => {
      try {
        let user = null;
        try {
          const { data } = await supabase.auth.getUser();
          user = data?.user || null;
        } catch (e) {
          console.error("Auth getUser error:", e);
        }

        if (!user) {
          // Fallback: load profile and logs from localStorage if offline/developer bypassed
          try {
            const storedLogs = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
            if (storedLogs) {
              setLogs(JSON.parse(storedLogs));
            }
            const storedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
            if (storedProfile && !profile) {
              setProfile(JSON.parse(storedProfile));
            }
          } catch (e) {
            console.error("Failed to load local logs fallback:", e);
          }
          return;
        }

        // Fetch profile
        let dbProfile = null;
        const { data: fetchedProfile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileErr) {
          console.error("Failed to load profile", profileErr);
        }

        if (fetchedProfile) {
          dbProfile = fetchedProfile;
        } else {
          // Fallback: create profile row if database trigger is missing
          const freshProfile: UserProfile = {
            ...INITIAL_PROFILE,
            name: user.user_metadata?.name || user.email?.split('@')[0] || "User",
            isOnboardingCompleted: false
          };
          const { data: newProfile, error: createErr } = await supabase
            .from('profiles')
            .insert({ id: user.id, ...mapProfileTsToDb(freshProfile) })
            .select()
            .single();

          if (createErr) {
            console.error("Failed to auto-create missing profile row", createErr);
            dbProfile = { id: user.id, ...mapProfileTsToDb(freshProfile) };
          } else {
            dbProfile = newProfile;
          }
        }

        // Fetch daily logs
        const { data: dbLogs } = await supabase
          .from('daily_logs')
          .select('*')
          .eq('user_id', user.id);

        // Fetch meals with nested items
        const { data: dbMeals } = await supabase
          .from('meals')
          .select('*, meal_items(*)')
          .eq('user_id', user.id);

        const compiledLogs: Record<string, DailyLog> = {};

        if (dbLogs) {
          dbLogs.forEach((l) => {
            const dateStr = l.log_date;
            compiledLogs[dateStr] = {
              date: dateStr,
              waterIntakeMl: l.water_intake_ml,
              waterGoalMl: l.water_goal_ml,
              weightKg: l.recorded_weight_kg ? Number(l.recorded_weight_kg) : undefined,
              reflection: l.reflection || undefined,
              meals: {
                breakfast: { id: '', type: 'breakfast', name: 'Breakfast', items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, timeLogged: '' },
                lunch: { id: '', type: 'lunch', name: 'Lunch', items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, timeLogged: '' },
                dinner: { id: '', type: 'dinner', name: 'Dinner', items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, timeLogged: '' },
                snack: { id: '', type: 'snack', name: 'Snack', items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, timeLogged: '' }
              }
            };
          });
        }

        if (dbMeals) {
          dbMeals.forEach((m) => {
            const dateStr = m.log_date;
            if (!compiledLogs[dateStr]) {
              compiledLogs[dateStr] = {
                date: dateStr,
                waterIntakeMl: 0,
                waterGoalMl: 2500,
                meals: {
                  breakfast: { id: '', type: 'breakfast', name: 'Breakfast', items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, timeLogged: '' },
                  lunch: { id: '', type: 'lunch', name: 'Lunch', items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, timeLogged: '' },
                  dinner: { id: '', type: 'dinner', name: 'Dinner', items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, timeLogged: '' },
                  snack: { id: '', type: 'snack', name: 'Snack', items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, timeLogged: '' }
                }
              };
            }

            const mealType = m.type as MealType;
            const items: FoodItem[] = (m.meal_items || []).map((item: any) => ({
              id: item.id,
              name: item.name,
              portion: item.portion,
              calories: item.calories,
              proteinG: Number(item.protein_g),
              carbsG: Number(item.carbs_g),
              fatG: Number(item.fat_g),
              confidence: item.confidence ? Number(item.confidence) : undefined,
              category: item.category,
              imageUri: item.image_uri,
              isCustom: item.is_custom
            }));

            compiledLogs[dateStr].meals[mealType] = {
              id: m.id,
              type: mealType,
              name: m.name,
              items: items,
              totalCalories: m.total_calories,
              totalProtein: Number(m.total_protein),
              totalCarbs: Number(m.total_carbs),
              totalFat: Number(m.total_fat),
              timeLogged: new Date(m.time_logged).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          });
        }

        setProfile(mapProfileDbToTs(dbProfile));
        setLogs(compiledLogs);
      } catch (err) {
        console.error("Failed to load user data from Supabase", err);
      }
    };

    loadData();
  }, [isLoggedIn]);

  // Update profile in local storage and Supabase on changes
  const saveProfileState = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updatedProfile));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update(mapProfileTsToDb(updatedProfile))
          .eq('id', user.id);
      }
    } catch (e) {
      console.error("Failed to save profile state to database:", e);
    }
  };

  // Update logs in database (e.g. for bulk updates or seeding logs)
  const saveLogsState = async (updatedLogs: Record<string, DailyLog>) => {
    setLogs(updatedLogs);
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(updatedLogs));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      for (const [dateStr, dailyLog] of Object.entries(updatedLogs)) {
        await supabase.from('daily_logs').upsert({
          user_id: user.id,
          log_date: dateStr,
          water_intake_ml: dailyLog.waterIntakeMl,
          water_goal_ml: dailyLog.waterGoalMl,
          reflection: dailyLog.reflection || null
        }, { onConflict: 'user_id,log_date' });

        for (const [mealType, meal] of Object.entries(dailyLog.meals)) {
          if (meal.items.length === 0) continue;
          
          const { data: existingMeals } = await supabase
            .from('meals')
            .select('id')
            .eq('user_id', user.id)
            .eq('log_date', dateStr)
            .eq('type', mealType);

          let dbMealId = '';
          if (existingMeals && existingMeals.length > 0) {
            dbMealId = existingMeals[0].id;
            await supabase.from('meals').update({
              total_calories: meal.totalCalories,
              total_protein: meal.totalProtein,
              total_carbs: meal.totalCarbs,
              total_fat: meal.totalFat
            }).eq('id', dbMealId);
          } else {
            const { data: newMeal } = await supabase.from('meals').insert({
              user_id: user.id,
              log_date: dateStr,
              type: mealType,
              name: meal.name,
              total_calories: meal.totalCalories,
              total_protein: meal.totalProtein,
              total_carbs: meal.totalCarbs,
              total_fat: meal.totalFat
            }).select().single();
            if (newMeal) dbMealId = newMeal.id;
          }

          if (dbMealId) {
            await supabase.from('meal_items').delete().eq('meal_id', dbMealId);

            const itemsToInsert = meal.items.map(item => ({
              meal_id: dbMealId,
              name: item.name,
              portion: item.portion,
              calories: item.calories,
              protein_g: item.proteinG,
              carbs_g: item.carbsG,
              fat_g: item.fatG,
              category: item.category || 'Generic',
              image_uri: item.imageUri || null,
              is_custom: item.isCustom ?? false
            }));
            await supabase.from('meal_items').insert(itemsToInsert);
          }
        }
      }
    } catch (e) {
      console.error("Failed to save logs to database:", e);
    }
  };

  // Trigger HUD Toast Alerts
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => {
        setShowToast(false);
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  // Resolves currently active logs template
  const getDailyLogForDate = (dateStr: string): DailyLog => {
    if (logs[dateStr]) {
      return logs[dateStr];
    }
    return {
      date: dateStr,
      meals: {
        breakfast: { id: `b-${dateStr}`, type: 'breakfast', name: 'Breakfast', items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, timeLogged: '' },
        lunch: { id: `l-${dateStr}`, type: 'lunch', name: 'Lunch', items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, timeLogged: '' },
        dinner: { id: `d-${dateStr}`, type: 'dinner', name: 'Dinner', items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, timeLogged: '' },
        snack: { id: `s-${dateStr}`, type: 'snack', name: 'Snack', items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, timeLogged: '' }
      },
      waterIntakeMl: 0,
      waterGoalMl: 2500
    };
  };

  // BACKGROUND SMART REMINDER SYSTEM
  // Periodically monitors if typical hours (Lunch @ 13:00; Dinner @ 20:00) 
  // have passed without any food item entry for today, firing native notifications.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkTypicalMealTimes = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const hours = now.getHours();

      // Ensure a state registry to dodge spamming repeated messages
      let registry: Record<string, { lunch?: boolean; dinner?: boolean }> = {};
      try {
        const storedRegistry = localStorage.getItem("caltrack_notified_registry");
        if (storedRegistry) {
          registry = JSON.parse(storedRegistry);
        }
      } catch (err) {
        console.warn("Could not read notification registry:", err);
      }

      if (!registry[todayStr]) {
        registry[todayStr] = { lunch: false, dinner: false };
      }

      const todayLog = getDailyLogForDate(todayStr);

      // Typical Lunch Time check (1:00 PM / 13:00)
      const hasLunchLogged = todayLog.meals.lunch.items.length > 0;
      const isPastLunchTime = hours >= 13;
      if (profile?.lunchReminder && isPastLunchTime && !hasLunchLogged && !registry[todayStr].lunch) {
        registry[todayStr].lunch = true;
        localStorage.setItem("caltrack_notified_registry", JSON.stringify(registry));

        dispatchSmartAlert(
          "CalTrack Smart Lunch Reminder 🥗",
          `Hey ${profile.name}! It is past your typical lunch time (1:00 PM) and nothing has been logged. Snap a quick AI picture or search to stay on progress!`
        );
      }

      // Typical Dinner Time check (8:00 PM / 20:00)
      const hasDinnerLogged = todayLog.meals.dinner.items.length > 0;
      const isPastDinnerTime = hours >= 20;
      if (profile?.dinnerReminder && isPastDinnerTime && !hasDinnerLogged && !registry[todayStr].dinner) {
        registry[todayStr].dinner = true;
        localStorage.setItem("caltrack_notified_registry", JSON.stringify(registry));

        dispatchSmartAlert(
          "CalTrack Smart Dinner Reminder 🍽️",
          `Hey ${profile.name}! It is past your typical dinner time (8:00 PM) and your log is empty. Save your evening macros to maintain your consecutive ${profile.streakCurrent || '1'}-day streak!`
        );
      }
    };

    const dispatchSmartAlert = (title: string, bodyText: string) => {
      // 1. Request notification permissions dynamically if not already asked
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }

      // 2. Trigger native Notification if granted
      let nativeDispatched = false;
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(title, {
            body: bodyText,
            icon: "/favicon.ico"
          });
          nativeDispatched = true;
        } catch (e) {
          console.warn("Notification constructor failed: falling back to HUD", e);
        }
      }

      // 3. Robust client toast overlay / simulation fallback fallback
      triggerToast(`🔔 SMART ALARM: ${bodyText}`);
    };

    // First instant check
    checkTypicalMealTimes();

    // Re-check periodically every 30 seconds
    const checkInterval = setInterval(checkTypicalMealTimes, 30000);
    return () => clearInterval(checkInterval);
  }, [profile, logs]);

  // Synchronize reflection note edit state when calendar date or logs change
  useEffect(() => {
    if (activeDate) {
      const currentLog = getDailyLogForDate(activeDate);
      setLocalReflection(currentLog.reflection || '');
    }
  }, [activeDate, logs]);

  // SAVE DAILY REFLECTION MUTATOR
  const handleSaveReflection = async (note: string) => {
    const currentLog = getDailyLogForDate(activeDate);
    const updatedLog: DailyLog = {
      ...currentLog,
      reflection: note
    };
    const nextLogs = {
      ...logs,
      [activeDate]: updatedLog
    };
    setLogs(nextLogs);
    triggerToast("Your daily reflection has been successfully saved! 📝");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('daily_logs')
          .upsert({
            user_id: user.id,
            log_date: activeDate,
            water_intake_ml: currentLog.waterIntakeMl,
            water_goal_ml: currentLog.waterGoalMl,
            reflection: note
          }, { onConflict: 'user_id,log_date' });
      }
    } catch (err) {
      console.error("Failed to save reflection to database:", err);
    }
  };

  // Dynamic daily progress indicators
  const currentDayLog = getDailyLogForDate(activeDate);

  let todayCalories = 0;
  let todayProtein = 0;
  let todayCarbs = 0;
  let todayFat = 0;

  if (currentDayLog && currentDayLog.meals) {
    Object.values(currentDayLog.meals).forEach((meal) => {
      todayCalories += meal.totalCalories || 0;
      todayProtein += meal.totalProtein || 0;
      todayCarbs += meal.totalCarbs || 0;
      todayFat += meal.totalFat || 0;
    });
  }

  todayCalories = Math.round(todayCalories);
  todayProtein = Math.round(todayProtein);
  todayCarbs = Math.round(todayCarbs);
  todayFat = Math.round(todayFat);

  // Recalculates consecutive logging streaks
  const verifyCalendarStreaks = (updatedLogs: Record<string, DailyLog>, userProfile: UserProfile) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const hasLoggedToday = updatedLogs[todayStr] && Object.values(updatedLogs[todayStr].meals).some(m => m.items.length > 0);
    const hasLoggedYesterday = updatedLogs[yesterdayStr] && Object.values(updatedLogs[yesterdayStr].meals).some(m => m.items.length > 0);

    let streak = userProfile.streakCurrent;
    let longest = userProfile.streakLongest;

    if (hasLoggedToday) {
      if (userProfile.streakLastDate !== todayStr) {
        if (userProfile.streakLastDate === yesterdayStr) {
          streak += 1;
        } else if (userProfile.streakLastDate !== todayStr) {
          streak = 1; // broken gap
        }
        longest = Math.max(longest, streak);
        
        saveProfileState({
          ...userProfile,
          streakCurrent: streak,
          streakLongest: longest,
          streakLastDate: todayStr
        });
      }
    } else {
      const last = userProfile.streakLastDate;
      const isPastStreakValid = last === yesterdayStr || last === todayStr;
      if (!isPastStreakValid && last) {
        saveProfileState({
          ...userProfile,
          streakCurrent: 0,
        });
      }
    }
  };

  // LOG FOOD TRANSACTION MUTATOR
  const handleLogMeal = async (
    mealType: MealType,
    mealName: string,
    items: Omit<FoodItem, 'id'>[],
    addedCalories: number,
    addedProtein: number,
    addedCarbs: number,
    addedFat: number
  ) => {
    if (!profile) return;

    // 1. Instantly construct updated local items & log state
    const newItems: FoodItem[] = items.map((item, idx) => ({
      ...item,
      id: (item as any).id || `item-${Date.now()}-${idx}`
    }));

    const currentLog = getDailyLogForDate(activeDate);
    const existingMeal = currentLog.meals[mealType];
    const mealId = existingMeal.id || `meal-${mealType}-${activeDate}`;

    const updatedItems = [...existingMeal.items, ...newItems];
    const sumCalories = updatedItems.reduce((acc, i) => acc + (i.calories || 0), 0);
    const sumProtein = updatedItems.reduce((acc, i) => acc + (i.proteinG || 0), 0);
    const sumCarbs = updatedItems.reduce((acc, i) => acc + (i.carbsG || 0), 0);
    const sumFat = updatedItems.reduce((acc, i) => acc + (i.fatG || 0), 0);

    const updatedMeal: Meal = {
      ...existingMeal,
      id: mealId,
      items: updatedItems,
      totalCalories: Math.round(sumCalories),
      totalProtein: Number(sumProtein.toFixed(1)),
      totalCarbs: Number(sumCarbs.toFixed(1)),
      totalFat: Number(sumFat.toFixed(1)),
      timeLogged: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedLog: DailyLog = {
      ...currentLog,
      meals: {
        ...currentLog.meals,
        [mealType]: updatedMeal
      }
    };

    const nextLogs = {
      ...logs,
      [activeDate]: updatedLog
    };

    // 2. Update React State & localStorage IMMEDIATELY (0ms delay UI response)
    setLogs(nextLogs);
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(nextLogs));
    verifyCalendarStreaks(nextLogs, profile);
    triggerToast(`Logged ${mealName || mealType}! +${Math.round(addedCalories)} kcal 🥗`);
    setActiveTab('dashboard');

    // 3. Persist asynchronously to Supabase Database in background
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let dbMealId = existingMeal.id;
      if (!dbMealId || dbMealId.startsWith('meal-')) {
        const { data: newMeal } = await supabase
          .from('meals')
          .insert({
            user_id: user.id,
            log_date: activeDate,
            type: mealType,
            name: mealName || mealType,
            total_calories: sumCalories,
            total_protein: sumProtein,
            total_carbs: sumCarbs,
            total_fat: sumFat
          })
          .select()
          .single();

        if (newMeal) dbMealId = newMeal.id;
      } else {
        await supabase
          .from('meals')
          .update({
            total_calories: sumCalories,
            total_protein: sumProtein,
            total_carbs: sumCarbs,
            total_fat: sumFat
          })
          .eq('id', dbMealId);
      }

      if (dbMealId) {
        const itemsToInsert = newItems.map(item => ({
          meal_id: dbMealId,
          name: item.name,
          portion: item.portion,
          calories: item.calories,
          protein_g: item.proteinG,
          carbs_g: item.carbsG,
          fat_g: item.fatG,
          confidence: item.confidence || null,
          category: item.category || 'Generic',
          image_uri: item.imageUri || null,
          is_custom: item.isCustom ?? false
        }));
        await supabase.from('meal_items').insert(itemsToInsert);
      }
    } catch (e) {
      console.error("Background database persistence note:", e);
    }
  };

  // REMOVE FOOD INGREDIENT MUTATOR
  const handleDeleteFood = async (mealType: MealType, itemId: string) => {
    if (!profile) return;
    const currentLog = getDailyLogForDate(activeDate);
    const targetMeal = currentLog.meals[mealType];

    const updatedItems = targetMeal.items.filter(i => i.id !== itemId);
    const sumCalories = updatedItems.reduce((acc, i) => acc + (i.calories || 0), 0);
    const sumProtein = updatedItems.reduce((acc, i) => acc + (i.proteinG || 0), 0);
    const sumCarbs = updatedItems.reduce((acc, i) => acc + (i.carbsG || 0), 0);
    const sumFat = updatedItems.reduce((acc, i) => acc + (i.fatG || 0), 0);

    const updatedMeal: Meal = {
      ...targetMeal,
      items: updatedItems,
      totalCalories: Math.round(sumCalories),
      totalProtein: Number(sumProtein.toFixed(1)),
      totalCarbs: Number(sumCarbs.toFixed(1)),
      totalFat: Number(sumFat.toFixed(1)),
    };

    const updatedLog: DailyLog = {
      ...currentLog,
      meals: {
        ...currentLog.meals,
        [mealType]: updatedMeal
      }
    };

    const nextLogs = {
      ...logs,
      [activeDate]: updatedLog
    };

    setLogs(nextLogs);
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(nextLogs));
    triggerToast("Item removed from food log.");

    try {
      if (!itemId.startsWith('item-')) {
        await supabase.from('meal_items').delete().eq('id', itemId);
        if (targetMeal.id && !targetMeal.id.startsWith('meal-')) {
          await supabase.from('meals').update({
            total_calories: sumCalories,
            total_protein: sumProtein,
            total_carbs: sumCarbs,
            total_fat: sumFat
          }).eq('id', targetMeal.id);
        }
      }
    } catch (e) {
      console.error("Failed to delete food item from database:", e);
    }
  };

  // WATER INTAKE INCREMENTOR
  const handleWaterAdd = async (amountMl: number) => {
    const currentLog = getDailyLogForDate(activeDate);
    const newIntake = (currentLog.waterIntakeMl || 0) + amountMl;
    const nextLog: DailyLog = {
      ...currentLog,
      waterIntakeMl: newIntake
    };

    setLogs(prev => ({
      ...prev,
      [activeDate]: nextLog
    }));
    triggerToast(`Added ${amountMl}ml glass of pure water. Hydrated! 💧`);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('daily_logs')
          .upsert({
            user_id: user.id,
            log_date: activeDate,
            water_intake_ml: newIntake,
            water_goal_ml: currentLog.waterGoalMl,
            reflection: currentLog.reflection || null
          }, { onConflict: 'user_id,log_date' });
      }
    } catch (err) {
      console.error("Failed to save water to database:", err);
    }
  };

  // LOG OUT CURRENT LOGIN SESSION
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setActiveEmail('');
    localStorage.removeItem("caltrack_logged_in");
    localStorage.removeItem("caltrack_active_user_email");
    setActiveTab('dashboard');
    triggerToast("Logged out of CalTrack session safely!");
  };

  // TRIGGER PREMIUM PLAN LOCK TOGGLING
  const handleTogglePremium = (upgradeState: boolean) => {
    if (!profile) return;
    saveProfileState({
      ...profile,
      isPremium: upgradeState
    });
  };

  // CHANGE ACTIVE TARGET GOALS DIRECTLY FROM DIAL MODE CARD
  const handleSwapTargetGoal = (newGoal: 'lose' | 'maintain' | 'build') => {
    if (!profile) return;
    
    const t = calculateMifflinTargets(
      profile.gender || 'male',
      profile.weightKg || 75,
      profile.heightCm || 178,
      profile.age || 26,
      profile.activityLevel || 'moderate',
      newGoal
    );

    saveProfileState({
      ...profile,
      goal: newGoal,
      dailyCalorieTarget: t.calories,
      dailyProteinTarget: t.protein,
      dailyCarbsTarget: t.carbs,
      dailyFatTarget: t.fat
    });

    triggerToast(`Goal updated to ${newGoal === 'lose' ? 'Calorie Deficit' : newGoal === 'build' ? 'Muscle Gain' : 'Calorie Maintenance'}! Rings resized.`);
  };

  // RESET TO ONBOARDING FLOW
  const handleResetProfile = () => {
    if (!profile) return;
    saveProfileState({
      ...profile,
      isOnboardingCompleted: false
    });
    setOpenSettings(false);
  };

  // DEVELOPER SHORTCUT: TRIGGER STREAK INCREASE FOR TESTING
  const handleForceStreakIncrease = () => {
    if (!profile) return;
    saveProfileState({
      ...profile,
      streakCurrent: profile.streakCurrent + 1,
      streakLongest: Math.max(profile.streakLongest, profile.streakCurrent + 1)
    });
    triggerToast(`Streak increased manually! Live 🔥 streak: ${profile.streakCurrent + 1} days.`);
  };

  // ERASE ENTIRE USER PROGRESS
  const handlePurgeAllData = async () => {
    if (confirm("Are you sure you want to reset all calories data logs back to defaults? This action is permanent.")) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Delete meals (cascade deletes items)
        await supabase
          .from('meals')
          .delete()
          .eq('user_id', user.id);

        // Delete daily logs
        await supabase
          .from('daily_logs')
          .delete()
          .eq('user_id', user.id);

        const defaultProfile = { ...INITIAL_PROFILE, name: profile?.name || "User", isOnboardingCompleted: false };
        await supabase
          .from('profiles')
          .update(mapProfileTsToDb(defaultProfile))
          .eq('id', user.id);

        setProfile(defaultProfile);
        setLogs({});
        setActiveTab('dashboard');
        setOpenSettings(false);
        triggerToast("All calorie history database wiped.");
      } catch (err) {
        console.error("Failed to purge data from database:", err);
      }
    }
  };

  // Helper date navigators
  const stepDate = (dayOffset: number) => {
    const activeEpoch = new Date(activeDate + "T12:00:00");
    activeEpoch.setDate(activeEpoch.getDate() + dayOffset);
    setActiveDate(activeEpoch.toISOString().split('T')[0]);
  };

  const getReadableFullDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Check if profile is hydrated yet
  if (isLoggedIn && !profile) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <Coffee className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
          <h2 className="text-sm font-bold tracking-widest text-neutral-400 uppercase">Bootstrapping CalTrack AI Database...</h2>
        </div>
      </div>
    );
  }

  // Intercept with stunning high-contrast interactive Auth Screens
  if (!isLoggedIn) {
    return (
      <AuthScreens
        onAuthSuccess={async (emailAddress, userName, isNewUser) => {
          setActiveEmail(emailAddress);
          setIsLoggedIn(true);
          localStorage.setItem("caltrack_logged_in", "true");
          localStorage.setItem("caltrack_active_user_email", emailAddress);

          let user = null;
          try {
            const { data } = await supabase.auth.getUser();
            user = data?.user || null;
          } catch (e) {
            console.error("Auth getUser error:", e);
          }

          if (user) {
            const { data: dbProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            if (dbProfile) {
              setProfile(mapProfileDbToTs(dbProfile));
            } else {
              const freshProfile: UserProfile = {
                ...INITIAL_PROFILE,
                name: userName,
                isOnboardingCompleted: !isNewUser
              };
              setProfile(freshProfile);
              await supabase.from('profiles').insert({ id: user.id, ...mapProfileTsToDb(freshProfile) });
            }
          } else {
            // Fallback mode if Supabase is offline or if Developer Bypass was used
            let loadedProfile = INITIAL_PROFILE;
            try {
              const storedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
              if (storedProfile) {
                loadedProfile = JSON.parse(storedProfile);
              }
            } catch (e) {
              console.error("Failed to load local profile:", e);
            }
            setProfile({
              ...loadedProfile,
              name: userName || loadedProfile.name,
              isOnboardingCompleted: !isNewUser
            });
          }
          triggerToast(`Logged in successfully! Welcome, ${userName}.`);
        }}
        onQuickBypass={() => {
          const demoEmail = "alex.johnson@caltrack.ai";
          setActiveEmail(demoEmail);
          localStorage.setItem("caltrack_active_user_email", demoEmail);
          
          let loadedProfile = INITIAL_PROFILE;
          let loadedLogs = INITIAL_LOGS;

          try {
            const usersStr = localStorage.getItem("caltrack_registered_users");
            if (usersStr) {
              const users: RegisteredUser[] = JSON.parse(usersStr);
              const foundUser = users.find(u => u.email.toLowerCase() === demoEmail);
              if (foundUser) {
                loadedProfile = foundUser.profile || INITIAL_PROFILE;
                loadedLogs = foundUser.logs || INITIAL_LOGS;
              }
            }
          } catch (e) {
            console.error("Quick bypass registry load error:", e);
          }

          setProfile({ ...loadedProfile, isOnboardingCompleted: true });
          setLogs(loadedLogs);
          
          localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify({ ...loadedProfile, isOnboardingCompleted: true }));
          localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(loadedLogs));

          setIsLoggedIn(true);
          localStorage.setItem("caltrack_logged_in", "true");
          triggerToast("Bypassed matching demo account with prefilled statistics!");
        }}
      />
    );
  }

  // Force onboarding if false
  if (!profile.isOnboardingCompleted) {
    return (
      <Onboarding
        onCompleteOnboarding={(completedProfile) => {
          saveProfileState(completedProfile);
          // Auto seed with some preseeded logs to make stats charts instantly alive
          saveLogsState(INITIAL_LOGS);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-between selection:bg-rose-500 selection:text-white" id="main-application-frame">
      
      {/* GLOWING SYSTEM AMBIENCE GRAIN */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* TOP COMPACT BRANDING HEADER PANEL */}
      <header className="bg-[#0d0d0d]/90 border-b border-neutral-900 sticky top-0 backdrop-blur z-40 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 logo-glow">
            <Flame className="w-5 h-5 fill-white text-rose-500 hover:rotate-12 transition-all duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-wider text-white">CALTRACK</span>
              <span className="text-[9px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded-full">PRO</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-bold tracking-wide block leading-[1]">AI Calorie Tracker</span>
          </div>
        </div>

        {/* Header interactive controls */}
        <div className="flex items-center gap-3">
          {/* Active Streak Badge */}
          <div
            className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl hover:bg-neutral-800/80 transition cursor-pointer select-none"
            onClick={() => {
              triggerToast(`Active calorie-logging streak! Longest streak was 14 days! 🔥`);
            }}
          >
            <span className="text-rose-500 font-bold inline-block text-xs">🔥 {profile.streakCurrent} Days</span>
          </div>

          {/* Settings panel trigger */}
          <button
            onClick={() => setOpenSettings(!openSettings)}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-400 hover:text-white transition"
            title="Settings Options"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* COMPACT FLOATING TOAST BAR */}
      {showToast && (
        <div className="fixed top-18 inset-x-4 max-w-md mx-auto z-50 animate-slideDown">
          <div className="bg-neutral-900/95 text-white border border-rose-500/20 text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur">
            <Sparkle className="w-4 h-4 text-rose-500 animate-spin" />
            <span className="flex-1 text-neutral-200">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* FULL METADATA EDIT SETTINGS DRAWER OVERLAY */}
      {openSettings && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121212] rounded-2xl border border-neutral-800 p-6 space-y-5 animate-scaleUp relative">
            <button
              onClick={() => setOpenSettings(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-rose-500" />
              Settings & Operations
            </h3>

            <div className="space-y-3">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase font-black">Logged account</span>
                <p className="text-sm font-bold text-white">{profile.name}</p>
                <p className="text-xs text-neutral-400 font-mono">Calorie Target: {profile.dailyCalorieTarget} kcal</p>
              </div>

              {/* Developer Operations */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Diagnostics Shortcuts</span>
                
                <button
                  onClick={handleForceStreakIncrease}
                  className="w-full py-2.5 text-left px-3 text-xs bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800/60 rounded-xl transition text-rose-400 font-bold flex items-center justify-between"
                >
                  <span>Manual Streak Increase</span>
                  <span className="bg-rose-500/10 border border-rose-500/20 text-[9px] px-1.5 py-0.5 rounded text-rose-400 font-black">+1 Day 🔥</span>
                </button>

                <button
                  onClick={handleResetProfile}
                  className="w-full py-2.5 text-left px-3 text-xs bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800/60 rounded-xl transition text-white font-medium"
                >
                  Do Onboarding Quiz Again
                </button>

                <button
                  onClick={handlePurgeAllData}
                  className="w-full py-2.5 text-left px-3 text-xs bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/10 rounded-xl transition text-rose-400 font-bold"
                >
                  Reset All Calorie Database Logs
                </button>
              </div>
            </div>

            <div className="pt-2 text-center text-[10px] text-neutral-500 font-medium font-mono border-t border-neutral-900">
              CalTrack AI Applet V2.14 · Sandbox Secure
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER LAYOUT */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full relative z-10 space-y-6">

        {/* TAB NAVIGATION COUPLER (Dashboard tabs logic) */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fadeIn">
            
            {/* LEFT 2 PANELS: GOALS, RINGS, WATER, QUICK ACTIONS */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* CARD 1: DYNAMICS CALORIE PROGRESS RING DIAL */}
              <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 flex flex-col items-center space-y-6">
                <div className="flex justify-between items-center w-full pb-4 border-b border-rose-500/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#ff6b6b]" />
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Nutrition Dial Log</h3>
                  </div>
                  
                  {/* Calorie balance plan changer switcher */}
                  <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-900">
                    {(['lose', 'maintain', 'build'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => handleSwapTargetGoal(g)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition ${
                          profile.goal === g
                            ? 'bg-rose-500 text-white shadow'
                            : 'text-neutral-500 hover:text-white'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Progress Core */}
                <MacroRings
                  protein={{ current: todayProtein, target: profile.dailyProteinTarget }}
                  carbs={{ current: todayCarbs, target: profile.dailyCarbsTarget }}
                  fat={{ current: todayFat, target: profile.dailyFatTarget }}
                  calories={{ current: todayCalories, target: profile.dailyCalorieTarget }}
                  size={220}
                />
              </div>

              {/* CARD 2: WATER HYDRATION COUNTER */}
              <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                    <Droplet className="w-4.5 h-4.5 fill-blue-500 text-blue-400" />
                    Water Hydration
                  </div>
                  <span className="text-xs text-neutral-400 font-bold font-mono">
                    {currentDayLog.waterIntakeMl || 0} / {currentDayLog.waterGoalMl} ml
                  </span>
                </div>

                <div className="w-full bg-neutral-950 border border-neutral-900 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500 shadow-[0_0_8px_#3b82f6]"
                    style={{ width: `${Math.min(100, ((currentDayLog.waterIntakeMl || 0) / currentDayLog.waterGoalMl) * 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleWaterAdd(250)}
                    className="py-2 px-3 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/20 text-blue-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition select-none"
                  >
                    +250ml Glass
                  </button>
                  <button
                    onClick={() => handleWaterAdd(500)}
                    className="py-2 px-3 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 hover:border-blue-500/30 text-blue-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition select-none"
                  >
                    +500ml Bottle 💧
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT 3 PANELS: MAIN FOOD DIARY CHRONICLES AND TIMELINE SLOTS */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* DIARY CALENDAR RANGE SELECTOR STRIP */}
              <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-5 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => stepDate(-1)}
                  className="p-2 bg-neutral-950 hover:bg-neutral-900 rounded-xl border border-neutral-850 hover:border-neutral-700 transition"
                  title="Previous Date"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-400 hover:text-white" />
                </button>

                <div className="text-center">
                  <h3 className="text-sm font-extrabold text-white tracking-tight">{getReadableFullDate(activeDate)}</h3>
                  <span className="text-[10px] text-neutral-500 mt-0.5 block font-bold uppercase tracking-wider font-mono">
                    {activeDate === new Date().toISOString().split('T')[0] ? 'TODAY STATUS' : 'HISTORIC LOG'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => stepDate(1)}
                  className="p-2 bg-neutral-950 hover:bg-neutral-900 rounded-xl border border-neutral-850 hover:border-neutral-700 transition"
                  title="Next Date"
                >
                  <ChevronRight className="w-4 h-4 text-neutral-400 hover:text-white" />
                </button>
              </div>

              {/* TIMELINE SLOTS LISTING */}
              <div className="space-y-4">
                {[
                  { key: 'breakfast', label: 'Breakfast', icon: Sunrise, labelBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', iconColor: 'text-amber-400' },
                  { key: 'lunch', label: 'Lunch', icon: Sun, labelBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', iconColor: 'text-emerald-400' },
                  { key: 'dinner', label: 'Dinner', icon: Coffee, labelBg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', iconColor: 'text-indigo-400' },
                  { key: 'snack', label: 'Snack', icon: Cookie, labelBg: 'bg-rose-500/10 text-rose-500 border-rose-500/20', iconColor: 'text-rose-400' }
                ].map((slot) => {
                  const meal = currentDayLog.meals[slot.key as MealType] || { items: [], totalCalories: 0 };
                  const hasItems = meal.items.length > 0;
                  const IconComp = slot.icon;

                  return (
                    <div
                      key={slot.key}
                      className="bg-[#141414] rounded-2xl border border-neutral-800 p-5 space-y-4"
                    >
                      {/* Slot Header bar */}
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl ${slot.labelBg} border`}>
                            <IconComp className={`w-4 h-4 ${slot.iconColor}`} />
                          </div>
                          <div>
                            <span className="text-xs font-black text-white uppercase tracking-wider">{slot.label}</span>
                            <span className="text-[10px] text-neutral-500 block mt-0.5">{meal.items.length} items logged</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-neutral-300 font-mono">{meal.totalCalories} kcal</span>
                          
                          <button
                            onClick={() => {
                              setActiveTab('search');
                            }}
                            className="bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-rose-400 p-1.5 rounded-lg border border-neutral-850 hover:border-neutral-700 transition"
                            title="Add food mechanically"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Items timeline body info */}
                      {!hasItems ? (
                        <div className="py-5 text-center bg-neutral-950/40 rounded-xl border border-neutral-900/60 transition border-dashed text-neutral-600 flex items-center justify-center gap-2">
                          <span className="text-xs font-bold leading-normal">Empty slot. No logs recorded yet.</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {meal.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 bg-neutral-950/80 rounded-xl border border-neutral-900/60 hover:border-neutral-850 transition-all select-none"
                            >
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-black text-neutral-200 truncate">{item.name}</h4>
                                <span className="text-[10px] text-neutral-500 mt-0.5 block font-medium">
                                  Portion: <span className="text-neutral-400 font-bold">{item.portion}</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <span className="text-xs font-extrabold text-rose-400 font-mono block">{item.calories} kcal</span>
                                  <span className="text-[9px] text-neutral-500 font-mono mt-0.5 block">
                                    P:{Math.round(item.proteinG)}g · C:{Math.round(item.carbsG)}g
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleDeleteFood(slot.key as MealType, item.id)}
                                  className="p-2 hover:bg-neutral-900 text-neutral-500 hover:text-rose-400 rounded-xl transition"
                                  title="Delete ingredient"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* QUICK ACTION ROW (Quick add button and Visional trigger) */}
              <div className="bg-neutral-950/40 p-4 rounded-2xl border border-neutral-900 border-dashed flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h4 className="text-xs font-bold text-white">Need to log another ingredient?</h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Capture with your live lens or search our curated offline database.</p>
                </div>
                <div className="flex gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('search')}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-neutral-900 hover:bg-neutral-850 hover:text-white text-neutral-300 rounded-xl text-xs font-bold border border-neutral-800 transition flex items-center justify-center gap-1.5 shadow-inner"
                    title="Quick add mechanical items"
                  >
                    <Plus className="w-3.5 h-3.5 text-rose-500 mr-1.5" /> Manual Entry
                  </button>
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-500/20 transition flex items-center justify-center gap-1.5 animate-scaleUp"
                    title="Quick snap camera visual AI"
                  >
                    <Camera className="w-3.5 h-3.5" /> AI Scan Camera
                  </button>
                </div>
              </div>

              {/* CARD: DAILY REFLECTION NOTE CONTAINER */}
              <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    <Sparkle className="w-4 h-4 text-rose-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Daily Reflection Journal</h4>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">Note your physical energy, mental clarity, or digestion levels relative to your macros today.</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="E.g. Brain fog cleared and feeling high focus/energy after the high-protein macro lunch..."
                    value={localReflection}
                    onChange={(e) => setLocalReflection(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 focus:border-rose-500 text-xs text-neutral-200 rounded-xl p-3.5 focus:outline-none transition resize-none leading-relaxed placeholder:text-neutral-700"
                  />

                  {/* Suggestion Quick Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { emoji: "⚡", label: "High Energy" },
                      { emoji: "💤", label: "Post-Carb Crash" },
                      { emoji: "💪", label: "Ready to Train" },
                      { emoji: "🧠", label: "Optimal Focus" },
                      { emoji: "🌱", label: "Digestive Comfort" }
                    ].map((tag) => (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => {
                          const separator = localReflection ? ' · ' : '';
                          const nextText = `${localReflection}${separator}${tag.emoji} ${tag.label}`;
                          setLocalReflection(nextText);
                          handleSaveReflection(nextText);
                        }}
                        className="py-1 px-2.5 bg-neutral-900 hover:bg-neutral-850 text-[10px] text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-750 rounded-lg transition-all"
                      >
                        {tag.emoji} {tag.label}
                      </button>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-between items-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setLocalReflection('');
                        handleSaveReflection('');
                      }}
                      className="text-[10px] text-neutral-500 hover:text-rose-400 transition"
                    >
                      Clear Note
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveReflection(localReflection)}
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-rose-500/10 cursor-pointer select-none"
                    >
                      Save Reflection Note
                    </button>
                  </div>
                </div>
              </div>

              {/* ADVANCED AI METABOLISM & GLYCEMIC SHIELD ENGINE MODULES */}
              <GlycemicShield
                todayLog={currentDayLog}
                showToast={triggerToast}
              />

              <MetabolismTracker
                profile={profile}
                todayLog={currentDayLog}
                onUpdateProfile={saveProfileState}
                showToast={triggerToast}
              />

              <MacroSquadView
                profile={profile}
                showToast={triggerToast}
              />

            </div>

          </div>
        )}

        {/* SCANNER VIEW TAB COUPLER */}
        {activeTab === 'scanner' && (
          <div className="animate-fadeIn">
            <Scanner
              onLogMeal={handleLogMeal}
              isPremium={profile.isPremium}
              onUpgradePrompt={() => {
                setActiveTab('upgrade');
                triggerToast("Advanced visual options locked. Explore Macro Mastery Pro!");
              }}
            />
          </div>
        )}

        {/* MANUAL FOOD SEARCH TAB COUPLER */}
        {activeTab === 'search' && (
          <div className="animate-fadeIn">
            <SearchFood
              onLogMeal={handleLogMeal}
              showToast={triggerToast}
            />
          </div>
        )}

        {/* STATS ANALYTICS HISTORY TAB COUPLER */}
        {activeTab === 'stats' && (
          <div className="animate-fadeIn">
            <HistoryStats
              logs={logs}
              profile={profile}
              onUpgradePrompt={() => {
                setActiveTab('upgrade');
                triggerToast("Weekly reports locked. Upgrade to unlock complete analytics downloads.");
              }}
            />
          </div>
        )}

        {/* AI DIET PLAN RECOMMENDATION & ADHERENCE COUPLER */}
        {activeTab === 'dietplan' && (
          <div className="animate-fadeIn">
            <DietPlanView
              profile={profile}
              todayLog={currentDayLog}
              onUpdateProfile={saveProfileState}
              onLogMeal={handleLogMeal}
              onUpgradePrompt={() => {
                setActiveTab('upgrade');
                triggerToast("Explore Macro Mastery Pro for unlimited custom diet generation!");
              }}
              showToast={triggerToast}
            />
          </div>
        )}

        {/* PREMIUM PAYWALL SUBSCRIPTION TAB COUPLER */}
        {activeTab === 'upgrade' && (
          <div className="animate-fadeIn">
            <Subscription
              profile={profile}
              onUpgradeProfile={handleTogglePremium}
              showToast={triggerToast}
            />
          </div>
        )}

        {/* PROFILE SETTINGS TAB COUPLER */}
        {activeTab === 'profile' && (
          <div className="animate-fadeIn">
            <ProfileSettings
              profile={profile}
              onSaveProfile={saveProfileState}
              onLogout={handleLogout}
              onResetOnboarding={handleResetProfile}
              onPurgeLogs={handlePurgeAllData}
              onSeedLogs={() => {
                saveLogsState(INITIAL_LOGS);
                triggerToast("Injecting standard past logs directly!");
              }}
              onIncrementStreak={handleForceStreakIncrease}
              showToast={triggerToast}
            />
          </div>
        )}

      </main>

      {/* CORE MOBILE TAB NAV BAR */}
      <footer className="bg-[#0c0c0c] border-t border-neutral-900 select-none py-1.5 sticky bottom-0 z-40 backdrop-blur">
        <div className="max-w-xl mx-auto grid grid-cols-7 gap-0.5 px-1 text-center">
          
          {/* Tab 1: Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'dashboard' ? 'text-rose-500 font-extrabold scale-105' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Calendar className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-[9px] tracking-tight font-medium whitespace-nowrap">Diary</span>
          </button>

          {/* Tab 2: Scanner */}
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'scanner' ? 'text-rose-500 font-extrabold scale-105' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Camera className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-[9px] tracking-tight font-medium whitespace-nowrap">AI Scan</span>
          </button>

          {/* Tab 3: Search */}
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'search' ? 'text-rose-500 font-extrabold scale-105' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Search className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-[9px] tracking-tight font-medium whitespace-nowrap">Search</span>
          </button>

          {/* Tab 4: AI Diet Plan */}
          <button
            onClick={() => setActiveTab('dietplan')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'dietplan' ? 'text-rose-500 font-extrabold scale-105' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Utensils className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-[9px] tracking-tight font-medium whitespace-nowrap">Diet Plan</span>
          </button>

          {/* Tab 5: Analytics */}
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'stats' ? 'text-rose-500 font-extrabold scale-105' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <BarChart3 className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-[9px] tracking-tight font-medium whitespace-nowrap">Stats</span>
          </button>

          {/* Tab 6: Profile & Settings */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'profile' ? 'text-rose-500 font-extrabold scale-105' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <User className="w-4.5 h-4.5 mb-0.5" />
            <span className="text-[9px] tracking-tight font-medium whitespace-nowrap">Profile</span>
          </button>

          {/* Tab 7: Premium entitlements */}
          <button
            onClick={() => setActiveTab('upgrade')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all relative ${
              activeTab === 'upgrade' ? 'text-rose-500 font-extrabold scale-105' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Sparkles className="w-4.5 h-4.5 mb-0.5 text-rose-400" />
            <span className="text-[9px] tracking-tight font-medium whitespace-nowrap">Premium</span>
            {!profile.isPremium && (
              <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

        </div>
      </footer>

    </div>
  );
}
