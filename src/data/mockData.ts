import { UserProfile, DailyLog } from '../types';

export const INITIAL_PROFILE: UserProfile = {
  name: "Alex Johnson",
  age: 26,
  gender: 'male',
  weightKg: 78,
  heightCm: 180,
  activityLevel: 'moderate',
  goal: 'lose',
  dailyCalorieTarget: 1950,
  dailyProteinTarget: 146,
  dailyCarbsTarget: 195,
  dailyFatTarget: 65,
  isOnboardingCompleted: true,
  streakCurrent: 7,
  streakLongest: 14,
  streakLastDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
  isPremium: false,
};

// Seed past 7 days of logs ending yesterday to make the stats dashboard feel complete
const getPastDateStr = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_LOGS: Record<string, DailyLog> = {
  // 6 Days Ago
  [getPastDateStr(6)]: {
    date: getPastDateStr(6),
    waterIntakeMl: 1500,
    waterGoalMl: 2500,
    weightKg: 78.4,
    meals: {
      breakfast: {
        id: 'b1', type: 'breakfast', name: 'Breakfast', timeLogged: '08:30 AM',
        items: [
          { id: 'f1', name: 'Greek Yogurt (Plain, Non-Fat)', portion: '1container (170g)', calories: 100, proteinG: 17.3, carbsG: 6.1, fatG: 0.7 },
          { id: 'f2', name: 'Red Apple', portion: '1 medium', calories: 95, proteinG: 0.5, carbsG: 25.1, fatG: 0.3 }
        ],
        totalCalories: 195, totalProtein: 17.8, totalCarbs: 31.2, totalFat: 1.0
      },
      lunch: {
        id: 'l1', type: 'lunch', name: 'Lunch', timeLogged: '01:15 PM',
        items: [
          { id: 'f3', name: 'Grilled Chicken Breast', portion: '150g', calories: 248, proteinG: 46, carbsG: 0, fatG: 5 },
          { id: 'f4', name: 'Brown Rice (Cooked)', portion: '1 cup', calories: 216, proteinG: 5, carbsG: 44.8, fatG: 1.8 }
        ],
        totalCalories: 464, totalProtein: 51, totalCarbs: 44.8, totalFat: 6.8
      },
      dinner: {
        id: 'd1', type: 'dinner', name: 'Dinner', timeLogged: '07:30 PM',
        items: [
          { id: 'f5', name: 'Pan-Seared Salmon Fillet', portion: '150g', calories: 312, proteinG: 34, carbsG: 0, fatG: 18 },
          { id: 'f6', name: 'Sweet Potato (Baked)', portion: '1 medium', calories: 135, proteinG: 3, carbsG: 31.2, fatG: 0.2 },
          { id: 'f7', name: 'Steamed Broccoli', portion: '1 cup', calories: 54, proteinG: 3.7, carbsG: 10.6, fatG: 0.6 }
        ],
        totalCalories: 501, totalProtein: 40.7, totalCarbs: 41.8, totalFat: 18.8
      },
      snack: {
        id: 's1', type: 'snack', name: 'Snack', timeLogged: '04:30 PM',
        items: [
          { id: 'f8', name: 'Whey Protein Powder', portion: '1 scoop', calories: 120, proteinG: 24, carbsG: 3, fatG: 1.5 },
          { id: 'f9', name: 'Mixed Nuts', portion: '1oz (28g)', calories: 172, proteinG: 6, carbsG: 6, fatG: 15 }
        ],
        totalCalories: 292, totalProtein: 30, totalCarbs: 9, totalFat: 16.5
      }
    }
  },

  // 5 Days Ago
  [getPastDateStr(5)]: {
    date: getPastDateStr(5),
    waterIntakeMl: 2000,
    waterGoalMl: 2500,
    weightKg: 78.2,
    meals: {
      breakfast: {
        id: 'b2', type: 'breakfast', name: 'Breakfast', timeLogged: '08:15 AM',
        items: [
          { id: 'f10', name: 'Hard Boiled Egg', portion: '2 large', calories: 156, proteinG: 12.6, carbsG: 1.2, fatG: 10.6 },
          { id: 'f11', name: 'Whole Wheat Bread', portion: '2 slices', calories: 138, proteinG: 7.2, carbsG: 24, fatG: 1.8 }
        ],
        totalCalories: 294, totalProtein: 19.8, totalCarbs: 25.2, totalFat: 12.4
      },
      lunch: {
        id: 'l2', type: 'lunch', name: 'Lunch', timeLogged: '01:00 PM',
        items: [
          { id: 'f12', name: 'Canned Tuna (In Water)', portion: '1 can', calories: 132, proteinG: 29, carbsG: 0, fatG: 1.2 },
          { id: 'f13', name: 'Avocado (Hass)', portion: '1/2 piece', calories: 120, proteinG: 1.5, carbsG: 6.4, fatG: 11 }
        ],
        totalCalories: 252, totalProtein: 30.5, totalCarbs: 6.4, totalFat: 12.2
      },
      dinner: {
        id: 'd2', type: 'dinner', name: 'Dinner', timeLogged: '07:00 PM',
        items: [
          { id: 'f14', name: 'Grilled Chicken Breast', portion: '150g', calories: 248, proteinG: 46, carbsG: 0, fatG: 5 },
          { id: 'f15', name: 'White Rice (Cooked)', portion: '1 cup', calories: 205, proteinG: 4.2, carbsG: 44.5, fatG: 0.4 },
          { id: 'f16', name: 'Steamed Broccoli', portion: '1 cup', calories: 54, proteinG: 3.7, carbsG: 10.6, fatG: 0.6 }
        ],
        totalCalories: 507, totalProtein: 53.9, totalCarbs: 55.1, totalFat: 6.0
      },
      snack: {
        id: 's2', type: 'snack', name: 'Snack', timeLogged: '04:00 PM',
        items: [
          { id: 'f17', name: 'Cavendish Banana', portion: '1 medium', calories: 105, proteinG: 1.3, carbsG: 27, fatG: 0.4 }
        ],
        totalCalories: 105, totalProtein: 1.3, totalCarbs: 27, totalFat: 0.4
      }
    }
  },

  // 4 Days Ago (Cheat Day!)
  [getPastDateStr(4)]: {
    date: getPastDateStr(4),
    waterIntakeMl: 1000,
    waterGoalMl: 2500,
    weightKg: 78.5,
    meals: {
      breakfast: {
        id: 'b3', type: 'breakfast', name: 'Breakfast', timeLogged: '09:00 AM',
        items: [
          { id: 'f18', name: 'Pancakes with Berries & Syrup', portion: '1 portion', calories: 480, proteinG: 12, carbsG: 85, fatG: 10 }
        ],
        totalCalories: 480, totalProtein: 12, totalCarbs: 85, totalFat: 10
      },
      lunch: {
        id: 'l3', type: 'lunch', name: 'Lunch', timeLogged: '02:00 PM',
        items: [
          { id: 'f19', name: 'Double Cheeseburger & Fries', portion: '1 portion', calories: 890, proteinG: 52, carbsG: 72, fatG: 44 }
        ],
        totalCalories: 890, totalProtein: 52, totalCarbs: 72, totalFat: 44
      },
      dinner: {
        id: 'd3', type: 'dinner', name: 'Dinner', timeLogged: '08:00 PM',
        items: [
          { id: 'f20', name: 'Whole Wheat Bread', portion: '1 slice', calories: 69, proteinG: 3.6, carbsG: 12, fatG: 0.9 }
        ],
        totalCalories: 69, totalProtein: 3.6, totalCarbs: 12, totalFat: 0.9
      },
      snack: {
        id: 's3', type: 'snack', name: 'Snack', timeLogged: '05:00 PM',
        items: [
          { id: 'f21', name: 'Dark Chocolate (70%)', portion: '15g', calories: 90, proteinG: 1.2, carbsG: 7.5, fatG: 6.3 }
        ],
        totalCalories: 90, totalProtein: 1.2, totalCarbs: 7.5, totalFat: 6.3
      }
    }
  },

  // 3 Days Ago
  [getPastDateStr(3)]: {
    date: getPastDateStr(3),
    waterIntakeMl: 2200,
    waterGoalMl: 2500,
    weightKg: 78.3,
    meals: {
      breakfast: {
        id: 'b4', type: 'breakfast', name: 'Breakfast', timeLogged: '08:00 AM',
        items: [
          { id: 'f22', name: 'Rolled Oats (Cooked)', portion: '1 cup', calories: 166, proteinG: 5.9, carbsG: 28.1, fatG: 4 },
          { id: 'f23', name: 'Greek Yogurt (Plain, Non-Fat)', portion: '1 container', calories: 100, proteinG: 17.3, carbsG: 6.1, fatG: 0.7 }
        ],
        totalCalories: 266, totalProtein: 23.2, totalCarbs: 34.2, totalFat: 4.7
      },
      lunch: {
        id: 'l4', type: 'lunch', name: 'Lunch', timeLogged: '01:30 PM',
        items: [
          { id: 'f24', name: 'Grilled Chicken Caesar Salad', portion: '1 portion', calories: 540, proteinG: 42, carbsG: 18, fatG: 34 }
        ],
        totalCalories: 540, totalProtein: 42, totalCarbs: 18, totalFat: 34
      },
      dinner: {
        id: 'd4', type: 'dinner', name: 'Dinner', timeLogged: '07:15 PM',
        items: [
          { id: 'f25', name: 'Pan-Seared Salmon Fillet', portion: '150g', calories: 312, proteinG: 34, carbsG: 0, fatG: 18 },
          { id: 'f26', name: 'Quinoa (Cooked)', portion: '1 cup', calories: 222, proteinG: 8.1, carbsG: 39.4, fatG: 3.6 }
        ],
        totalCalories: 534, totalProtein: 42.1, totalCarbs: 39.4, totalFat: 21.6
      },
      snack: {
        id: 's4', type: 'snack', name: 'Snack', timeLogged: '04:15 PM',
        items: [
          { id: 'f27', name: 'Mixed Nuts', portion: '1oz (28g)', calories: 172, proteinG: 6, carbsG: 6, fatG: 15 }
        ],
        totalCalories: 172, totalProtein: 6, totalCarbs: 6, totalFat: 15
      }
    }
  },

  // 2 Days Ago
  [getPastDateStr(2)]: {
    date: getPastDateStr(2),
    waterIntakeMl: 2600,
    waterGoalMl: 2500,
    weightKg: 78.0,
    meals: {
      breakfast: {
        id: 'b5', type: 'breakfast', name: 'Breakfast', timeLogged: '08:15 AM',
        items: [
          { id: 'f28', name: 'Smoked Salmon Eggs Benedict', portion: '1 portion', calories: 590, proteinG: 32, carbsG: 36, fatG: 35 }
        ],
        totalCalories: 590, totalProtein: 32, totalCarbs: 36, totalFat: 35
      },
      lunch: {
        id: 'l5', type: 'lunch', name: 'Lunch', timeLogged: '01:00 PM',
        items: [
          { id: 'f29', name: 'Greek Yogurt (Plain, Non-Fat)', portion: '1 container', calories: 100, proteinG: 17.3, carbsG: 6.1, fatG: 0.7 },
          { id: 'f30', name: 'Cavendish Banana', portion: '1 medium', calories: 105, proteinG: 1.3, carbsG: 27, fatG: 0.4 }
        ],
        totalCalories: 205, totalProtein: 18.6, totalCarbs: 33.1, totalFat: 1.1
      },
      dinner: {
        id: 'd5', type: 'dinner', name: 'Dinner', timeLogged: '06:45 PM',
        items: [
          { id: 'f31', name: 'Ribeye Steak (Grilled)', portion: '150g', calories: 435, proteinG: 36, carbsG: 0, fatG: 32 },
          { id: 'f32', name: 'Asparagus (Grilled)', portion: '6 spears', calories: 20, proteinG: 2.2, carbsG: 3.9, fatG: 0.2 }
        ],
        totalCalories: 455, totalProtein: 38.2, totalCarbs: 3.9, totalFat: 32.2
      },
      snack: {
        id: 's5', type: 'snack', name: 'Snack', timeLogged: '05:30 PM',
        items: [
          { id: 'f33', name: 'Protein Bar (Chocolate)', portion: '1 bar', calories: 220, proteinG: 20, carbsG: 22, fatG: 7 }
        ],
        totalCalories: 220, totalProtein: 20, totalCarbs: 22, totalFat: 7
      }
    }
  },

  // Yesterday
  [getPastDateStr(1)]: {
    date: getPastDateStr(1),
    waterIntakeMl: 2800,
    waterGoalMl: 2500,
    weightKg: 77.8,
    reflection: "⚡ High Energy · 🧠 Optimal Focus · Energy levels felt incredibly high and balanced all afternoon after the salmon dinner, zero cravings and slept perfectly!",
    meals: {
      breakfast: {
        id: 'b6', type: 'breakfast', name: 'Breakfast', timeLogged: '08:30 AM',
        items: [
          { id: 'f34', name: 'Classic Poached Egg & Avocado Toast', portion: '1 portion', calories: 395, proteinG: 14, carbsG: 32, fatG: 24 }
        ],
        totalCalories: 395, totalProtein: 14, totalCarbs: 32, totalFat: 24
      },
      lunch: {
        id: 'l6', type: 'lunch', name: 'Lunch', timeLogged: '01:00 PM',
        items: [
          { id: 'f35', name: 'Grilled Chicken Breast', portion: '150g', calories: 248, proteinG: 46, carbsG: 0, fatG: 5 },
          { id: 'f36', name: 'Quinoa (Cooked)', portion: '1 cup', calories: 222, proteinG: 8.1, carbsG: 39.4, fatG: 3.6 }
        ],
        totalCalories: 470, totalProtein: 54.1, totalCarbs: 39.4, totalFat: 8.6
      },
      dinner: {
        id: 'd6', type: 'dinner', name: 'Dinner', timeLogged: '07:30 PM',
        items: [
          { id: 'f37', name: 'Pan-Seared Salmon Fillet', portion: '150g', calories: 312, proteinG: 34, carbsG: 0, fatG: 18 },
          { id: 'f38', name: 'Steamed Broccoli', portion: '1 cup', calories: 54, proteinG: 3.7, carbsG: 10.6, fatG: 0.6 }
        ],
        totalCalories: 366, totalProtein: 37.7, totalCarbs: 10.6, totalFat: 18.6
      },
      snack: {
        id: 's6', type: 'snack', name: 'Snack', timeLogged: '03:45 PM',
        items: [
          { id: 'f39', name: 'Greek Yogurt (Plain, Non-Fat)', portion: '1 container', calories: 100, proteinG: 17.3, carbsG: 6.1, fatG: 0.7 }
        ],
        totalCalories: 100, totalProtein: 17.3, totalCarbs: 6.1, totalFat: 0.7
      }
    }
  }
};

