# FoodSafe: Demand Forecasting & Surplus Redistribution 🌍🍲

**SOAIDEATHON-S38 Submission**

FoodSafe is a comprehensive, AI-powered system designed for campuses and hospitality sectors to combat food waste. It intelligently forecasts meal demand, ensures food safety during surplus redistribution, and quantifies environmental and economic savings.

## 🎯 Problem Statement Fulfillment

This project directly addresses the SOAIDEATHON-S38 challenge: **"Food-Service Demand Forecasting and Surplus Redistribution for Campuses and Hospitality"**.

| Requirement | How FoodSafe Solves It |
| :--- | :--- |
| **Forecasts meal demand** (using calendars, weather, attendance, historicals) | Integrates **Google Gemini AI** to analyze complex parameters (rainy days, exam schedules, past consumption) and outputs precise portion predictions. |
| **Recommends preparation quantities** | The AI Forecasting Engine calculates exact raw ingredient requirements (e.g., kg of rice, liters of oil) with an 8% safety buffer. |
| **Safely matches surplus with recipients** | Features an intuitive "Surplus Dispatch" dashboard where verified surplus can be matched and logged to eligible NGOs. |
| **Records storage time & temperature** | The dispatch portal requires the kitchen staff to input holding time (hours) and holding temperature (°C). |
| **Prevents unsafe redistribution** | Built-in **FSSAI Food Safety Guard** strictly blocks any dispatch if food has exceeded the 4-hour holding time or falls within the temperature danger zone (5°C–60°C). |
| **Quantifies food, cost, and carbon savings** | The "Today's Summary" dashboard automatically calculates Portions Saved, Cost Profit/Loss, and Avoided CO₂ emissions (using scientific conversion factors). |

## 🚀 Key Features

*   **Real-time Synchronization:** Built with Supabase Realtime WebSockets. Kitchen prep, active consumption, and NGO dispatch logs sync instantly across all devices.
*   **AI-Powered Predictions:** Offloads complex pattern recognition to Google's Gemini 3.6 Flash model via a secure Node.js/Express backend.
*   **Offline-First Architecture:** Utilizes `localStorage` fallback mechanisms to ensure the kitchen can operate even during internet outages.
*   **FSSAI Compliance:** Hardcoded safety constraints prevent the donation of spoiled or high-risk food.

## 🛠️ Technology Stack

*   **Frontend:** HTML5, Vanilla CSS (Glassmorphism UI), Vanilla JavaScript
*   **Backend:** Node.js, Express.js
*   **AI Engine:** Google Gemini SDK (`@google/genai`)
*   **Database & Real-time:** Supabase (PostgreSQL + Realtime Subscriptions)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/FoodSafe_System_Full.git
   cd FoodSafe_System_Full
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Start the Server:**
   ```bash
   npm start
   ```

5. **Access the App:**
   Open your browser and navigate to `http://localhost:8080/index.html`.

## 📸 Screenshots

*(Add your screenshots here before submitting to the hackathon!)*
- `dashboard.png` - The main overview
- `ai_forecast.png` - The Gemini prediction engine
- `safety_guard.png` - The FSSAI temperature warning

---
*Built with ❤️ for SOAIDEATHON-S38*
