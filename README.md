# 🥗 NutriSnap AI ✦ Next-Gen AI Health & Calorie Architecture

> A modern, premium full-stack AI health platform for dynamic nutrition tracking, 3D AR food recognition, continuous glucose spike shielding, voice speech prompt logging, and multi-cuisine diet planning.

---

## 📄 Resume Project Summary (Copy-Paste Ready)

* **Built NutriSnap AI, a full-stack health & macro tracking web platform using React (TypeScript), Vite, Tailwind CSS, Express, and Supabase PostgreSQL with passwordless OTP email authentication.**
* **Integrated Google Gemini AI for 3D AR depth plate scanning, real-time voice speech recognition logging, post-prandial CGM glucose spike prediction, and multi-cuisine 7-day diet generation with dynamic macro-equivalent meal swappers.**

---

## ✨ Key Features

* 🥗 **Step-by-Step Interactive AI Diet Builder**: Build personalized 7-day meal schedules with multi-cuisine preferences (Indian 🇮🇳, Asian 🇯🇵, Mediterranean 🇬🇷, Mexican 🇲🇽, Western 🇺🇸).
* 🔄 **Dynamic AI Meal Swapper**: 1-click meal swapping for any dish with 3 pre-computed macro-equivalent alternatives (matching calories & protein).
* 👩‍🍳 **Interactive Cooking Mode & Portion Scaler**: View recipes with interactive portion scaling (1x Solo, 2x Duo, 4x Family Size) that adjusts ingredient quantities and macros on the fly.
* 🎙️ **AI Voice & Speech Recognition Coach**: Speech recognition & natural language prompt parser (*"Speak What You Ate"*) with 1-click food journal logging.
* 👁️ **AR 3D Depth Lens & Visual Scanner**: Overlays a 3D bounding mesh over food photos to estimate volume in cubic centimeters ($\text{cm}^3$) for 98% gram precision.
* 🩸 **Continuous Glucose Monitor (CGM) Spike Shield**: Predicts post-prandial blood sugar curves and triggers micro-habit walking alerts (*"Take a 10-minute walk to blunt glucose spike by 35%"*).
* 🏋️ **Hypertrophy & Metabolism Matrix**: Carb & Calorie Cycling (Training vs. Rest days) + Micronutrient tracking for Zinc, Magnesium, Vitamin D3, and 30g+ Fiber.
* 👥 **Macro Squad Leagues & Streak Insurance**: 5-person community squads with shared Guild XP and Streak Insurance Tokens to protect 30-day streaks.
* 📅 **Diary Journal & Quick Add Modal**: Instant food logging modal with popular presets (*Eggs & Toast, Chicken Rice Bowl, Paneer Curry, Whey Shake*).
* 🔒 **Passwordless OTP Verification**: Secure 6-digit email OTP verification codes.

---

## 🛠️ Tech Stack

* **Frontend**: React (TypeScript), Vite, Tailwind CSS, Lucide React
* **Backend**: Node.js, Express, tsx
* **Database & Cloud Storage**: Supabase Database (PostgreSQL) & Supabase Storage
* **AI Orchestration**: Google GenAI SDK (Gemini 2.5 Flash / 1.5 Flash)
* **Authentication**: Supabase Auth (Passwordless OTP / Magic Link verification)

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/indurvinay/NutriSnap_AI.git
cd NutriSnap_AI
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
GEMINI_API_KEY="your-gemini-api-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 3. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 📦 Production Build & Deployment

To test compilation and build static production assets:
```bash
npm run lint    # Runs TypeScript type check (tsc --noEmit)
npm run build   # Compiles Vite production bundle & Node backend server
npm run start   # Launches production server
```

---

## 📄 License

MIT License © NutriSnap AI Team.
