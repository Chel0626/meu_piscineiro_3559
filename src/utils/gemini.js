import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initialize Gemini AI client with API key from environment variables
 */
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default genAI;