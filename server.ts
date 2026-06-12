import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Load environment variables from .env
dotenv.config();

// Pre-import preset database for quick mock or fallback resolution
import { PRESET_DEMO_MEALS, COMMON_FOOD_DATABASE } from "./src/data/foodDatabase.js";

async function generateGeminiContentWithRetry(
  ai: any,
  params: any,
  modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-3.5-flash"]
): Promise<any> {
  let lastError = null;

  for (const model of modelsToTry) {
    let attempts = 3;
    let delay = 1000; // 1 second start delay

    while (attempts > 0) {
      try {
        console.log(`Calling Gemini model: ${model} (attempts left: ${attempts})...`);
        const response = await ai.models.generateContent({
          ...params,
          model: model,
        });
        if (response) {
          return response;
        }
        throw new Error("Empty response received from Gemini API.");
      } catch (err: any) {
        lastError = err;
        console.warn(`Error calling model ${model}:`, err.message || err);

        // If it's a 503 or 429, retry with backoff
        const isTemporary = err.status === "UNAVAILABLE" ||
          err.code === 503 ||
          err.status === "RESOURCE_EXHAUSTED" ||
          err.code === 429 ||
          err.status === 503 ||
          (err.message && (
            err.message.includes("503") ||
            err.message.includes("demand") ||
            err.message.includes("RESOURCE_EXHAUSTED") ||
            err.message.includes("UNAVAILABLE")
          ));

        if (isTemporary && attempts > 1) {
          console.log(`Temporary error. Retrying model ${model} in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
          attempts--;
        } else {
          // If not temporary or we ran out of attempts, break and try the next model
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content after trying all fallback models.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests with size limits for photos
  app.use(express.json({ limit: "15mb" }));

  // API endpoint for health check
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", time: new Date() });
  });

  // API endpoint for sending OTP to registered user's email
  app.post("/api/send-otp", async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, name, otp } = req.body;
      if (!email || !otp) {
        res.status(400).json({ error: "Email and OTP code are required parameters." });
        return;
      }

      const emailUser = process.env.EMAIL_USER;
      const emailPass = process.env.EMAIL_PASS;

      if (!emailUser || !emailPass) {
        console.log(`\n========================================\n[OTP SIMULATION SERVICE]\nSent OTP [${otp}] to ${name || 'User'} (${email})\n========================================\n`);
        res.json({
          success: true,
          simulated: true,
          message: "OTP sent successfully in simulation mode."
        });
        return;
      }

      // Real email transport
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });

      const mailOptions = {
        from: `"CalTrack AI Security" <${emailUser}>`,
        to: email,
        subject: `Your CalTrack AI Login OTP: ${otp}`,
        text: `Hello ${name || 'User'},\n\nYour One-Time Password (OTP) for logging into CalTrack AI is: ${otp}\n\nThis OTP is valid for 5 minutes. If you did not initiate this login request, please ignore this email.\n\nBest regards,\nCalTrack AI Team`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0c0c0c; color: #ffffff; padding: 40px 20px; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid #222;">
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #ff6b6b;">CALTRACK <span style="font-size: 14px; background-color: rgba(255,107,107,0.15); border: 1px solid rgba(255,107,107,0.25); padding: 2px 8px; border-radius: 99px;">AI</span></span>
            </div>
            <div style="background-color: #141414; padding: 30px; border-radius: 12px; border: 1px solid #333;">
              <h2 style="margin-top: 0; font-size: 18px; font-weight: bold; color: #ffffff;">Verify Your Identity ✦</h2>
              <p style="font-size: 14px; color: #a3a3a3; line-height: 1.6;">Hello ${name || 'User'},</p>
              <p style="font-size: 14px; color: #a3a3a3; line-height: 1.6;">Use the following One-Time Password (OTP) to complete your login session. This code is active for 5 minutes:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 6px; color: #ff6b6b; padding: 12px 24px; background-color: #000; border: 1px solid #ff6b6b; border-radius: 8px; display: inline-block;">${otp}</span>
              </div>
              <p style="font-size: 12px; color: #666; line-height: 1.5; margin-bottom: 0;">If you did not request this OTP, you can safely ignore this email.</p>
            </div>
            <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #444;">
              CalTrack AI Applet · Sandbox Secure · Gmail OTP Delivery
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`[OTP SERVICE] Real OTP email successfully dispatched to ${email}`);

      res.json({
        success: true,
        simulated: false,
        message: "OTP sent successfully via Gmail."
      });

    } catch (err: any) {
      console.error("OTP Mailer Error:", err);
      res.status(500).json({
        success: false,
        error: "Failed to dispatch OTP email: " + (err.message || err.toString())
      });
    }
  });

  // API endpoint for retrieving preseeded database
  app.get("/api/foods-db", (req: Request, res: Response) => {
    res.json(COMMON_FOOD_DATABASE);
  });

  // API endpoint for analyzing food photo
  app.post("/api/analyze-food", async (req: Request, res: Response): Promise<void> => {
    try {
      const { imageBase64, mimeType, presetId } = req.body;

      // 1. Resolve preset instantly if requested (no OpenAI or Gemini API required for presets)
      if (presetId) {
        const foundPreset = PRESET_DEMO_MEALS.find(p => p.id === presetId);
        if (foundPreset) {
          const mappedItems = foundPreset.items.map(item => ({
            name: item.name,
            portion: item.portion,
            calories: item.calories,
            proteinG: item.proteinG,
            carbsG: item.carbsG,
            fatG: item.fatG,
            confidence: 0.98,
          }));

          res.json({
            success: true,
            isDemoMode: false,
            mealName: foundPreset.name,
            items: mappedItems,
            totalCalories: foundPreset.calories,
            totalProtein: foundPreset.proteinG,
            totalCarbs: foundPreset.carbsG,
            totalFat: foundPreset.fatG,
            nutritionalRating: "A",
            tips: "Excellent balanced meal containing high-quality proteins and healthy fiber. Great for muscle repair and continuous energy release.",
          });
          return;
        }
      }

      // 2. Validate incoming image input if not a preset
      if (!imageBase64) {
        res.status(400).json({ error: "Missing imageBase64 data in request body." });
        return;
      }

      const activeMimeType = mimeType || "image/jpeg";
      const key = process.env.GEMINI_API_KEY;

      // 3. Graceful fallback if no Gemini key is set in AI Studio Secrets
      if (!key || key === "MY_GEMINI_API_KEY" || key === "") {
        console.warn("GEMINI_API_KEY is not configured or placeholder detected. Falling back to Simulated AI Analysis.");

        // Let's create a smart simulation that parses any photo and returns a delightful, balanced healthy food breakdown
        // so that the user can explore the features of the Calorie Tracker completely!
        const simulatedItems = [
          { name: "Sautéed chicken tenderloins", portion: "120g", calories: 195, proteinG: 26, carbsG: 0, fatG: 4.2, confidence: 0.88 },
          { name: "Avocado wedges", portion: "1/2 piece", calories: 120, proteinG: 1.5, carbsG: 6, fatG: 11, confidence: 0.92 },
          { name: "Brown rice with sesame seeds", portion: "1/2 cup cooked", calories: 108, proteinG: 2.5, carbsG: 22, fatG: 1.0, confidence: 0.85 },
          { name: "Mixed garden salad greens", portion: "1 bowl", calories: 15, proteinG: 0.8, carbsG: 2.8, fatG: 0.1, confidence: 0.94 }
        ];

        const totalCalories = simulatedItems.reduce((acc, item) => acc + item.calories, 0);
        const totalProtein = Number(simulatedItems.reduce((acc, item) => acc + item.proteinG, 0).toFixed(1));
        const totalCarbs = Number(simulatedItems.reduce((acc, item) => acc + item.carbsG, 0).toFixed(1));
        const totalFat = Number(simulatedItems.reduce((acc, item) => acc + item.fatG, 0).toFixed(1));

        res.json({
          success: true,
          isDemoMode: true,
          mealName: "Delicious Macro Power Bowl",
          items: simulatedItems,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          nutritionalRating: "A-",
          tips: "Running mock analysis. Please set your actual GEMINI_API_KEY in the Settings > Secrets configuration panel to enable live visual food recognition on any custom food photo. This simulated meal is rich in high-quality lean protein, unsaturated healthy fats, and energetic slow-acting carbohydrates.",
        });
        return;
      }

      // 4. Initialize GoogleGenAI SDK lazily as per instruction
      console.log("Configuring GoogleGenAI with live API key...");
      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Construct visual contents blocks
      const imagePart = {
        inlineData: {
          mimeType: activeMimeType,
          data: imageBase64,
        },
      };

      const promptPart = {
        text: "Analyze this image of a meal in detail. Identify every distinct food ingredient and item. For each food item, provide estimated calories (kcal), protein (grams), carbs (grams), fat (grams), serving portion description (e.g. '150g', '1 cup cooked', '2 medium slices'), and your identification confidence score (0.0 to 1.0). Also suggest a combined name for this meal, give a letter grade nutritional rating (from A+ to F), and write a concise, human-styled nutritional tip for the user. Return your breakdown in valid JSON matching the schema.",
      };

      const finalSchema = {
        type: Type.OBJECT,
        properties: {
          mealName: {
            type: Type.STRING,
            description: "A combined descriptive name for the overall meal plate, e.g. 'Pesto Pasta with Grilled Salmon'.",
          },
          items: {
            type: Type.ARRAY,
            description: "The list of distinct food items detected on the plate.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Common name of the specific food item, e.g. 'Grilled Salmon'." },
                portion: { type: Type.STRING, description: "Estimated portion description, e.g. '120g' or '1 cup cooked'." },
                calories: { type: Type.INTEGER, description: "Calorie value in kcal." },
                proteinG: { type: Type.NUMBER, description: "Protein content in grams." },
                carbsG: { type: Type.NUMBER, description: "Carbohydrates content in grams." },
                fatG: { type: Type.NUMBER, description: "Fat content in grams." },
                confidence: { type: Type.NUMBER, description: "Confidence score in estimating this food, between 0.0 and 1.0." },
              },
              required: ["name", "portion", "calories", "proteinG", "carbsG", "fatG", "confidence"],
            },
          },
          totalCalories: { type: Type.INTEGER, description: "Sum of calories of all items." },
          totalProtein: { type: Type.NUMBER, description: "Sum of protein in grams." },
          totalCarbs: { type: Type.NUMBER, description: "Sum of carbs in grams." },
          totalFat: { type: Type.NUMBER, description: "Sum of fats in grams." },
          nutritionalRating: { type: Type.STRING, description: "A nutritional grade, e.g. 'A', 'B+', 'C-' based on nutrient density." },
          tips: { type: Type.STRING, description: "A friendly, conversational, realistic calorie/dietary advisory tip for the user." },
        },
        required: ["mealName", "items", "totalCalories", "totalProtein", "totalCarbs", "totalFat", "nutritionalRating", "tips"],
      };

      console.log("Calling Gemini vision model with retry and fallback...");
      const response = await generateGeminiContentWithRetry(ai, {
        contents: { parts: [imagePart, promptPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: finalSchema,
          systemInstruction: "You are CalTrack AI, a professional dietary tracking assistant and nutritionist. Your task is to extract food quantities from visual plates, calculate their exact energy values and macronutrients, and compile them into a neat structured format. Be precise, encouraging, and accurate.",
          temperature: 0.2,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini API.");
      }

      console.log("Gemini API Response parsed successfully.");
      const parsedData = JSON.parse(responseText.trim());

      res.json({
        success: true,
        isDemoMode: false,
        ...parsedData,
      });

    } catch (error: any) {
      console.error("Gemini Food Analysis Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "An error occurred while calling the Gemini API.",
        details: error.toString(),
      });
    }
  });

  // Setup Vite Dev Server / Static Asset pipeline
  if (process.env.NODE_ENV !== "production") {
    console.log("Running in DEVELOPMENT mode with dynamic Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Use Vite middlewares to serve client files
    app.use(vite.middlewares);
  } else {
    console.log("Running in PRODUCTION mode with compiled asset serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Launch Server (with self-healing fallback if port is already running/occupied)
  const initialPort = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  function startListening(port: number) {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`Server running successfully on port ${port}`);
      console.log(`Open health check at http://localhost:${port}`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`[PORT CONFLICT] Port ${port} is occupied. Attempting port ${port + 1} instead...`);
        startListening(port + 1);
      } else {
        console.error("Server startup error:", err);
      }
    });
  }

  startListening(initialPort);
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
