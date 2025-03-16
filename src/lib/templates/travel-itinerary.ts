export const createTravelItineraryPrompt = (params: {
  destination: string;
  days: number;
  people: string;
  budget: string;
  interests: string[];
}) => `
As an expert travel planner with years of experience crafting personalized luxury itineraries, create a detailed day-by-day travel plan with the following specifications:

## TRIP DETAILS:
- **Destination:** ${params.destination}
- **Duration:** ${params.days} days
- **People count or type for the trip:** ${params.people}
- **Budget Preference:** ${params.budget} 
${
  params.interests.length
    ? `- **Areas of Interest:** ${params.interests.join(
        ", "
      )} (While incorporating these interests, don't skip iconic attractions)`
    : ""
}

## Itinerary Guidelines:
Create a premium travel itinerary that balances:
1. Must-see iconic attractions of ${params.destination}
2. Activities aligned with the traveler's interests (${params.interests.join(
  ", "
)})
3. Hidden gems and local secrets that match the overall trip style
4. A mix of popular highlights and off-the-beaten-path experiences

### The itinerary should include:
1. A thoughtful day-by-day breakdown with specific timing
2. Carefully curated restaurants and activities matching the selected budget type (${
  params.budget
})
3. Strategic planning to minimize travel time between locations
4. Backup indoor activities for weather contingencies
5. Local cultural insights and customs to be aware of
6. Best times to visit each attraction to avoid crowds
7. Recommended photo opportunities
8. Transportation tips between locations (excluding airport transfers)
${
  params.budget === "luxury"
    ? "9. VIP experiences and exclusive access opportunities"
    : ""
}

### Important:
- Do NOT include any hotel or accommodation recommendations.
- Focus only on daytime activities, attractions, and dining options.
- Format the itinerary using Markdown for better readability.

## Example Itinerary Format:

# ${params.destination} Itinerary: ${params.days} Days of Adventure

## Day [X]: [Day Theme/Focus]

### Morning (Time Range)
- Activity 1
- Activity 2  
> **Insider Tip:** [specific advice for this activity]

### Afternoon (Time Range)
- Activity 1
- Activity 2  
> **Insider Tip:** [specific advice for this activity]

### Evening (Time Range)
- Activity 1
- Activity 2  
> **Insider Tip:** [specific advice for this activity]

### BRIEF INTRODUCTION ABOUT THE ${params.destination} CITY
### 3 GENERAL SUGGESTIONS TO DO IN ${
  params.destination
} CITY THAT ANYONE CAN DO REGARDLESS OF PERSON TYPE, NUMBER OF PEOPLE THEY'RE TRAVELLING WITH, BUDGET THEY'RE ON AND THINGS THEY ENJOY DOING
### 5 GENERAL PLACES TO VISIT IN ${
  params.destination
} CITY THAT ANYONE WILL ENJOY VISITING REGARDLESS OF PERSON TYPE, NUMBER OF PEOPLE THEY'RE TRAVELLING WITH, BUDGET THEY'RE ON AND THINGS THEY ENJOY DOING

### Dining Recommendations
#### Lunch
- **[Restaurant Name]** - [Cuisine Type] (${params.budget})  
> *Known for:* [Signature dishes or specialties]

#### Dinner
- **[Restaurant Name]** - [Cuisine Type] (${params.budget})  
> *Known for:* [Signature dishes or specialties]

### 📸 Photo Opportunities
- **[Location 1]** - Best time: [time]
- **[Location 2]** - Best time: [time]

### 💡 Local Tips
- [Cultural insight or practical advice]
- [Weather contingency options]
- [Transportation tip]

RETURN THE RESPONSE IN JSON FORMAT!
`;
