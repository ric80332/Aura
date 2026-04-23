import { GoogleGenAI } from '@google/genai';
import { Strategy, MarketState } from '../types';

export class AIService {
  private static ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  private static model = 'gemini-3-flash-preview';

  static async analyzeMarket(marketState: MarketState): Promise<string> {
    try {
      const historySummary = marketState.history
        .slice(-10)
        .map(h => `$${h.price.toFixed(2)}`)
        .join(', ');

      const prompt = `
        You are a high-frequency crypto trading expert AI. 
        Analyze the following market data for ${marketState.symbol}:
        Current Price: $${marketState.currentPrice.toFixed(2)}
        24h Change: ${marketState.change24h.toFixed(2)}%
        Recent Price History: ${historySummary}

        Provide a concise, professional market analysis (max 3 sentences) and a suggested trading posture (Aggressive Buy, Neutral, or Cautionary Sell).
      `;

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
      });

      return response.text || "Unable to generate analysis at this time.";
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return "The AI analyst is currently offline. Market volatility may affect performance.";
    }
  }

  static async suggestStrategy(userGoal: string): Promise<Partial<Strategy>> {
    try {
      const prompt = `
        A user wants a trading strategy for: "${userGoal}".
        Suggest a crypto strategy name and a few technical rules. 
        Rules should involve metrics like PRICE, RSI, SMA, or EMA.
        Return as JSON with keys: "name", "description", "suggestedRules": [{ metric, condition, value, action }].
        Conditions: ABOVE, BELOW, CROSS_UP, CROSS_DOWN.
        Actions: BUY, SELL.
      `;

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("AI Strategy Error:", error);
      return {};
    }
  }
}
