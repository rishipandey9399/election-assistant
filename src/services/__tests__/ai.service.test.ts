/* eslint-disable @typescript-eslint/no-require-imports */
import { AIService } from '../ai.service';

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => 'Mock AI Response' },
      }),
    }),
  })),
  HarmCategory: {
    HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
    HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT',
  },
  HarmBlockThreshold: {
    BLOCK_ONLY_HIGH: 'BLOCK_ONLY_HIGH',
  },
}));

describe('AIService', () => {
  it('should generate content using Gemini', async () => {
    const service = new AIService('test-key');
    const result = await service.askAssistant('Hello');
    expect(result).toBe('Mock AI Response');
  });

  it('should handle errors gracefully', async () => {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementationOnce(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn().mockRejectedValue(new Error('AI Error')),
      }),
    }));

    const service = new AIService('test-key');
    await expect(service.askAssistant('Hello')).rejects.toThrow('Failed to generate AI response');
  });
});
