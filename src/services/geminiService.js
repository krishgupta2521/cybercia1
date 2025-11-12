// Gemini API Service

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Generic function to call the Gemini API with retry logic.
 */
export async function callGemini(userQuery, systemPrompt, maxRetries = 3) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please check your .env file.');
  }

  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser Query: ${userQuery}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated from Gemini API');
      }

      const text = data.candidates[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('Invalid response format from Gemini API');
      }

      return text.trim();
      
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error.message);
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError || new Error('Failed to get response from Gemini API after multiple attempts');
}

// AI Assistant Tool Functions
export const geminiTools = {
  /**
   * Tool/Concept Explainer
   */
  async getExplanation(query) {
    const systemPrompt = "You are a friendly, expert cybersecurity tutor. Provide a concise, one-paragraph explanation of the requested cybersecurity tool or concept, suitable for a beginner. Be encouraging.";
    const userQuery = `Explain the cybersecurity concept or tool: ${query}`;
    return await callGemini(userQuery, systemPrompt);
  },

  /**
   * Safe Command Generator
   */
  async generateCommand(query) {
    const systemPrompt = "You are an expert Linux and Python cybersecurity script generator focused on learning. Based on the user's request, provide a single, safe, beginner-level command or a very brief, runnable Python code snippet (max 5 lines) to achieve the goal. ONLY output the code/command, using markdown code blocks. Prioritize safety and ethical use, refusing any dangerous or complex requests.";
    const userQuery = `Generate a safe command or script for: ${query}`;
    return await callGemini(userQuery, systemPrompt);
  },

  /**
   * Vulnerability Explainer
   */
  async getVulnerabilityExplanation(query) {
    const systemPrompt = "You are an expert cybersecurity analyst providing educational information. Analyze the requested vulnerability (e.g., Log4Shell or SQL Injection). Provide the output in three distinct sections: **1. What is it?**, **2. How it works (Exploit)**, and **3. How to Fix it (Defense)**. Keep each section concise and beginner-friendly.";
    const userQuery = `Explain the cybersecurity vulnerability: ${query}`;
    return await callGemini(userQuery, systemPrompt);
  },

  /**
   * Packet Analysis Interpreter
   */
  async interpretPacketAnalysis(query) {
    const systemPrompt = "You are a senior network forensics analyst. Analyze the provided network traffic description. Interpret what attack, communication, or anomaly this traffic represents. Suggest the immediate **Next Investigative Steps** (max 3 bullet points). Output should be formatted with bold titles for: **Traffic Interpretation** and **Next Steps**.";
    const userQuery = `Analyze and interpret this network traffic: ${query}`;
    return await callGemini(userQuery, systemPrompt);
  },

  /**
   * Payload Encoder/Decoder Helper
   */
  async getPayloadEncodingHelp(query) {
    const systemPrompt = "You are an expert security researcher specializing in offensive security and evasion. Explain the requested payload encoding or obfuscation technique. Describe its primary **Purpose in Exploitation** (e.g., avoiding signature detection) and provide a simplified, non-malicious **Example of Concept** (e.g., a simple base64 conversion). Output must be formatted with bold titles.";
    const userQuery = `Explain the payload encoding technique: ${query}`;
    return await callGemini(userQuery, systemPrompt);
  },

  /**
   * Zero-Day Exploit Concept Generator
   */
  async getZeroDayConcept(query) {
    const systemPrompt = "You are an elite, ethical security researcher focused on conceptual zero-day analysis for educational purposes. Based on the target technology provided by the user, you must hypothetically describe a high-level **Vulnerability Mechanism**, its maximum **Conceptual Impact**, and the three most critical **Mitigation Steps** the vendor should take. **NEVER** provide actual code, functional commands, or specific steps that could lead to a working exploit. Focus strictly on conceptual theory and defensive advice. Format the output with bold titles.";
    const userQuery = `Hypothesize a conceptual zero-day vulnerability in the following system: ${query}`;
    return await callGemini(userQuery, systemPrompt);
  }
};