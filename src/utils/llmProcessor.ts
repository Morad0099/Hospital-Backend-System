import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

export const processDoctorNote = async (note: string) => {
  try {
    const prompt = `Analyze the following doctor note and extract actionable steps:\n\n${note}\n\nReturn a JSON object with:\n- "checklist": a list of immediate actions (e.g., "Buy medication")\n- "plan": a structured schedule (e.g., {"task": "Take medication", "repeat": "daily", "duration": "7 days"})`;

    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract response text
    let resultText = response.data.candidates[0].content.parts[0].text;

    // Remove markdown-style code block indicators (```json ... ```)
    resultText = resultText.replace(/^```json\n/, "").replace(/\n```$/, "");

    // Convert string to JSON
    return JSON.parse(resultText);
  } catch (error: any) {
    console.error(
      "Error processing doctor note:",
      error.response?.data || error.message
    );
    return null;
  }
};