// Math helper for Targets based on Mifflin-St Jeor
export function calculateMifflinTargets(
  gender: 'male' | 'female' | 'prefer-not-to-say',
  weightKg: number,
  heightCm: number,
  age: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active',
  goal: 'lose' | 'maintain' | 'build'
) {
  // BMR
  let bmr = 0;
  if (gender === 'female') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    // default to male equations as fallback
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }

  // Activity Multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725
  };
  const multiplier = activityMultipliers[activityLevel] || 1.2;
  const tdee = bmr * multiplier;

  // Adjustments based on body goal
  let targetCal = Math.round(tdee);
  if (goal === 'lose') {
    targetCal = Math.round(tdee - 500);
  } else if (goal === 'build') {
    targetCal = Math.round(tdee + 300);
  }

  // Ensure reasonable minimums
  if (targetCal < 1200) targetCal = 1200;

  // Macro standard splits
  // Protein: 30% of energy (4 kcal/g)
  // Carbs: 40% of energy (4 kcal/g)
  // Fat: 30% of energy (9 kcal/g)
  const proteinG = Math.round((targetCal * 0.30) / 4);
  const carbsG = Math.round((targetCal * 0.40) / 4);
  const fatG = Math.round((targetCal * 0.30) / 9);

  return {
    calories: targetCal,
    protein: proteinG,
    carbs: carbsG,
    fat: fatG,
  };
}
