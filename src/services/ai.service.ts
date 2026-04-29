import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

import { AI_MODELS } from '@/lib/constants';
import { env } from '@/lib/env';
import logger from '@/lib/logger';

/**
 * AIService handles all interactions with Google Gemini.
 * It encapsulates prompt engineering, safety settings, and model configuration.
 */
export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

  constructor(apiKey: string = env.GEMINI_API_KEY) {
    this.genAI = new GoogleGenerativeAI(apiKey);

    this.model = this.genAI.getGenerativeModel({
      model: AI_MODELS.PRIMARY_ASSISTANT,
      systemInstruction: `You are a helpful, non-partisan AI Election Assistant. 
      Your goal is to help users understand the voting process, registration deadlines, and how to vote. 
      Provide concise, accurate information. If you don't know something, advise them to check their 
      local election office website. Avoid expressing personal opinions or partisan bias.`,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
      generationConfig: {
        temperature: 0.3, // Lower temperature for more factual responses
        maxOutputTokens: 1000,
      },
    });
  }

  /**
   * Generates a non-partisan response to a user's election-related question.
   *
   * @param message The user's question.
   * @returns A promise that resolves to the AI-generated response.
   */
  async askAssistant(message: string): Promise<string> {
    try {
      const result = await this.model.generateContent(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      logger.error({ err: error }, 'AIService.askAssistant Error');
      throw new Error(
        'Failed to generate AI response. This might be due to safety filters or connection issues.'
      );
    }
  }
}

// Export a singleton factory or instance as needed
export const createAIService = (apiKey?: string) => new AIService(apiKey);
