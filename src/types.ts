export type GoalType = 'lose' | 'maintain' | 'build';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'prefer-not-to-say';
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  goal: GoalType;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbsTarget: number;
  dailyFatTarget: number;
  isOnboardingCompleted: boolean;
  streakCurrent: number;
  streakLongest: number;
  streakLastDate?: string;
  isPremium: boolean;
  breakfastReminder?: boolean;
  lunchReminder?: boolean;
  dinnerReminder?: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence?: number;
  category?: string;
  imageUri?: string;
  isCustom?: boolean;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  type: MealType;
  name: string;
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  timeLogged: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  meals: Record<MealType, Meal>;
  waterIntakeMl: number;
  waterGoalMl: number;
  weightKg?: number;
  reflection?: string;
}

export interface PresetMealDemo {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  image: string;
  items: {
    name: string;
    portion: string;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  }[];
}
