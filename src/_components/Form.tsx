"use client";

import { useState } from "react";
import { generateItinerary } from "../actions/generate-itinerary";

export default function ItineraryGenerator({ params }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    // const params = {
    //   destination: formData.get("destination") as string,
    //   days: parseInt(formData.get("days") as string),
    //   people: formData.get("people") as string,
    //   budget: formData.get("budget") as string,
    //   interests: (formData.get("interests") as string)
    //     .split(",")
    //     .map((i) => i.trim()),
    // };

    const response = await generateItinerary(params);
    setResult(response);
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Travel Itinerary Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields here */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Your Itinerary</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
