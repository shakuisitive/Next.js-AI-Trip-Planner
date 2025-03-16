import { createTravelItineraryPrompt } from "@/lib/templates/travel-itinerary";
import { generateItinerary } from "../actions/generate-itinerary";
import ItineraryGenerator from "@/_components/Form.tsx";

const travelParams = {
  destination: "Barcelona",
  days: 5,
  people: "couple",
  budget: "moderate",
  interests: ["food & dining", "cultural sites", "beaches"],
};

async function Homepage() {
  return (
    <div className="flex items-center justify-center bg-gray-200">
      <p className="text-gray-400 font-2 text-5xl my-4">Hello, Shakir</p>
      <ItineraryGenerator params={travelParams} />
    </div>
  );
}

export default Homepage;
