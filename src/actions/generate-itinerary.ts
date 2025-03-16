"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createTravelItineraryPrompt } from "@/lib/templates/travel-itinerary";

const API_KEY = process.env.GEMINI_API_KEY;

export async function generateItinerary(params: {
  destination: string;
  days: number;
  people: string;
  budget: string;
  interests: string[];
}) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = createTravelItineraryPrompt(params);

    const result = await model.generateContent(prompt);

    const responseText = result.response.text().trim();

    const cleanedText = responseText.replace(/^```json\n|\n```$/g, "");

    try {
      return JSON.parse(cleanedText);
    } catch (e) {
      return { raw: responseText, error: "Failed to parse JSON response" };
    }

    // Parse the JSON response
    // Note: You might need error handling if the response isn't valid JSON
    try {
      return JSON.parse(responseText);
    } catch (e) {
      // If parsing fails, return the raw text
      return { raw: responseText, error: "Failed to parse JSON response" };
    }
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return { error: "Failed to generate itinerary" };
  }
}
