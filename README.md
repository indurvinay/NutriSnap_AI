# NutriSnap AI ✦ Visional Calorie Sync & Macro Tracker

NutriSnap AI is a modern, premium full-stack health application that transforms how users log their nutrition. Powered by **Google Gemini AI** and backed by **Supabase Cloud Database**, NutriSnap AI allows users to instantly analyze any meal plate, label, or beverage through the camera lens and synchronize metrics securely across devices.

---

## ✦ Core Features

*   **AI Visional Analysis**: Capture or upload photos of meals to identify ingredients, portion sizes, calories, and detailed macronutrients (protein, carbs, fats) with high confidence.
*   **Dynamic Circular Macro Rings**: Beautiful, animated progress indicators showing real-time calorie budgets and macronutrient balance.
*   **Supabase Database Integration**: Real-time cloud synchronization of your calorie logs, meal histories, water logs, streaks, and metabolic targets.
*   **Passwordless OTP Authentication**: Seamless authentication using secure 6-digit numeric verification codes sent directly to Gmail.
*   **Hydration Tracker**: Quick-log buttons for tracking daily water intake (ml) against hydration goals.
*   **Dietary Reflection Chronicles**: Log physical energy, focus, and digestion notes to track how specific macro ratios affect your body over time.
*   **Self-Healing Dev Environment**: Backend Express server dynamically detects port conflicts and runs on the next available port automatically.

---

## 🛠 Tech Stack

*   **Frontend**: React (TypeScript), Vite, Tailwind CSS, Lucide React
*   **Backend**: Node.js, Express, tsx
*   **Database & Storage**: Supabase Database (PostgreSQL), Supabase Storage (Object buckets)
*   **AI Orchestration**: Google GenAI SDK (Gemini 2.5 Flash / 1.5 Flash models)
*   **Authentication**: Supabase Auth (Passwordless OTP / Magic Link email verification)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js (v18+)** installed.

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/nutrisnap-ai.git
cd nutrisnap-ai
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your keys:
```env
# Gemini API Key for visual food recognition
GEMINI_API_KEY="your-gemini-api-key"

# Supabase Configurations
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 3. Run Locally
Start the unified full-stack server (runs on port 3000 by default):
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 📦 Deployment Configuration (Render)

1.  Connect your repository to **[Render](https://render.com)** as a **Web Service**.
2.  Set the **Build Command** to: `npm install && npm run build`
3.  Set the **Start Command** to: `npm run start`
4.  Add your `.env` keys under the **Environment Variables** section in Render.
