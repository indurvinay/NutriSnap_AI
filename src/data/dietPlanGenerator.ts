import { UserProfile, DietPlan, DietType, CuisineType, RecommendedMeal, DayDietPlan, GroceryAisle } from '../types';

export const generatePersonalizedDietPlan = (profile: UserProfile): DietPlan => {
  const targetCal = profile.dailyCalorieTarget || 2000;
  const targetProt = profile.dailyProteinTarget || 150;
  const targetCarb = profile.dailyCarbsTarget || 200;
  const targetFat = profile.dailyFatTarget || 65;
  const selectedDiet: DietType = profile.dietType || (profile.goal === 'build' ? 'high_protein' : profile.goal === 'lose' ? 'low_carb' : 'balanced');
  const selectedCuisine: CuisineType = profile.cuisinePreference || 'all';

  const dietTitles: Record<DietType, string> = {
    high_protein: "Hypertrophy & Ultra High-Protein Architecture",
    keto: "Ketogenic Lipolysis & Fat-Adaptation Master Plan",
    balanced: "Metabolic Longevity & Macro Precision Balance",
    low_carb: "Insulin-Optimized Low Carb & Deficit Engine",
    mediterranean: "Cardiovascular & Polyunsaturated Fatty Acid Plan",
    vegan: "100% Bioavailable Plant-Based Macro Architecture",
    intermittent_fasting: "16:8 Autophagy & Cellular Renewal Protocol"
  };

  // MULTI-CUISINE MEAL REPOSITORY WITH SWAP ALTERNATIVES & GLYCEMIC TAGS
  const cuisineMealDatabase: Record<CuisineType, { b: RecommendedMeal[]; l: RecommendedMeal[]; d: RecommendedMeal[]; s: RecommendedMeal[] }> = {
    indian: {
      b: [
        {
          id: 'ind-b1',
          mealType: 'breakfast',
          name: 'Paneer & Oats Protein Chilla with Mint Chutney',
          cuisine: 'indian',
          calories: Math.round(targetCal * 0.25),
          proteinG: Math.round(targetProt * 0.28),
          carbsG: Math.round(targetCarb * 0.22),
          fatG: Math.round(targetFat * 0.24),
          prepTimeMinutes: 12,
          glycemicIndex: 'low',
          description: 'Savory oats & moong dal pancakes stuffed with spiced low-fat paneer and homemade mint cilantro chutney.',
          ingredients: ['100g Low-fat Paneer', '50g Oats Flour', '30g Yellow Moong Dal', '1 tbsp Mint Chutney', 'Spices & Green Chili'],
          recipe: 'Blend oats flour and soaked moong dal with water to form batter. Pour onto non-stick tawa. Crumble paneer inside with spices and fold like a crepe.',
          swapAlternatives: [
            { name: 'Egg Bhurji with Whole Wheat Toast', calories: Math.round(targetCal * 0.25), proteinG: Math.round(targetProt * 0.28), carbsG: Math.round(targetCarb * 0.2), fatG: Math.round(targetFat * 0.25), ingredients: ['3 Eggs', '1 Onion', '1 Tomato', '2 Toast'] },
            { name: 'Soya Chunk & Vegetable Upma', calories: Math.round(targetCal * 0.25), proteinG: Math.round(targetProt * 0.27), carbsG: Math.round(targetCarb * 0.25), fatG: Math.round(targetFat * 0.2), ingredients: ['40g Soya Chunks', '40g Rava', 'Peas & Mustard seeds'] }
          ]
        }
      ],
      l: [
        {
          id: 'ind-l1',
          mealType: 'lunch',
          name: 'Tandoori Chicken Tikka & Dal Tadka with Brown Basmati',
          cuisine: 'indian',
          calories: Math.round(targetCal * 0.33),
          proteinG: Math.round(targetProt * 0.36),
          carbsG: Math.round(targetCarb * 0.32),
          fatG: Math.round(targetFat * 0.26),
          prepTimeMinutes: 22,
          glycemicIndex: 'low',
          description: 'Marinated roasted chicken breast skewers served with protein-rich yellow dal tadka and aromatic brown basmati rice.',
          ingredients: ['200g Chicken Breast', '100g Yellow Toor Dal (cooked)', '100g Brown Basmati Rice (cooked)', '2 tbsp Greek Yogurt marinade'],
          recipe: 'Marinate chicken in yogurt, garlic, ginger, and garam masala. Air-fry or grill at 200°C for 15 mins. Serve alongside warm yellow dal tadka and brown basmati rice.',
          swapAlternatives: [
            { name: 'Paneer Butter Masala (Light) & Multigrain Roti', calories: Math.round(targetCal * 0.33), proteinG: Math.round(targetProt * 0.32), carbsG: Math.round(targetCarb * 0.35), fatG: Math.round(targetFat * 0.3), ingredients: ['150g Paneer', '2 Multigrain Rotis', 'Tomato Cashew Sauce'] },
            { name: 'Fish Curry with Red Rice & Cucumber Salad', calories: Math.round(targetCal * 0.33), proteinG: Math.round(targetProt * 0.35), carbsG: Math.round(targetCarb * 0.3), fatG: Math.round(targetFat * 0.24), ingredients: ['180g White Fish', '100g Red Rice', 'Coconut Curry'] }
          ]
        }
      ],
      d: [
        {
          id: 'ind-d1',
          mealType: 'dinner',
          name: 'Kadhai Tofu & Palak Saag with Missi Roti',
          cuisine: 'indian',
          calories: Math.round(targetCal * 0.28),
          proteinG: Math.round(targetProt * 0.3),
          carbsG: Math.round(targetCarb * 0.28),
          fatG: Math.round(targetFat * 0.25),
          prepTimeMinutes: 20,
          glycemicIndex: 'low',
          description: 'High-protein tofu cubes cooked in spiced spinach purée (Palak) served with high-fiber chickpea flour Missi Roti.',
          ingredients: ['180g Organic Tofu', '150g Fresh Spinach', '1 Missi Roti (Besan + Wheat)', '1 tsp Ghee'],
          recipe: 'Blanch and purée spinach with garlic and chili. Sauté tofu cubes with spices and fold into hot spinach purée. Serve with freshly toasted missi roti.'
        }
      ],
      s: [
        {
          id: 'ind-s1',
          mealType: 'snack',
          name: 'Roasted Masala Makhana & Sprouted Moong Chaat',
          cuisine: 'indian',
          calories: Math.round(targetCal * 0.14),
          proteinG: Math.round(targetProt * 0.16),
          carbsG: Math.round(targetCarb * 0.18),
          fatG: Math.round(targetFat * 0.1),
          prepTimeMinutes: 5,
          glycemicIndex: 'low',
          description: 'Crunchy ghee-roasted foxnuts (Makhana) mixed with sprouted green moong, lemon juice, and chaat masala.',
          ingredients: ['25g Makhana', '60g Sprouted Moong', 'Lemon juice & Chaat Masala'],
          recipe: 'Dry roast Makhana in pan until crisp. Toss with sprouted moong, diced cucumber, lemon juice, and chaat masala.'
        }
      ]
    },

    asian: {
      b: [
        {
          id: 'asia-b1',
          mealType: 'breakfast',
          name: 'Korean Steamed Egg Pot (Gyeran-찜) & Kimchi Toast',
          cuisine: 'asian',
          calories: Math.round(targetCal * 0.24),
          proteinG: Math.round(targetProt * 0.28),
          carbsG: Math.round(targetCarb * 0.2),
          fatG: Math.round(targetFat * 0.24),
          prepTimeMinutes: 10,
          glycemicIndex: 'low',
          description: 'Silken Korean dashi steamed egg soufflé served with probiotic kimchi on toasted sourdough.',
          ingredients: ['3 Eggs', '100ml Dashi Broth', '40g Kimchi', '1 slice Sourdough Toast'],
          recipe: 'Whisk eggs with dashi broth and scallions. Steam over medium heat for 8 mins until soufflé puffs. Serve with spicy probiotic kimchi.'
        }
      ],
      l: [
        {
          id: 'asia-l1',
          mealType: 'lunch',
          name: 'Teriyaki Chicken breast & Edamame Soba Noodles',
          cuisine: 'asian',
          calories: Math.round(targetCal * 0.34),
          proteinG: Math.round(targetProt * 0.36),
          carbsG: Math.round(targetCarb * 0.35),
          fatG: Math.round(targetFat * 0.2),
          prepTimeMinutes: 18,
          glycemicIndex: 'low',
          description: 'Glueless 100% buckwheat Soba noodles tossed with grilled teriyaki chicken breast, edamame, and sesame seeds.',
          ingredients: ['200g Chicken Breast', '70g Buckwheat Soba (dry)', '50g Edamame', 'Low-sodium Teriyaki Sauce'],
          recipe: 'Boil buckwheat soba noodles for 5 mins. Pan-fry sliced chicken breast with teriyaki sauce and toss together with shelled edamame.'
        }
      ],
      d: [
        {
          id: 'asia-d1',
          mealType: 'dinner',
          name: 'Miso Glazed Wild Cod & Stir-fry Bok Choy',
          cuisine: 'asian',
          calories: Math.round(targetCal * 0.28),
          proteinG: Math.round(targetProt * 0.32),
          carbsG: Math.round(targetCarb * 0.22),
          fatG: Math.round(targetFat * 0.22),
          prepTimeMinutes: 15,
          glycemicIndex: 'low',
          description: 'Flaky cod fillet brushed with sweet red miso glaze, served alongside garlic wok-tossed baby bok choy and shiitake mushrooms.',
          ingredients: ['190g Wild Cod Fillet', '1 tbsp Red Miso Paste', '150g Baby Bok Choy', '50g Shiitake Mushrooms'],
          recipe: 'Brush cod with miso, mirin, and soy sauce. Broil in oven for 8 mins. Flash wok stir-fry bok choy and shiitake with garlic and sesame oil.'
        }
      ],
      s: [
        {
          id: 'asia-s1',
          mealType: 'snack',
          name: 'Steamed Spicy Garlic Sea Salt Edamame',
          cuisine: 'asian',
          calories: Math.round(targetCal * 0.14),
          proteinG: Math.round(targetProt * 0.15),
          carbsG: Math.round(targetCarb * 0.1),
          fatG: Math.round(targetFat * 0.1),
          prepTimeMinutes: 5,
          glycemicIndex: 'low',
          description: 'Warm steamed edamame pods tossed in chili oil, garlic, and coarse sea salt.',
          ingredients: ['160g Edamame Pods', '1 tsp Chili Garlic Oil', 'Sea Salt'],
          recipe: 'Steam edamame pods for 4 mins. Drain and toss with chili garlic oil and coarse sea salt.'
        }
      ]
    },

    mediterranean: {
      b: [
        {
          id: 'med-b1',
          mealType: 'breakfast',
          name: 'Greek Shakshuka with Crumbled Feta & Olive Toast',
          cuisine: 'mediterranean',
          calories: Math.round(targetCal * 0.25),
          proteinG: Math.round(targetProt * 0.26),
          carbsG: Math.round(targetCarb * 0.24),
          fatG: Math.round(targetFat * 0.26),
          prepTimeMinutes: 15,
          glycemicIndex: 'low',
          description: 'Eggs poached in rich spiced tomato and red pepper reduction, topped with creamy sheep feta cheese.',
          ingredients: ['2 Eggs', '150g Diced Tomatoes', '1/2 Red Bell Pepper', '25g Feta Cheese', '1 slice Whole Grain Toast'],
          recipe: 'Simmer peppers and tomatoes with garlic and oregano. Crack eggs into wells, cover pan for 5 mins. Top with crumbled feta.'
        }
      ],
      l: [
        {
          id: 'med-l1',
          mealType: 'lunch',
          name: 'Mediterranean Grilled Salmon & Lemon Chickpea Grain Bowl',
          cuisine: 'mediterranean',
          calories: Math.round(targetCal * 0.33),
          proteinG: Math.round(targetProt * 0.34),
          carbsG: Math.round(targetCarb * 0.3),
          fatG: Math.round(targetFat * 0.3),
          prepTimeMinutes: 20,
          glycemicIndex: 'low',
          description: 'Wild salmon fillet rich in omega-3s served over marinated lemon chickpeas, cucumbers, and kalamata olives.',
          ingredients: ['180g Salmon Fillet', '100g Chickpeas', '30g Kalamata Olives', '1 tbsp Extra Virgin Olive Oil'],
          recipe: 'Sear salmon skin-side down for 4 mins, flip for 3 mins. Combine chickpeas, cucumber, olives, and extra virgin olive oil.'
        }
      ],
      d: [
        {
          id: 'med-d1',
          mealType: 'dinner',
          name: 'Herbed Greek Chicken Souvlaki & Quinoa Tzatziki',
          cuisine: 'mediterranean',
          calories: Math.round(targetCal * 0.28),
          proteinG: Math.round(targetProt * 0.32),
          carbsG: Math.round(targetCarb * 0.28),
          fatG: Math.round(targetFat * 0.24),
          prepTimeMinutes: 20,
          glycemicIndex: 'low',
          description: 'Oregano lemon marinated chicken breast skewers served over warm fluffy quinoa and homemade cucumber tzatziki.',
          ingredients: ['200g Chicken Breast', '80g Quinoa (cooked)', '3 tbsp Greek Yogurt Tzatziki', '1/2 Cucumber'],
          recipe: 'Grill lemon oregano chicken skewers for 10 mins. Serve over cooked quinoa with cucumber tzatziki sauce.'
        }
      ],
      s: [
        {
          id: 'med-s1',
          mealType: 'snack',
          name: 'Greek Yogurt, Walnuts & Organic Honey Cup',
          cuisine: 'mediterranean',
          calories: Math.round(targetCal * 0.14),
          proteinG: Math.round(targetProt * 0.15),
          carbsG: Math.round(targetCarb * 0.12),
          fatG: Math.round(targetFat * 0.18),
          prepTimeMinutes: 2,
          glycemicIndex: 'low',
          description: 'Strained 0% Greek yogurt layered with raw English walnuts and organic wildflower honey.',
          ingredients: ['180g Greek Yogurt', '20g Raw Walnuts', '10g Wildflower Honey'],
          recipe: 'Spoon Greek yogurt into bowl. Top with crushed walnuts and drizzle organic wildflower honey.'
        }
      ]
    },

    mexican: {
      b: [
        {
          id: 'mex-b1',
          mealType: 'breakfast',
          name: 'High-Protein Huevos Rancheros Bowl',
          cuisine: 'mexican',
          calories: Math.round(targetCal * 0.26),
          proteinG: Math.round(targetProt * 0.28),
          carbsG: Math.round(targetCarb * 0.24),
          fatG: Math.round(targetFat * 0.26),
          prepTimeMinutes: 12,
          glycemicIndex: 'low',
          description: 'Crisp corn tortilla layered with warm black beans, 2 sunny-side eggs, fresh pico de gallo, and avocado.',
          ingredients: ['2 Eggs', '80g Black Beans', '1 Corn Tortilla', '40g Fresh Salsa', '1/4 Hass Avocado'],
          recipe: 'Warm black beans with cumin. Fry eggs over easy. Layer tortilla with beans, eggs, fresh pico de gallo, and avocado slices.'
        }
      ],
      l: [
        {
          id: 'mex-l1',
          mealType: 'lunch',
          name: 'Carne Asada Steak & Brown Rice Burrito Bowl',
          cuisine: 'mexican',
          calories: Math.round(targetCal * 0.35),
          proteinG: Math.round(targetProt * 0.38),
          carbsG: Math.round(targetCarb * 0.32),
          fatG: Math.round(targetFat * 0.28),
          prepTimeMinutes: 20,
          glycemicIndex: 'low',
          description: 'Flank steak marinated in lime and cilantro, served with brown rice, pinto beans, grilled fajita peppers, and salsa verde.',
          ingredients: ['190g Flank Steak', '100g Brown Rice (cooked)', '60g Pinto Beans', 'Fajita Peppers & Salsa'],
          recipe: 'Sear flank steak over high heat for 3 mins per side. Slice against grain and serve over rice, beans, and sauteed peppers.'
        }
      ],
      d: [
        {
          id: 'mex-d1',
          mealType: 'dinner',
          name: 'Grilled Shrimp Tacos with Spicy Cabbage Slaw',
          cuisine: 'mexican',
          calories: Math.round(targetCal * 0.26),
          proteinG: Math.round(targetProt * 0.28),
          carbsG: Math.round(targetCarb * 0.24),
          fatG: Math.round(targetFat * 0.22),
          prepTimeMinutes: 15,
          glycemicIndex: 'low',
          description: 'Chili-lime seasoned wild shrimp stuffed into warm corn tortillas with lime-zested purple cabbage slaw.',
          ingredients: ['180g Wild Jumbo Shrimp', '2 Corn Tortillas', '80g Purple Cabbage Slaw', 'Lime & Cilantro'],
          recipe: 'Sauté spiced shrimp for 3 mins. Warm corn tortillas and stuff with shrimp, lime cabbage slaw, and fresh cilantro.'
        }
      ],
      s: [
        {
          id: 'mex-s1',
          mealType: 'snack',
          name: 'Chili-Lime Roasted Pumpkin Seeds (Pepitas)',
          cuisine: 'mexican',
          calories: Math.round(targetCal * 0.13),
          proteinG: Math.round(targetProt * 0.12),
          carbsG: Math.round(targetCarb * 0.08),
          fatG: Math.round(targetFat * 0.16),
          prepTimeMinutes: 3,
          glycemicIndex: 'low',
          description: 'Crunchy oven-roasted pumpkin seeds seasoned with Tajin chili-lime seasoning.',
          ingredients: ['30g Raw Pumpkin Seeds', 'Tajin seasoning & Lime zest'],
          recipe: 'Roast pumpkin seeds withTajin seasoning until toasted and fragrant.'
        }
      ]
    },

    western: {
      b: [
        {
          id: 'west-b1',
          mealType: 'breakfast',
          name: 'Egg White & Avocado Protein Power Toast',
          cuisine: 'western',
          calories: Math.round(targetCal * 0.25),
          proteinG: Math.round(targetProt * 0.3),
          carbsG: Math.round(targetCarb * 0.2),
          fatG: Math.round(targetFat * 0.2),
          prepTimeMinutes: 10,
          glycemicIndex: 'low',
          description: 'Whole grain sourdough topped with mashed Hass avocado, red pepper flakes, and 4 scrambled egg whites.',
          ingredients: ['4 Egg Whites', '1 slice Whole Grain Sourdough', '1/2 Hass Avocado', 'Chili Flakes'],
          recipe: 'Toast sourdough bread. Mash avocado with lemon juice. Scramble egg whites and layer on top of toast with chili flakes.'
        }
      ],
      l: [
        {
          id: 'west-l1',
          mealType: 'lunch',
          name: 'Grilled Herb Chicken & Quinoa Energy Bowl',
          cuisine: 'western',
          calories: Math.round(targetCal * 0.34),
          proteinG: Math.round(targetProt * 0.36),
          carbsG: Math.round(targetCarb * 0.34),
          fatG: Math.round(targetFat * 0.24),
          prepTimeMinutes: 18,
          glycemicIndex: 'low',
          description: 'Rosemary garlic seasoned chicken breast grilled to perfection, served with quinoa and steamed broccoli.',
          ingredients: ['200g Chicken Breast', '80g Quinoa (cooked)', '150g Broccoli florets', '1 tsp Olive Oil'],
          recipe: 'Grill seasoned chicken breast for 6 mins per side. Serve over cooked quinoa with steamed broccoli.'
        }
      ],
      d: [
        {
          id: 'west-d1',
          mealType: 'dinner',
          name: 'Sirloin Steak & Roasted Garlic Green Beans',
          cuisine: 'western',
          calories: Math.round(targetCal * 0.28),
          proteinG: Math.round(targetProt * 0.3),
          carbsG: Math.round(targetCarb * 0.2),
          fatG: Math.round(targetFat * 0.32),
          prepTimeMinutes: 20,
          glycemicIndex: 'low',
          description: 'Pan-seared lean sirloin steak with garlic butter, served with crisp green beans and baked sweet potato.',
          ingredients: ['180g Sirloin Steak', '120g Green Beans', '120g Roasted Sweet Potato', '1 clove Garlic'],
          recipe: 'Sear sirloin in skillet with garlic for 3 mins per side. Sauté green beans in remaining pan juices.'
        }
      ],
      s: [
        {
          id: 'west-s1',
          mealType: 'snack',
          name: 'Cottage Cheese & Pineapple Recovery Bowl',
          cuisine: 'western',
          calories: Math.round(targetCal * 0.13),
          proteinG: Math.round(targetProt * 0.15),
          carbsG: Math.round(targetCarb * 0.12),
          fatG: Math.round(targetFat * 0.1),
          prepTimeMinutes: 2,
          glycemicIndex: 'low',
          description: 'Slow-digesting casein protein from low-fat cottage cheese paired with fresh pineapple chunks.',
          ingredients: ['160g Low-fat Cottage Cheese', '80g Pineapple Chunks'],
          recipe: 'Combine cottage cheese and fresh pineapple chunks in a bowl.'
        }
      ]
    },

    all: {
      b: [],
      l: [],
      d: [],
      s: []
    }
  };

  // Populate 'all' by combining database
  cuisineMealDatabase.all.b = [
    ...cuisineMealDatabase.indian.b,
    ...cuisineMealDatabase.asian.b,
    ...cuisineMealDatabase.mediterranean.b,
    ...cuisineMealDatabase.mexican.b,
    ...cuisineMealDatabase.western.b
  ];
  cuisineMealDatabase.all.l = [
    ...cuisineMealDatabase.indian.l,
    ...cuisineMealDatabase.asian.l,
    ...cuisineMealDatabase.mediterranean.l,
    ...cuisineMealDatabase.mexican.l,
    ...cuisineMealDatabase.western.l
  ];
  cuisineMealDatabase.all.d = [
    ...cuisineMealDatabase.indian.d,
    ...cuisineMealDatabase.asian.d,
    ...cuisineMealDatabase.mediterranean.d,
    ...cuisineMealDatabase.mexican.d,
    ...cuisineMealDatabase.western.d
  ];
  cuisineMealDatabase.all.s = [
    ...cuisineMealDatabase.indian.s,
    ...cuisineMealDatabase.asian.s,
    ...cuisineMealDatabase.mediterranean.s,
    ...cuisineMealDatabase.mexican.s,
    ...cuisineMealDatabase.western.s
  ];

  const currentDatabase = (selectedCuisine !== 'all' && cuisineMealDatabase[selectedCuisine]) 
    ? cuisineMealDatabase[selectedCuisine] 
    : cuisineMealDatabase.all;

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const days: DayDietPlan[] = dayNames.map((dayName, idx) => {
    const bMeal = currentDatabase.b[idx % currentDatabase.b.length] || cuisineMealDatabase.western.b[0];
    const lMeal = currentDatabase.l[idx % currentDatabase.l.length] || cuisineMealDatabase.western.l[0];
    const dMeal = currentDatabase.d[idx % currentDatabase.d.length] || cuisineMealDatabase.western.d[0];
    const sMeal = currentDatabase.s[idx % currentDatabase.s.length] || cuisineMealDatabase.western.s[0];

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

  // Categorize grocery list into aisles
  const produceItems = new Set<string>();
  const proteinItems = new Set<string>();
  const pantryItems = new Set<string>();
  const dairyItems = new Set<string>();

  days.forEach(day => {
    day.meals.forEach(m => {
      m.ingredients.forEach(ing => {
        const lower = ing.toLowerCase();
        if (lower.includes('chicken') || lower.includes('steak') || lower.includes('salmon') || lower.includes('tofu') || lower.includes('cod') || lower.includes('shrimp') || lower.includes('beef') || lower.includes('tuna') || lower.includes('egg') || lower.includes('turkey')) {
          proteinItems.add(ing);
        } else if (lower.includes('spinach') || lower.includes('broccoli') || lower.includes('avocado') || lower.includes('tomato') || lower.includes('cucumber') || lower.includes('lettuce') || lower.includes('cabbage') || lower.includes('lemon') || lower.includes('pineapple') || lower.includes('mint') || lower.includes('kale') || lower.includes('mushroom') || lower.includes('pepper') || lower.includes('bok choy')) {
          produceItems.add(ing);
        } else if (lower.includes('paneer') || lower.includes('yogurt') || lower.includes('cheese') || lower.includes('feta') || lower.includes('butter') || lower.includes('cottage')) {
          dairyItems.add(ing);
        } else {
          pantryItems.add(ing);
        }
      });
    });
  });

  const shoppingAisles: GroceryAisle[] = [
    { category: "🥦 Fresh Produce & Green Veggies", items: Array.from(produceItems) },
    { category: "🍗 Meat, Seafood & Lean Proteins", items: Array.from(proteinItems) },
    { category: "🧀 Organic Dairy & Cottage Cheese", items: Array.from(dairyItems) },
    { category: "🌾 Whole Grains, Spices & Pantry", items: Array.from(pantryItems) }
  ];

  return {
    id: `diet-plan-${selectedDiet}-${selectedCuisine}-${profile.goal}`,
    title: `${dietTitles[selectedDiet]} (${selectedCuisine.toUpperCase()})`,
    dietType: selectedDiet,
    cuisine: selectedCuisine,
    description: `Customized 7-day ${selectedCuisine === 'all' ? 'Global' : selectedCuisine.toUpperCase()} culinary protocol calibrated for your ${profile.goal.toUpperCase()} goal (${targetCal} kcal / ${targetProt}g protein). Features instant AI meal swappers and portion scalers.`,
    targetCalories: targetCal,
    targetProtein: targetProt,
    targetCarbs: targetCarb,
    targetFat: targetFat,
    days,
    shoppingAisles
  };
};
