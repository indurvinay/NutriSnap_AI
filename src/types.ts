export type GoalType = 'lose' | 'maintain' | 'build';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';

export type DietType = 'balanced' | 'high_protein' | 'keto' | 'low_carb' | 'mediterranean' | 'vegan' | 'intermittent_fasting';

export type DietaryRestriction = 'none' | 'gluten_free' | 'dairy_free' | 'nut_free' | 'vegetarian' | 'halal';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'prefer-not-to-say';
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  goal: GoalType;
  dietType?: DietType;
  dietaryRestrictions?: DietaryRestriction[];
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

export interface RecommendedMeal {
  id: string;
  mealType: MealType;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  prepTimeMinutes: number;
  description: string;
  ingredients: string[];
  recipe: string;
}

export interface DayDietPlan {
  dayNumber: number;
  dayName: string;
  meals: RecommendedMeal[];
  dayCalories: number;
  dayProtein: number;
  dayCarbs: number;
  dayFat: number;
}

export interface DietPlan {
  id: string;
  title: string;
  dietType: DietType;
  description: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  days: DayDietPlan[];
  shoppingList: string[];
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
