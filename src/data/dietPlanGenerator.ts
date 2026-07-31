import { UserProfile, DietPlan, DietType, RecommendedMeal, DayDietPlan } from '../types';

export const generatePersonalizedDietPlan = (profile: UserProfile): DietPlan => {
  const targetCal = profile.dailyCalorieTarget || 2000;
  const targetProt = profile.dailyProteinTarget || 150;
  const targetCarb = profile.dailyCarbsTarget || 200;
  const targetFat = profile.dailyFatTarget || 65;
  const selectedDiet: DietType = profile.dietType || (profile.goal === 'build' ? 'high_protein' : profile.goal === 'lose' ? 'low_carb' : 'balanced');

  const dietTitles: Record<DietType, string> = {
    high_protein: "Lean Muscle Hypertrophy & High Protein Plan",
    keto: "Ketogenic Fat Burning & Ultra Low-Carb Plan",
    balanced: "Optimal Macro Balance & Daily Vitality Plan",
    low_carb: "Metabolic Caloric Deficit & Low-Carb Plan",
    mediterranean: "Cardiovascular Health & Mediterranean Plan",
    vegan: "Plant-Based Vitality & Micronutrient Rich Plan",
    intermittent_fasting: "16:8 Autophagy & Intermittent Fasting Plan"
  };

  const dietDescriptions: Record<DietType, string> = {
    high_protein: `Tailored for ${profile.goal === 'build' ? 'muscle hypertrophy' : 'lean mass retention'}. Delivers ${targetProt}g protein daily split across 4 nutrient-dense meals to maximize protein synthesis.`,
    keto: `High healthy fat (70%) and minimal net carbs (<30g daily) to induce nutritional ketosis and accelerate lipolysis for weight loss.`,
    balanced: `Sustained daily energy with 40% carbs, 30% protein, and 30% healthy fats suitable for long-term health maintenance.`,
    low_carb: `Controlled carbohydrate intake to minimize insulin spikes and maximize steady fat burning throughout the day.`,
    mediterranean: `Rich in omega-3 fatty acids, extra virgin olive oil, wild seafood, legumes, and antioxidants for longevity.`,
    vegan: `100% plant-based protein sources including quinoa, lentils, edamame, and tofu formulated to fulfill all essential amino acids.`,
    intermittent_fasting: `Structured 16-hour fasting / 8-hour eating window to boost growth hormone, cellular repair, and insulin sensitivity.`
  };

  const mealTemplates: Record<DietType, { b: RecommendedMeal[]; l: RecommendedMeal[]; d: RecommendedMeal[]; s: RecommendedMeal[] }> = {
    high_protein: {
      b: [
        {
          id: 'hp-b1',
          mealType: 'breakfast',
          name: 'Egg White & Whey Protein Power Bowl',
          calories: Math.round(targetCal * 0.25),
          proteinG: Math.round(targetProt * 0.3),
          carbsG: Math.round(targetCarb * 0.2),
          fatG: Math.round(targetFat * 0.2),
          prepTimeMinutes: 10,
          description: 'Fluffy scramble of 4 egg whites and 2 whole eggs served with steel-cut oats topped with berries and cinnamon.',
          ingredients: ['4 Egg Whites', '2 Whole Eggs', '50g Steel-cut Oats', '30g Blueberries', '1 scoop Whey Protein'],
          recipe: 'Whisk egg whites with whole eggs. Cook in non-stick pan over medium heat. Serve alongside warm oats stirred with protein powder and fresh blueberries.'
        },
        {
          id: 'hp-b2',
          mealType: 'breakfast',
          name: 'Greek Yogurt & Almond Protein Crunch',
          calories: Math.round(targetCal * 0.25),
          proteinG: Math.round(targetProt * 0.32),
          carbsG: Math.round(targetCarb * 0.18),
          fatG: Math.round(targetFat * 0.22),
          prepTimeMinutes: 5,
          description: 'Triple-zero Greek yogurt layered with chia seeds, crushed almonds, and organic honey.',
          ingredients: ['250g Non-fat Greek Yogurt', '15g Chia Seeds', '20g Sliced Almonds', '10g Honey'],
          recipe: 'Layer Greek yogurt in a bowl. Sprinkle chia seeds and sliced almonds on top. Drizzle organic honey before serving.'
        }
      ],
      l: [
        {
          id: 'hp-l1',
          mealType: 'lunch',
          name: 'Grilled Herb Chicken & Quinoa Energy Bowl',
          calories: Math.round(targetCal * 0.32),
          proteinG: Math.round(targetProt * 0.35),
          carbsG: Math.round(targetCarb * 0.35),
          fatG: Math.round(targetFat * 0.25),
          prepTimeMinutes: 20,
          description: 'Seasoned chicken breast grilled to perfection, paired with fluffy quinoa and steamed broccoli.',
          ingredients: ['200g Chicken Breast', '80g Quinoa (cooked)', '150g Broccoli florets', '1 tsp Olive Oil'],
          recipe: 'Season chicken breast with garlic and herbs. Grill over medium-high heat for 6 mins per side. Serve over cooked quinoa with steamed broccoli florets.'
        },
        {
          id: 'hp-l2',
          mealType: 'lunch',
          name: 'Seared Salmon & Sweet Potato Clean Plate',
          calories: Math.round(targetCal * 0.32),
          proteinG: Math.round(targetProt * 0.33),
          carbsG: Math.round(targetCarb * 0.32),
          fatG: Math.round(targetFat * 0.3),
          prepTimeMinutes: 25,
          description: 'Wild-caught salmon fillet rich in omega-3s, served with roasted sweet potato wedges and asparagus.',
          ingredients: ['180g Wild Salmon Fillet', '150g Roasted Sweet Potato', '100g Asparagus spears', 'Lemon squeeze'],
          recipe: 'Pan-sear salmon skin-side down for 4 mins, flip and cook 3 mins. Bake sweet potato wedges in oven at 200°C for 20 mins. Serve with fresh lemon squeeze.'
        }
      ],
      d: [
        {
          id: 'hp-d1',
          mealType: 'dinner',
          name: 'Sirloin Steak & Roasted Garlic Green Beans',
          calories: Math.round(targetCal * 0.3),
          proteinG: Math.round(targetProt * 0.3),
          carbsG: Math.round(targetCarb * 0.2),
          fatG: Math.round(targetFat * 0.35),
          prepTimeMinutes: 20,
          description: 'Lean sirloin steak pan-seared with rosemary garlic, served with crisp green beans and brown rice.',
          ingredients: ['180g Lean Sirloin Steak', '120g Green Beans', '100g Brown Rice (cooked)', '1 clove Garlic'],
          recipe: 'Sear sirloin in hot skillet with minced garlic and rosemary for 3-4 mins per side. Sauté green beans in remaining pan juices and serve over brown rice.'
        }
      ],
      s: [
        {
          id: 'hp-s1',
          mealType: 'snack',
          name: 'Cottage Cheese & Pineapple Recovery Cup',
          calories: Math.round(targetCal * 0.13),
          proteinG: Math.round(targetProt * 0.15),
          carbsG: Math.round(targetCarb * 0.15),
          fatG: Math.round(targetFat * 0.1),
          prepTimeMinutes: 3,
          description: 'Slow-digesting casein protein from low-fat cottage cheese paired with fresh pineapple chunks.',
          ingredients: ['150g Low-fat Cottage Cheese', '80g Pineapple chunks'],
          recipe: 'Combine cottage cheese and fresh pineapple chunks in a glass bowl. Enjoy immediately as an afternoon snack.'
        }
      ]
    },
    keto: {
      b: [
        {
          id: 'k-b1',
          mealType: 'breakfast',
          name: 'Avocado, Bacon & Cheddar Omelette',
          calories: Math.round(targetCal * 0.3),
          proteinG: Math.round(targetProt * 0.25),
          carbsG: Math.round(targetCarb * 0.08),
          fatG: Math.round(targetFat * 0.4),
          prepTimeMinutes: 12,
          description: 'Rich 3-egg omelette stuffed with melted sharp cheddar, crispy bacon bits, and sliced avocado.',
          ingredients: ['3 Large Eggs', '2 slices Crisp Bacon', '30g Sharp Cheddar', '1/2 Medium Avocado', '1 tbsp Butter'],
          recipe: 'Melt butter in pan. Pour beaten eggs. When set, fill one side with cheddar, bacon, and avocado slices. Fold over and serve piping hot.'
        }
      ],
      l: [
        {
          id: 'k-l1',
          mealType: 'lunch',
          name: 'Keto Chicken Caesar Salad Bowl',
          calories: Math.round(targetCal * 0.35),
          proteinG: Math.round(targetProt * 0.35),
          carbsG: Math.round(targetCarb * 0.08),
          fatG: Math.round(targetFat * 0.4),
          prepTimeMinutes: 15,
          description: 'Crisp romaine lettuce topped with grilled chicken thigh, parmesan shavings, and avocado oil Caesar dressing.',
          ingredients: ['180g Grilled Chicken Thigh', '2 cups Romaine Lettuce', '25g Parmesan Cheese', '2 tbsp Avocado Oil Caesar'],
          recipe: 'Toss romaine lettuce with Caesar dressing and parmesan. Slice warm grilled chicken thigh over greens.'
        }
      ],
      d: [
        {
          id: 'k-d1',
          mealType: 'dinner',
          name: 'Butter-Poached Salmon & Zucchini Ribbons',
          calories: Math.round(targetCal * 0.25),
          proteinG: Math.round(targetProt * 0.3),
          carbsG: Math.round(targetCarb * 0.08),
          fatG: Math.round(targetFat * 0.35),
          prepTimeMinutes: 18,
          description: 'Rich salmon fillet poached in herb butter served alongside garlic sauteed zucchini ribbons.',
          ingredients: ['180g Salmon Fillet', '2 tbsp Grass-fed Butter', '1 Medium Zucchini', '1 clove Garlic'],
          recipe: 'Spiralize zucchini. Gently poach salmon in melted butter over low heat for 8 mins. Sauté zucchini with garlic for 2 mins.'
        }
      ],
      s: [
        {
          id: 'k-s1',
          mealType: 'snack',
          name: 'Keto Macadamia & Pecan Fuel Mix',
          calories: Math.round(targetCal * 0.1),
          proteinG: Math.round(targetProt * 0.1),
          carbsG: Math.round(targetCarb * 0.05),
          fatG: Math.round(targetFat * 0.15),
          prepTimeMinutes: 1,
          description: 'Raw macadamia nuts and pecans providing healthy monounsaturated fats.',
          ingredients: ['20g Macadamia Nuts', '15g Raw Pecan halves'],
          recipe: 'Portion raw macadamia nuts and pecans into a snack pouch for quick keto energy.'
        }
      ]
    },
    balanced: {
      b: [
        {
          id: 'bal-b1',
          mealType: 'breakfast',
          name: 'Avocado Toast & Poached Organic Eggs',
          calories: Math.round(targetCal * 0.25),
          proteinG: Math.round(targetProt * 0.25),
          carbsG: Math.round(targetCarb * 0.25),
          fatG: Math.round(targetFat * 0.25),
          prepTimeMinutes: 10,
          description: 'Whole grain sourdough topped with mashed avocado, chili flakes, and 2 poached organic eggs.',
          ingredients: ['2 slices Whole Grain Sourdough', '1/2 Hass Avocado', '2 Organic Eggs', 'Chili flakes & sea salt'],
          recipe: 'Toast sourdough. Mash avocado with lemon juice and salt. Poach eggs in simmering water for 3 mins. Layer mashed avocado and top with poached eggs.'
        }
      ],
      l: [
        {
          id: 'bal-l1',
          mealType: 'lunch',
          name: 'Turkey & Hummus Whole Wheat Wrap',
          calories: Math.round(targetCal * 0.3),
          proteinG: Math.round(targetProt * 0.3),
          carbsG: Math.round(targetCarb * 0.3),
          fatG: Math.round(targetFat * 0.25),
          prepTimeMinutes: 8,
          description: 'Sliced roast turkey breast, roasted red pepper hummus, cucumber, and spinach inside a whole wheat tortilla.',
          ingredients: ['1 Large Whole Wheat Tortilla', '120g Roasted Turkey Slices', '2 tbsp Garlic Hummus', 'Cucumber & Spinach'],
          recipe: 'Spread hummus over tortilla. Layer turkey slices, cucumber strips, and spinach. Wrap tightly and slice diagonally.'
        }
      ],
      d: [
        {
          id: 'bal-d1',
          mealType: 'dinner',
          name: 'Lean Herb Turkey Meatballs & Marinara Quinoa',
          calories: Math.round(targetCal * 0.3),
          proteinG: Math.round(targetProt * 0.3),
          carbsG: Math.round(targetCarb * 0.3),
          fatG: Math.round(targetFat * 0.3),
          prepTimeMinutes: 25,
          description: 'Oven-baked turkey meatballs in organic marinara sauce served over a bed of fluffy quinoa.',
          ingredients: ['180g Lean Ground Turkey', '1/2 cup Marinara Sauce', '100g Quinoa (cooked)', 'Fresh Basil'],
          recipe: 'Form turkey into balls and bake at 200°C for 15 mins. Simmer in marinara sauce for 5 mins and serve over warm quinoa.'
        }
      ],
      s: [
        {
          id: 'bal-s1',
          mealType: 'snack',
          name: 'Apple Slices with Natural Peanut Butter',
          calories: Math.round(targetCal * 0.15),
          proteinG: Math.round(targetProt * 0.15),
          carbsG: Math.round(targetCarb * 0.15),
          fatG: Math.round(targetFat * 0.2),
          prepTimeMinutes: 3,
          description: 'Crisp Honeycrisp apple slices dipped in 100% natural peanut butter.',
          ingredients: ['1 Medium Honeycrisp Apple', '2 tbsp Natural Peanut Butter'],
          recipe: 'Slice apple into 8 wedges. Dip into creamy natural peanut butter.'
        }
      ]
    },
    low_carb: {
      b: [
        {
          id: 'lc-b1',
          mealType: 'breakfast',
          name: 'Spinach & Mushroom Egg White Frittata',
          calories: Math.round(targetCal * 0.22),
          proteinG: Math.round(targetProt * 0.3),
          carbsG: Math.round(targetCarb * 0.1),
          fatG: Math.round(targetFat * 0.25),
          prepTimeMinutes: 15,
          description: 'Baked egg white frittata loaded with fresh baby spinach, cremini mushrooms, and feta cheese.',
          ingredients: ['5 Egg Whites', '1 Whole Egg', '50g Baby Spinach', '40g Mushrooms', '20g Feta Cheese'],
          recipe: 'Sauté mushrooms and spinach. Pour whisked egg whites and 1 whole egg into pan. Top with feta cheese and bake at 180°C for 12 mins.'
        }
      ],
      l: [
        {
          id: 'lc-l1',
          mealType: 'lunch',
          name: 'Grilled Beef Patty Lettuce Wraps',
          calories: Math.round(targetCal * 0.35),
          proteinG: Math.round(targetProt * 0.35),
          carbsG: Math.round(targetCarb * 0.1),
          fatG: Math.round(targetFat * 0.35),
          prepTimeMinutes: 15,
          description: 'Two lean grass-fed beef patties wrapped in crisp iceberg lettuce leaves with tomato, onion, and mustard.',
          ingredients: ['200g Lean Ground Beef (90/10)', '4 Large Iceberg Lettuce leaves', 'Tomato slices', 'Dijon Mustard'],
          recipe: 'Grill patties 4 mins per side. Wrap each patty in crisp iceberg lettuce leaves with tomato slices and Dijon mustard.'
        }
      ],
      d: [
        {
          id: 'lc-d1',
          mealType: 'dinner',
          name: 'Lemon Herb Baked Cod & Cauliflower Mash',
          calories: Math.round(targetCal * 0.3),
          proteinG: Math.round(targetProt * 0.3),
          carbsG: Math.round(targetCarb * 0.12),
          fatG: Math.round(targetFat * 0.25),
          prepTimeMinutes: 20,
          description: 'Flaky white cod fillet baked with herbs and olive oil, served alongside creamy garlic cauliflower mash.',
          ingredients: ['200g Wild Cod Fillet', '200g Cauliflower florets', '1 tbsp Olive Oil', 'Lemon & Dill'],
          recipe: 'Bake cod with olive oil, lemon, and dill at 200°C for 12 mins. Steam cauliflower and mash with garlic and salt.'
        }
      ],
      s: [
        {
          id: 'lc-s1',
          mealType: 'snack',
          name: 'Celery Sticks with Almond Butter',
          calories: Math.round(targetCal * 0.13),
          proteinG: Math.round(targetProt * 0.1),
          carbsG: Math.round(targetCarb * 0.08),
          fatG: Math.round(targetFat * 0.25),
          prepTimeMinutes: 2,
          description: 'Crispy crunchy celery stalks filled with creamy raw almond butter.',
          ingredients: ['3 Celery Stalks', '1.5 tbsp Raw Almond Butter'],
          recipe: 'Wash celery stalks and spread raw almond butter down the center channel.'
        }
      ]
    },
    mediterranean: {
      b: [
        {
          id: 'med-b1',
          mealType: 'breakfast',
          name: 'Greek Shakshuka with Feta & Crusty Bread',
          calories: Math.round(targetCal * 0.25),
          proteinG: Math.round(targetProt * 0.25),
          carbsG: Math.round(targetCarb * 0.25),
          fatG: Math.round(targetFat * 0.25),
          prepTimeMinutes: 20,
          description: 'Eggs poached in a rich spiced tomato, bell pepper, and garlic sauce topped with crumbled feta cheese.',
          ingredients: ['2 Eggs', '150g Diced Tomatoes', '1/2 Red Bell Pepper', '20g Feta Cheese', '1 slice Whole Grain Bread'],
          recipe: 'Simmer bell pepper and diced tomatoes with cumin and garlic. Make 2 wells, crack eggs inside, cover pan for 5 mins until whites set. Top with feta.'
        }
      ],
      l: [
        {
          id: 'med-l1',
          mealType: 'lunch',
          name: 'Mediterranean Tuna & Chickpea Grain Salad',
          calories: Math.round(targetCal * 0.32),
          proteinG: Math.round(targetProt * 0.35),
          carbsG: Math.round(targetCarb * 0.3),
          fatG: Math.round(targetFat * 0.25),
          prepTimeMinutes: 10,
          description: 'Flaked albacore tuna, chickpeas, kalamata olives, cherry tomatoes, and extra virgin olive oil.',
          ingredients: ['150g Albacore Tuna in Olive Oil', '100g Chickpeas', '30g Kalamata Olives', 'Cherry Tomatoes', 'EVOO Dressing'],
          recipe: 'Toss flaked tuna, drained chickpeas, halved cherry tomatoes, and kalamata olives with extra virgin olive oil and oregano.'
        }
      ],
      d: [
        {
          id: 'med-d1',
          mealType: 'dinner',
          name: 'Baked Sea Bass with Roasted Vegetables & Couscous',
          calories: Math.round(targetCal * 0.3),
          proteinG: Math.round(targetProt * 0.28),
          carbsG: Math.round(targetCarb * 0.3),
          fatG: Math.round(targetFat * 0.3),
          prepTimeMinutes: 25,
          description: 'Tender Mediterranean sea bass fillet roasted with zucchini, red onion, and served over whole wheat couscous.',
          ingredients: ['180g Sea Bass Fillet', '100g Roasted Zucchini & Red Onion', '80g Whole Wheat Couscous (cooked)', '1 tbsp EVOO'],
          recipe: 'Drizzle fish and vegetables with extra virgin olive oil and roast at 200°C for 15 mins. Serve over warm fluffy couscous.'
        }
      ],
      s: [
        {
          id: 'med-s1',
          mealType: 'snack',
          name: 'Walnut & Dried Fig Energy Plate',
          calories: Math.round(targetCal * 0.13),
          proteinG: Math.round(targetProt * 0.12),
          carbsG: Math.round(targetCarb * 0.15),
          fatG: Math.round(targetFat * 0.2),
          prepTimeMinutes: 1,
          description: 'Heart-healthy English walnuts paired with sweet organic dried figs.',
          ingredients: ['25g English Walnuts', '2 Organic Dried Figs'],
          recipe: 'Combine walnuts and sliced dried figs for a classic Mediterranean antioxidant snack.'
        }
      ]
    },
    vegan: {
      b: [
        {
          id: 'v-b1',
          mealType: 'breakfast',
          name: 'Tofu Scramble & Avocado Breakfast Bowl',
          calories: Math.round(targetCal * 0.25),
          proteinG: Math.round(targetProt * 0.28),
          carbsG: Math.round(targetCarb * 0.22),
          fatG: Math.round(targetFat * 0.25),
          prepTimeMinutes: 12,
          description: 'Crumbled organic firm tofu sautéed with turmeric, nutritional yeast, kale, and sliced avocado.',
          ingredients: ['180g Firm Tofu', '1 tbsp Nutritional Yeast', '1/2 tsp Turmeric', '50g Kale', '1/2 Avocado'],
          recipe: 'Crumble tofu into skillet. Sauté with turmeric, nutritional yeast, and kale for 6 mins. Top with sliced avocado.'
        }
      ],
      l: [
        {
          id: 'v-l1',
          mealType: 'lunch',
          name: 'Lentil & Sweet Potato Buddha Bowl',
          calories: Math.round(targetCal * 0.32),
          proteinG: Math.round(targetProt * 0.32),
          carbsG: Math.round(targetCarb * 0.38),
          fatG: Math.round(targetFat * 0.2),
          prepTimeMinutes: 20,
          description: 'Protein-packed brown lentils, roasted sweet potato, edamame, and tahini lemon dressing.',
          ingredients: ['120g Brown Lentils (cooked)', '120g Roasted Sweet Potato', '50g Edamame', '1.5 tbsp Tahini Dressing'],
          recipe: 'Assemble cooked lentils, roasted sweet potato cubes, and steamed edamame in a bowl. Drizzle with creamy tahini dressing.'
        }
      ],
      d: [
        {
          id: 'v-d1',
          mealType: 'dinner',
          name: 'Chickpea & Spinach Coconut Curry with Jasmine Rice',
          calories: Math.round(targetCal * 0.3),
          proteinG: Math.round(targetProt * 0.25),
          carbsG: Math.round(targetCarb * 0.35),
          fatG: Math.round(targetFat * 0.3),
          prepTimeMinutes: 25,
          description: 'Chickpeas and spinach simmered in a fragrant coconut curry sauce over fluffy jasmine rice.',
          ingredients: ['150g Chickpeas', '100g Coconut Milk (light)', '50g Baby Spinach', '100g Jasmine Rice (cooked)', '1 tbsp Curry Paste'],
          recipe: 'Sauté curry paste. Add coconut milk and chickpeas, simmer 10 mins. Stir in spinach until wilted and serve over jasmine rice.'
        }
      ],
      s: [
        {
          id: 'v-s1',
          mealType: 'snack',
          name: 'Edamame Pods with Sea Salt',
          calories: Math.round(targetCal * 0.13),
          proteinG: Math.round(targetProt * 0.15),
          carbsG: Math.round(targetCarb * 0.1),
          fatG: Math.round(targetFat * 0.1),
          prepTimeMinutes: 5,
          description: 'Steamed green edamame pods sprinkled with coarse sea salt.',
          ingredients: ['150g Edamame in pods', 'Coarse Sea Salt'],
          recipe: 'Steam edamame pods for 4 mins. Drain, sprinkle with coarse sea salt, and pop seeds directly into mouth.'
        }
      ]
    },
    intermittent_fasting: {
      b: [
        {
          id: 'if-b1',
          mealType: 'breakfast',
          name: 'Fasting Window Break: Avocado & Egg Protein Feast',
          calories: Math.round(targetCal * 0.35),
          proteinG: Math.round(targetProt * 0.38),
          carbsG: Math.round(targetCarb * 0.25),
          fatG: Math.round(targetFat * 0.35),
          prepTimeMinutes: 12,
          description: 'First meal of the 8-hour window: 4 eggs, avocado, and toasted sourdough to gently restore glycogen and amino acid levels.',
          ingredients: ['4 Eggs (Scrambled)', '1 Whole Avocado', '2 slices Toast', 'Cherry Tomatoes'],
          recipe: 'Scramble 4 eggs in butter. Serve alongside sliced avocado, toasted sourdough, and fresh cherry tomatoes.'
        }
      ],
      l: [
        {
          id: 'if-l1',
          mealType: 'lunch',
          name: 'Mid-Window Power Plate: Grilled Steak & Rice',
          calories: Math.round(targetCal * 0.45),
          proteinG: Math.round(targetProt * 0.45),
          carbsG: Math.round(targetCarb * 0.45),
          fatG: Math.round(targetFat * 0.4),
          prepTimeMinutes: 20,
          description: 'Substantial high-protein, high-carb meal midway through eating window to fuel metabolic rate and muscle repair.',
          ingredients: ['220g Lean Steak', '150g Brown Rice (cooked)', '150g Steamed Broccoli', '1 tbsp Olive Oil'],
          recipe: 'Grill steak to medium-rare. Serve with warm brown rice and steamed broccoli drizzled with olive oil.'
        }
      ],
      d: [
        {
          id: 'if-d1',
          mealType: 'dinner',
          name: 'Window Closer: Salmon & Greek Yogurt Bowl',
          calories: Math.round(targetCal * 0.2),
          proteinG: Math.round(targetProt * 0.17),
          carbsG: Math.round(targetCarb * 0.1),
          fatG: Math.round(targetFat * 0.25),
          prepTimeMinutes: 10,
          description: 'Final meal eaten right before starting the 16-hour fast. Rich in slow-digesting protein and healthy fats.',
          ingredients: ['150g Baked Salmon', '150g Greek Yogurt', 'Handful of Berries'],
          recipe: 'Bake salmon fillet. Follow with a small bowl of Greek yogurt topped with berries right before initiating fast.'
        }
      ],
      s: []
    }
  };

  const templates = mealTemplates[selectedDiet] || mealTemplates.balanced;
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const days: DayDietPlan[] = dayNames.map((dayName, idx) => {
    // Pick meal variants
    const bMeal = templates.b[idx % templates.b.length];
    const lMeal = templates.l[idx % templates.l.length];
    const dMeal = templates.d[idx % templates.d.length];
    const sMeal = templates.s.length > 0 ? templates.s[idx % templates.s.length] : null;

    const meals: RecommendedMeal[] = [bMeal, lMeal, dMeal];
    if (sMeal) meals.push(sMeal);

    const dayCal = meals.reduce((acc, m) => acc + m.calories, 0);
    const dayProt = meals.reduce((acc, m) => acc + m.proteinG, 0);
    const dayCarb = meals.reduce((acc, m) => acc + m.carbsG, 0);
    const dayFat = meals.reduce((acc, m) => acc + m.fatG, 0);

    return {
      dayNumber: idx + 1,
      dayName,
      meals,
      dayCalories: dayCal,
      dayProtein: dayProt,
      dayCarbs: dayCarb,
      dayFat: dayFat
    };
  });

  // Consolidate complete shopping list
  const shoppingSet = new Set<string>();
  days.forEach(day => {
    day.meals.forEach(m => {
      m.ingredients.forEach(ing => shoppingSet.add(ing));
    });
  });

  return {
    id: `diet-plan-${selectedDiet}-${profile.goal}`,
    title: dietTitles[selectedDiet],
    dietType: selectedDiet,
    description: dietDescriptions[selectedDiet],
    targetCalories: targetCal,
    targetProtein: targetProt,
    targetCarbs: targetCarb,
    targetFat: targetFat,
    days,
    shoppingList: Array.from(shoppingSet)
  };
};
