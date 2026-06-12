import { FoodItem, PresetMealDemo } from '../types';

export const COMMON_FOOD_DATABASE: Omit<FoodItem, 'id'>[] = [
  // Proteins
  { name: 'Grilled Chicken Breast', portion: '150g', calories: 248, proteinG: 46, carbsG: 0, fatG: 5, category: 'Protein' },
  { name: 'Pan-Seared Salmon Fillet', portion: '150g', calories: 312, proteinG: 34, carbsG: 0, fatG: 18, category: 'Protein' },
  { name: 'Hard Boiled Egg', portion: '1 large (50g)', calories: 78, proteinG: 6.3, carbsG: 0.6, fatG: 5.3, category: 'Protein' },
  { name: 'Lean Ground Beef (93/7)', portion: '100g', calories: 172, proteinG: 24, carbsG: 0, fatG: 8, category: 'Protein' },
  { name: 'Tofu (Firm)', portion: '100g', calories: 144, proteinG: 16, carbsG: 2.5, fatG: 8.5, category: 'Protein' },
  { name: 'Ribeye Steak (Grilled)', portion: '150g', calories: 435, proteinG: 36, carbsG: 0, fatG: 32, category: 'Protein' },
  { name: 'Shrimp (Cooked)', portion: '100g', calories: 99, proteinG: 24, carbsG: 0.2, fatG: 0.3, category: 'Protein' },
  { name: 'Canned Tuna (In Water)', portion: '1 can (150g)', calories: 132, proteinG: 29, carbsG: 0, fatG: 1.2, category: 'Protein' },
  
  // Grains & Carbs
  { name: 'White Rice (Cooked)', portion: '1 cup (158g)', calories: 205, proteinG: 4.2, carbsG: 44.5, fatG: 0.4, category: 'Grains' },
  { name: 'Brown Rice (Cooked)', portion: '1 cup (195g)', calories: 216, proteinG: 5.0, carbsG: 44.8, fatG: 1.8, category: 'Grains' },
  { name: 'Quinoa (Cooked)', portion: '1 cup (185g)', calories: 222, proteinG: 8.1, carbsG: 39.4, fatG: 3.6, category: 'Grains' },
  { name: 'Whole Wheat Bread', portion: '1 slice (28g)', calories: 69, proteinG: 3.6, carbsG: 12, fatG: 0.9, category: 'Grains' },
  { name: 'White Bread', portion: '1 slice (25g)', calories: 67, proteinG: 1.9, carbsG: 12.7, fatG: 0.8, category: 'Grains' },
  { name: 'Rolled Oats (Cooked)', portion: '1 cup (234g)', calories: 166, proteinG: 5.9, carbsG: 28.1, fatG: 4.0, category: 'Grains' },
  { name: 'Sweet Potato (Baked)', portion: '1 medium (150g)', calories: 135, proteinG: 3.0, carbsG: 31.2, fatG: 0.2, category: 'Grains' },
  { name: 'Spaghetti Pasta (Cooked)', portion: '1 cup (140g)', calories: 220, proteinG: 8.1, carbsG: 43.2, fatG: 1.3, category: 'Grains' },
  
  // Dairy & Alternatives
  { name: 'Greek Yogurt (Plain, Non-Fat)', portion: '1 container (170g)', calories: 100, proteinG: 17.3, carbsG: 6.1, fatG: 0.7, category: 'Dairy' },
  { name: 'Whole Milk', portion: '1 cup (244ml)', calories: 149, proteinG: 7.7, carbsG: 11.7, fatG: 8.0, category: 'Dairy' },
  { name: 'Almond Milk (Unsweetened)', portion: '1 cup (240ml)', calories: 30, proteinG: 1.0, carbsG: 1.0, fatG: 2.5, category: 'Dairy' },
  { name: 'Cheddar Cheese', portion: '1 slice (28g)', calories: 113, proteinG: 7.0, carbsG: 0.4, fatG: 9.3, category: 'Dairy' },
  { name: 'Cottage Cheese (2%)', portion: '1/2 cup (113g)', calories: 92, proteinG: 11.8, carbsG: 4.7, fatG: 2.6, category: 'Dairy' },
  
  // Fruits & Vegetables
  { name: 'Cavendish Banana', portion: '1 medium (118g)', calories: 105, proteinG: 1.3, carbsG: 27, fatG: 0.4, category: 'Fruits' },
  { name: 'Red Apple', portion: '1 medium (182g)', calories: 95, proteinG: 0.5, carbsG: 25.1, fatG: 0.3, category: 'Fruits' },
  { name: 'Avocado (Hass)', portion: '1/2 avocado (75g)', calories: 120, proteinG: 1.5, carbsG: 6.4, fatG: 11.0, category: 'Fruits' },
  { name: 'Blueberries', portion: '1 cup (148g)', calories: 84, proteinG: 1.1, carbsG: 21.5, fatG: 0.5, category: 'Fruits' },
  { name: 'Steamed Broccoli', portion: '1 cup (150g)', calories: 54, proteinG: 3.7, carbsG: 10.6, fatG: 0.6, category: 'Vegetables' },
  { name: 'Baby Spinach', portion: '2 cups (60g)', calories: 14, proteinG: 1.7, carbsG: 2.2, fatG: 0.2, category: 'Vegetables' },
  { name: 'Cherry Tomatoes', portion: '1 cup (149g)', calories: 27, proteinG: 1.3, carbsG: 5.8, fatG: 0.3, category: 'Vegetables' },
  { name: 'Asparagus (Grilled)', portion: '6 spears (100g)', calories: 20, proteinG: 2.2, carbsG: 3.9, fatG: 0.2, category: 'Vegetables' },
  
  // Snacks, Seeds & Oil
  { name: 'Mixed Nuts', portion: '1oz (28g)', calories: 172, proteinG: 6.0, carbsG: 6.0, fatG: 15.0, category: 'Snacks' },
  { name: 'Peanut Butter', portion: '2 tbsp (32g)', calories: 188, proteinG: 8.0, carbsG: 6.3, fatG: 16.1, category: 'Snacks' },
  { name: 'Protein Bar (Chocolate)', portion: '1 bar (60g)', calories: 220, proteinG: 20.0, carbsG: 22.0, fatG: 7.0, category: 'Snacks' },
  { name: 'Whey Protein Powder', portion: '1 scoop (30g)', calories: 120, proteinG: 24.0, carbsG: 3.0, fatG: 1.5, category: 'Snacks' },
  { name: 'Olive Oil', portion: '1 tbsp (14g)', calories: 119, proteinG: 0, carbsG: 0, fatG: 13.5, category: 'Snacks' },
  { name: 'Dark Chocolate (70%)', portion: '1 bar cell (15g)', calories: 90, proteinG: 1.2, carbsG: 7.5, fatG: 6.3, category: 'Snacks' },
];

