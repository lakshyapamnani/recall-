
import Groq from "groq-sdk";
import { SessionMode, SummaryOutput, AppSettings } from '../types';

export class AIService {
  /**
   * Summarizes the transcript using Groq API with Llama model.
   */
  static async summarize(transcript: string, mode: SessionMode, settings: AppSettings): Promise<SummaryOutput> {
    // DEMO BRANCH: API key hardcoded for hackathon judges - no setup required!
    const apiKey = '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';

    console.log('✅ Using Groq API with hardcoded key for demo');

    const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

    const systemPrompt = `You are an AI assistant that analyzes ${mode} transcripts. Extract a concise summary, key takeaways, and ${mode === 'meeting' ? 'action items' : 'main concepts'}.

Return your response as a JSON object with this exact structure:
{
  "shortSummary": "A 5-7 line summary of the transcript",
  "keyTakeaways": ["key point 1", "key point 2", ...],
  "actionItems": ["action 1", "action 2", ...],
  "mainConcepts": ["concept 1", "concept 2", ...]
}`;

    const userPrompt = `Analyze this ${mode} transcript:\n\n${transcript}`;

    try {
      console.log('📡 Calling Groq API...');
      console.log('Model: llama-3.3-70b-versatile');
      console.log('Transcript length:', transcript.length);

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_tokens: 2048,
        response_format: { type: "json_object" }
      });

      console.log('✅ Groq API response received');
      const content = chatCompletion.choices[0]?.message?.content;

      if (!content) {
        console.error('❌ Empty response from Groq');
        throw new Error("No response from Groq API");
      }

      console.log('📝 Parsing response...');
      const result = JSON.parse(content) as SummaryOutput;

      // Ensure required fields exist
      if (!result.shortSummary) result.shortSummary = "Summary not available";
      if (!result.keyTakeaways) result.keyTakeaways = [];
      if (!result.actionItems) result.actionItems = [];
      if (!result.mainConcepts) result.mainConcepts = [];

      return result;
    } catch (error: any) {
      console.error("❌ Groq API Error Details:", {
        message: error?.message,
        status: error?.status,
        error: error
      });

      // More specific error messages
      if (error?.message?.includes('API key') || error?.message?.includes('401')) {
        throw new Error('Invalid API key. Please check your Groq API key configuration.');
      } else if (error?.message?.includes('quota') || error?.message?.includes('429')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else {
        throw new Error(`AI processing failed: ${error?.message || 'Unknown error'}. Please try again.`);
      }
    }
  }
}
