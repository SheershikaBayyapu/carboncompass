import { Footprint } from '../models/Footprint.js';
import { Recommendation } from '../models/Recommendation.js';

interface RawInputData {
  transport: number;
  electricity: number;
  food: 'vegan' | 'vegetarian' | 'omnivore' | 'heavy-meat';
  shopping: number;
}

export const generateAIRecommendations = async (userId: string, currentFootprint: any): Promise<any> => {
  const { transport, electricity, food, shopping } = currentFootprint;
  const recommendationsBatch = [];

  // 1. Analyze Transportation Heuristics
  if (transport > 500) {
    recommendationsBatch.push({
      userId,
      category: 'transport',
      title: 'Transition to High-Efficiency Commuting',
      description: 'Your monthly mileage indicates high single-occupancy vehicle emissions. Consider replacing 30% of transit trips with rail alternative networks or public EV networks.',
      impact: 'High',
      carbonSaved: Math.round(transport * 0.18 * 0.3)
    });
  }

  // 2. Analyze Household Resource Optimization Matrices
  if (electricity > 200) {
    recommendationsBatch.push({
      userId,
      category: 'electricity',
      title: 'Optimize Off-Peak Residential Appliance Loading',
      description: 'Your energy consumption profile is higher than average. Switch heavy machinery and laundry cycles to off-peak grid hours to leverage clean base-load profiles.',
      impact: 'Medium',
      carbonSaved: Math.round(electricity * 0.45 * 0.15)
    });
  }

  // 3. Analyze Dietary Supply-Chain Matrices
  if (food === 'heavy-meat' || food === 'omnivore') {
    recommendationsBatch.push({
      userId,
      category: 'food',
      title: 'Adopt Low-Impact Alternate Days',
      description: 'Transitioning to plant-based items twice a week directly targets nitrous-oxide agricultural supply-chain impacts.',
      impact: 'High',
      carbonSaved: food === 'heavy-meat' ? 80 : 40;
    });
  }

  // 4. Analyze Retail Consumer Footprint Weights
  if (shopping > 300) {
    recommendationsBatch.push({
      userId,
      category: 'shopping',
      title: 'Introduce a Circular Sourcing Constraint',
      description: 'Scale back discretionary item procurement by buying second-hand or certified circular apparel brands.',
      impact: 'Low',
      carbonSaved: Math.round(shopping * 0.12 * 0.2)
    });
  }

  // Purge outdated historic actions and persist fresh strategy frameworks
  await Recommendation.deleteMany({ userId, completed: false });
  const storedRecs = await Recommendation.insertMany(recommendationsBatch);

  // Generate Insight Commentary Synthesizer
  let insight = "Your sustainability metrics look stable. Focus on reducing transport dependencies to drive deep reductions.";
  if (transport > electricity && transport > shopping) {
    insight = "Automotive transport constitutes your single largest point of atmospheric leakage. Optimizing transit profiles will yield maximum reduction velocity.";
  } else if (electricity > transport) {
    insight = "Your home utility profile dominates your carbon footprint. Improving thermal insulation or using energy-efficient appliances should be your primary focus.";
  }

  return { recommendations: storedRecs, insight };
};

/**
 * Predicts the user's carbon footprint for the next month using a 
 * localized single-variable linear trend extrapolation algorithm.
 */
export const predictNextMonthFootprint = async (userId: string): Promise<number> => {
  const history = await Footprint.find({ userId }).sort({ createdAt: -1 }).limit(6);
  
  if (history.length < 2) {
    const baseline = await Footprint.findOne({ userId }).sort({ createdAt: -1 });
    return baseline ? baseline.monthlyEstimate : 400;
  }

  const y = history.map(h => h.monthlyEstimate).reverse();
  const n = y.length;
  
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += y[i];
    sumXY += i * y[i];
    sumXX += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Extrapolate value for next chronological sequence node index (n)
  const structuralPrediction = slope * n + intercept;
  return Math.max(10, Math.round(structuralPrediction));
};