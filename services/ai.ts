
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
      console.log('📡 Calling Gemini API...');
      console.log('Model:', 'gemini-2.0-flash-exp');
      console.log('Transcript length:', transcript.length);

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
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

      console.log('✅ Gemini API response received');
      const text = response.text;
      if (!text) {
        console.error('❌ Empty response from Gemini');
        throw new Error("No response from Gemini");
      }

      console.log('📝 Parsing response...');
      return JSON.parse(text.trim()) as SummaryOutput;
    } catch (error: any) {
      console.error("❌ Gemini AI Error Details:", {
        message: error?.message,
        status: error?.status,
        statusText: error?.statusText,
        error: error
      });

      // More specific error messages
      if (error?.message?.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API key configuration.');
      } else if (error?.message?.includes('quota') || error?.message?.includes('429')) {
        throw new Error('API quota exceeded. Please try again later or check your Gemini API quota.');
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else {
        throw new Error(`AI processing failed: ${error?.message || 'Unknown error'}. Please try again.`);
      }
    }
  }
}