export const PRESET_DEMO_MEALS: PresetMealDemo[] = [
  {
    id: 'pancakes',
    name: 'Pancakes with Berries & Syrup',
    calories: 480,
    proteinG: 12,
    carbsG: 85,
    fatG: 10,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
    items: [
      { name: 'Fluffy Pancakes', portion: '3 medium', calories: 280, proteinG: 7, carbsG: 48, fatG: 6 },
      { name: 'Maple Syrup', portion: '2 tbsp (30ml)', calories: 110, proteinG: 0, carbsG: 28, fatG: 0 },
      { name: 'Mixed Berries', portion: '1/2 cup (75g)', calories: 40, proteinG: 1, carbsG: 9, fatG: 0 },
      { name: 'Salted Butter Pat', portion: '1 tsp (5g)', calories: 50, proteinG: 4, carbsG: 0, fatG: 4 },
    ]
  },
  {
    id: 'caesar_salad',
    name: 'Grilled Chicken Caesar Salad',
    calories: 540,
    proteinG: 42,
    carbsG: 18,
    fatG: 34,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80',
    items: [
      { name: 'Grilled Chicken Breast strips', portion: '120g', calories: 198, proteinG: 36.8, carbsG: 0, fatG: 4 },
      { name: 'Romaine Lettuce', portion: '3 cups (150g)', calories: 24, proteinG: 1.5, carbsG: 4.8, fatG: 0.4 },
      { name: 'Creamy Caesar Dressing', portion: '2 tbsp (30g)', calories: 170, proteinG: 0.5, carbsG: 2.2, fatG: 18 },
      { name: 'Shaved Parmesan Cheese', portion: '2 tbsp (15g)', calories: 60, proteinG: 5.2, carbsG: 1.0, fatG: 4 },
      { name: 'Garlic Croutons', portion: '1/2 cup (15g)', calories: 88, proteinG: 1.0, carbsG: 10, fatG: 3.6 },
    ]
  },
  {
    id: 'beef_burger',
    name: 'Double Cheeseburger & Sweet Potato Fries',
    calories: 890,
    proteinG: 52,
    carbsG: 72,
    fatG: 44,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    items: [
      { name: 'Double Hamburger Bun', portion: '1 set', calories: 210, proteinG: 7, carbsG: 40, fatG: 2.5 },
      { name: 'Lean Beef Patties', portion: '2 patties (150g)', calories: 330, proteinG: 34, carbsG: 0, fatG: 21 },
      { name: 'Cheddar Cheese Melt', portion: '2 slices (40g)', calories: 160, proteinG: 10, carbsG: 0.5, fatG: 13.5 },
      { name: 'Baked Sweet Potato Fries', portion: '100g', calories: 140, proteinG: 1, carbsG: 28, fatG: 3 },
      { name: 'Burger Relish Sauce', portion: '1 tbsp', calories: 50, proteinG: 0, carbsG: 3.5, fatG: 4 },
    ]
  },
  {
    id: 'eggs_benedict',
    name: 'Smoked Salmon Eggs Benedict',
    calories: 590,
    proteinG: 32,
    carbsG: 36,
    fatG: 35,
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600&q=80',
    items: [
      { name: 'English muffin toast halves', portion: '1 whole muffin', calories: 134, proteinG: 5, carbsG: 26, fatG: 1 },
      { name: 'Saucily Poached Eggs', portion: '2 large', calories: 143, proteinG: 12.6, carbsG: 1.2, fatG: 9.9 },
      { name: 'Smoked Salmon Fillet slices', portion: '60g', calories: 85, proteinG: 11, carbsG: 0, fatG: 4.5 },
      { name: 'Hollandaise Cream Sauce', portion: '2 tbsp (30g)', calories: 198, proteinG: 1.4, carbsG: 1.4, fatG: 21.2 },
      { name: 'Fresh Asparagus spears', portion: '4 large spears', calories: 30, proteinG: 2.0, carbsG: 1.4, fatG: 0.4 },
    ]
  },
  {
    id: 'avocado_toast',
    name: 'Classic Poached Egg & Avocado Toast',
    calories: 395,
    proteinG: 14,
    carbsG: 32,
    fatG: 24,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    items: [
      { name: 'Sourdough Bread toasted', portion: '1 thick slice', calories: 130, proteinG: 4.5, carbsG: 25, fatG: 1 },
      { name: 'Fresh Mined Butter Avocado', portion: '1/2 Hass', calories: 120, proteinG: 1.5, carbsG: 6, fatG: 11 },
      { name: 'Poached Egg', portion: '1 large', calories: 72, proteinG: 6.3, carbsG: 0.6, fatG: 5 },
      { name: 'E.V. Olive Oil drizzle', portion: '1/2 tsp', calories: 40, proteinG: 0, carbsG: 0, fatG: 4.5 },
      { name: 'Sesame & Pumpkin Seeds sprinkled', portion: '1 tsp', calories: 33, proteinG: 1.7, carbsG: 0.4, fatG: 2.5 },
    ]
  }
];
