import React, { useState } from 'react';
import { FoodItem, MealType } from '../types';
import { COMMON_FOOD_DATABASE } from '../data/foodDatabase';
import { Search, Plus, Sparkles, Filter, ChevronDown, Check, Scale } from 'lucide-react';

interface SearchFoodProps {
  onLogMeal: (mealType: MealType, mealName: string, items: Omit<FoodItem, 'id'>[], totalCalories: number, totalProtein: number, totalCarbs: number, totalFat: number) => void;
  showToast: (msg: string) => void;
}

export function SearchFood({ onLogMeal, showToast }: SearchFoodProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Custom manual logger panel keys
  const [customOpen, setCustomOpen] = useState<boolean>(false);
  const [custName, setCustName] = useState<string>('');
  const [custPortion, setCustPortion] = useState<string>('1 portion');
  const [custCal, setCustCal] = useState<string>('');
  const [custProt, setCustProt] = useState<string>('');
  const [custCarb, setCustCarb] = useState<string>('');
  const [custFat, setCustFat] = useState<string>('');
  const [custSlot, setCustSlot] = useState<MealType>('breakfast');

  // Multiplier / Add parameters for matched items
  const [addingItemIndex, setAddingItemIndex] = useState<number | null>(null);
  const [itemMultiplier, setItemMultiplier] = useState<number>(1);
  const [itemSlot, setItemSlot] = useState<MealType>('breakfast');

  const categories = ['All', 'Protein', 'Grains', 'Dairy', 'Fruits', 'Vegetables', 'Snacks'];

  // Filter items based on criteria
  const matchedFoodDb = COMMON_FOOD_DATABASE.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle logging of preseeded matched items
  const handleLogMatchedClick = (food: Omit<FoodItem, 'id'>) => {
    const mult = Number(itemMultiplier) || 1;
    const finalItem: Omit<FoodItem, 'id'> = {
      name: food.name,
      portion: mult === 1 ? food.portion : `${mult}x ${food.portion}`,
      calories: Math.round(food.calories * mult),
      proteinG: Number((food.proteinG * mult).toFixed(1)),
      carbsG: Number((food.carbsG * mult).toFixed(1)),
      fatG: Number((food.fatG * mult).toFixed(1)),
      category: food.category,
      isCustom: false
    };

    onLogMeal(
      itemSlot,
      food.name,
      [finalItem],
      finalItem.calories,
      finalItem.proteinG,
      finalItem.carbsG,
      finalItem.fatG
    );

    showToast(`Logged ${food.name} to ${itemSlot}!`);
    setAddingItemIndex(null);
    setItemMultiplier(1);
  };

  // Handles logging of raw fully custom input
  const handleLogCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custCal) {
      alert('Please fill out Food Name and Calories.');
      return;
    }

    const item: Omit<FoodItem, 'id'> = {
      name: custName,
      portion: custPortion || '1 serving',
      calories: parseInt(custCal) || 0,
      proteinG: parseFloat(custProt) || 0,
      carbsG: parseFloat(custCarb) || 0,
      fatG: parseFloat(custFat) || 0,
      isCustom: true,
      category: 'Custom'
    };

    onLogMeal(
      custSlot,
      custName,
      [item],
      item.calories,
      item.proteinG,
      item.carbsG,
      item.fatG
    );

    showToast(`Added custom ${custName} to ${custSlot}!`);
    
    // Clear state inputs
    setCustName('');
    setCustPortion('1 portion');
    setCustCal('');
    setCustProt('');
    setCustCarb('');
    setCustFat('');
    setCustomOpen(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 select-none" id="component-searchfood">
      {/* SECTION TITLE */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-rose-500" />
          Search Foods
        </h1>
        <p className="text-sm text-neutral-400 mt-1">Search our preseeded healthy food database or add custom macro components manually.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT TWO COLUMNS: SEARCH ENGINE */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* SEARCH BAR INPUT */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 30+ preseeded healthy ingredients..."
              className="w-full bg-[#141414] border border-neutral-800 text-white rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-rose-500 transition-all placeholder:text-neutral-500"
            />
            <Search className="absolute left-4 top-4.5 text-neutral-500 w-5 h-5" />
          </div>

          {/* FILTER CHIPS ROW */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                    : 'bg-[#141414] border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SEARCH LIST MATCHES */}
          <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 space-y-4 min-h-[300px]">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Matched Database Items ({matchedFoodDb.length})</h3>
            
            {matchedFoodDb.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500 space-y-2">
                <Filter className="w-8 h-8 opacity-45" />
                <p className="text-sm font-bold">No results found for "{searchQuery}"</p>
                <p className="text-xs text-neutral-600">Try modifying your text query or switching your category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {matchedFoodDb.map((food, idx) => {
                  const isAdding = addingItemIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 hover:border-neutral-800 transition-all space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-extrabold text-sm text-white">{food.name}</h4>
                          <span className="text-[10px] text-neutral-500 mt-0.5 block">
                            Portion: <span className="font-bold text-neutral-400">{food.portion}</span> · {food.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold font-mono text-rose-400">{food.calories} kcal</span>
                          
                          <button
                            onClick={() => {
                              setAddingItemIndex(isAdding ? null : idx);
                              setItemMultiplier(1);
                            }}
                            className={`p-2 rounded-xl border transition-all ${
                              isAdding 
                                ? 'bg-neutral-800 border-neutral-700 text-white' 
                                : 'bg-rose-500 text-white hover:bg-rose-600 border-none'
                            }`}
                          >
                            {isAdding ? <ChevronDown className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanding configure multiplier drawer */}
                      {isAdding && (
                        <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 space-y-4 animate-fadeIn">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1.5">
                                Serving portion multiplier
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="range"
                                  min="0.5"
                                  max="3"
                                  step="0.5"
                                  value={itemMultiplier}
                                  onChange={(e) => setItemMultiplier(parseFloat(e.target.value))}
                                  className="accent-rose-500 flex-1"
                                />
                                <span className="text-xs font-extrabold text-white w-10 text-right font-mono">
                                  {itemMultiplier}x
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1.5">
                                Log targets slot
                              </label>
                              <div className="grid grid-cols-4 gap-1.5 bg-neutral-950 p-1 rounded-lg">
                                {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((slot) => (
                                  <button
                                    key={slot}
                                    onClick={() => setItemSlot(slot)}
                                    className={`py-1 text-[10px] font-bold rounded capitalize transition-all ${
                                      itemSlot === slot
                                        ? 'bg-rose-500 text-white shadow'
                                        : 'text-neutral-400 hover:text-white'
                                    }`}
                                  >
                                    {slot === 'breakfast' ? 'Bf' : slot === 'lunch' ? 'Lh' : slot === 'dinner' ? 'Dn' : 'Sk'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center border-t border-neutral-800/80 pt-3">
                            <div className="text-[10px] text-neutral-400 font-mono">
                              Total sum: <span className="text-white font-bold">{Math.round(food.calories * itemMultiplier)} kcal</span> · 
                              P: <span className="text-blue-400">{(food.proteinG * itemMultiplier).toFixed(1)}g</span> · 
                              C: <span className="text-amber-400">{(food.carbsG * itemMultiplier).toFixed(1)}g</span>
                            </div>

                            <button
                              onClick={() => handleLogMatchedClick(food)}
                              className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 flex items-center gap-1.5 shadow"
                            >
                              <Check className="w-3.5 h-3.5" /> Log Food
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REUSABLE CUSTOM DIARY FORM ADDITION */}
        <div className="space-y-6">
          <div className="bg-[#141414] rounded-2xl border border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-500/10 pb-3">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-rose-500" />
                Add Custom Food
              </h3>
            </div>
            
            <p className="text-xs text-neutral-400 leading-relaxed">
              Have a packaged snack or custom home recipe that's not in the AI scan database? Key in the metrics manually here.
            </p>

            <form onSubmit={handleLogCustomSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Food Name *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. My Vanilla Protein Oats"
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 placeholder:text-neutral-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Portion</label>
                  <input
                    type="text"
                    value={custPortion}
                    onChange={(e) => setCustPortion(e.target.value)}
                    placeholder="e.g. 1 bowl"
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 placeholder:text-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Calories (kcal) *</label>
                  <input
                    type="number"
                    required
                    value={custCal}
                    onChange={(e) => setCustCal(e.target.value)}
                    placeholder="e.g. 350"
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 placeholder:text-neutral-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <label className="block text-[9px] font-bold text-blue-400 uppercase tracking-wider mb-1 text-center">Protein(g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={custProt}
                    onChange={(e) => setCustProt(e.target.value)}
                    placeholder="0"
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-2 py-2 text-center focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-amber-400 uppercase tracking-wider mb-1 text-center font-medium">Carbs(g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={custCarb}
                    onChange={(e) => setCustCarb(e.target.value)}
                    placeholder="0"
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-2 py-2 text-center focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-red-400 uppercase tracking-wider mb-1 text-center">Fat(g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={custFat}
                    onChange={(e) => setCustFat(e.target.value)}
                    placeholder="0"
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-2 py-2 text-center focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Meal Slot</label>
                <div className="grid grid-cols-4 gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-900">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setCustSlot(slot)}
                      className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        custSlot === slot
                          ? 'bg-rose-500/15 border border-rose-500/20 text-rose-400'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {slot === 'breakfast' ? 'Breakfast' : slot === 'lunch' ? 'Lunch' : slot === 'dinner' ? 'Dinner' : 'Snack'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-rose-500/10 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Log Custom Meal
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
