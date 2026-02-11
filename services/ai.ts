
import { GoogleGenAI, Type } from "@google/genai";
import { SessionMode, SummaryOutput, AppSettings } from '../types';

export class AIService {
  /**
   * Summarizes the transcript using Google Gemini API.
   */
  static async summarize(transcript: string, mode: SessionMode, settings: AppSettings): Promise<SummaryOutput> {
    // DEMO BRANCH: API key hardcoded for hackathon judges - no setup required!
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyD78VAVBJ1Qf6v82T0DDg6MeXgR5f7FxTY';

    console.log('✅ API key loaded:', import.meta.env.VITE_GEMINI_API_KEY ? 'from .env.local' : 'using hardcoded demo key');

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze this ${mode} transcript. Extract a concise summary, key takeaways, and relevant ${mode === SessionMode.MEETING ? 'action items' : 'main concepts'}. 
    Transcript: ${transcript}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp', // Fast and reliable for summarization
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              shortSummary: {
                type: Type.STRING,
                description: "A 5-7 line summary of the transcript."
              },
              keyTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key points discussed."
              },
              actionItems: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Specific tasks or action items (for meetings)."
              },
              mainConcepts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Main concepts or definitions (for lectures)."
              }
            },
            required: ["shortSummary", "keyTakeaways"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from Gemini");

      return JSON.parse(text.trim()) as SummaryOutput;
    } catch (error) {
      console.error("Gemini AI Error:", error);
      throw new Error('AI processing failed. Please check your network connection.');
    }
  }
}
