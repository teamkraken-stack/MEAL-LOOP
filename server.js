require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// API Route for Forecasting
app.post('/api/forecast', async (req, res) => {
    try {
        const { menu, date, mealType, attendance, historical, weather, event } = req.body;

        const systemInstruction = `You are an AI Food Demand Forecasting Expert for a commercial kitchen.
Your goal is to predict the optimal number of meal portions to prepare based on expected attendance, historical consumption, weather, and calendar events.
You MUST output your response ONLY as valid JSON.
The JSON must have the exact following schema:
{
  "recommendedPrep": number, // total recommended portions to prepare (projectedDemand + safetyBuffer)
  "projectedDemand": number, // baseline expected demand
  "safetyBuffer": number, // 8-10% buffer
  "multiplier": number, // the multiplier factor used (1.0 = normal, 1.25 = 25% increase, etc.)
  "multiplier_explanation": string, // short human-readable explanation of why this multiplier was chosen
  "raw_ingredients": {
    "riceKg": string, // e.g., "15.0"
    "dalKg": string, // e.g., "8.0"
    "vegKg": string, // e.g., "12.0"
    "oilL": string, // e.g., "2.5"
    "flourKg": string // e.g., "10.0"
  }
}
Use standard ratios per portion for ingredients: Rice 0.150kg, Dal 0.080kg, Veggies 0.120kg, Oil 0.025L, Flour 0.100kg.
Adjust demand based on weather (e.g. rainy = +5%, snowy = +10%) and events (exam = +15%, special = +25%, holiday = -25%, vacation = -40%).
If attendance is provided, heavily weight it (60%) with historical (40%). Otherwise use whichever is provided.
`;

        const prompt = `
Please forecast the meal demand for the following context:
- Menu: ${menu}
- Date: ${date}
- Meal Type: ${mealType}
- Expected Attendance: ${attendance}
- Historical Consumption (past 3 days average): ${historical}
- Weather: ${weather}
- Calendar Event: ${event}

Calculate the optimal 'recommendedPrep' and 'raw_ingredients'. Return JSON only.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                temperature: 0.2
            }
        });

        const jsonResult = JSON.parse(response.text);
        res.json(jsonResult);

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to generate forecast', details: error.message });
    }
});

// Serve all static files from the current directory
app.use(express.static(__dirname));

// Fallback for 404s
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`FoodSafe API & Server listening on http://localhost:${PORT}`);
});
