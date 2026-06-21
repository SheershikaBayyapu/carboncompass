export interface User {
  id: string;
  name: string;
  email: string;
  sustainabilityScore: number;
  streak: number;
  badges: string[];
}

export interface CarbonInput {
  transport: number; // km per month
  electricity: number; // kWh per month
  food: 'vegan' | 'vegetarian' | 'omnivore' | 'heavy-meat';
  shopping: number; // Monthly spend status ratio
}

export interface FootprintData {
  id?: string;
  score: number;
  monthlyEstimate: number;
  yearlyEstimate: number;
  breakdown: {
    transport: number;
    electricity: number;
    food: number;
    shopping: number;
  };
  createdAt: string;
}

export interface Recommendation {
  id: string;
  category: 'transport' | 'electricity' | 'food' | 'shopping';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  carbonSaved: number;
  completed: boolean;
}
