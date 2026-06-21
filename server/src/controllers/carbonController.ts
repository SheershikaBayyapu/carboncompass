import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Footprint } from '../models/Footprint.js';
import { User } from '../models/User.js';

export const calculateFootprint = async (req: AuthRequest, res: Response): Promise<any> => {
  const { transport, electricity, food, shopping } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(400).json({ message: 'User context binding lost' });

  // Calculation conversion coefficients (kg CO2e parameters)
  const transportCO2 = transport * 0.18; 
  const electricityCO2 = electricity * 0.45;
  
  const foodFactors = { 'vegan': 60, 'vegetarian': 90, 'omnivore': 150, 'heavy-meat': 280 };
  const foodCO2 = foodFactors[food as keyof typeof foodFactors] || 150;
  
  const shoppingCO2 = shopping * 0.12;

  const monthlyEstimate = transportCO2 + electricityCO2 + foodCO2 + shoppingCO2;
  const yearlyEstimate = monthlyEstimate * 12;
  
  // Scoring logic inverse map
  const score = Math.max(10, Math.min(100, Math.round(5000 / (monthlyEstimate + 1))));

  try {
    const newFootprint = await Footprint.create({
      userId,
      transport,
      electricity,
      food,
      shopping,
      score,
      monthlyEstimate,
      yearlyEstimate,
      breakdown: { transport: transportCO2, electricity: electricityCO2, food: foodCO2, shopping: shoppingCO2 }
    });

    await User.findByIdAndUpdate(userId, { $inc: { sustainabilityScore: 15 } });

    return res.status(201).json(newFootprint);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCurrentFootprint = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const current = await Footprint.findOne({ userId: req.user?.id }).sort({ createdAt: -1 });
    if (!current) return res.status(404).json({ message: 'No diagnostic record found' });
    return res.json(current);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const history = await Footprint.find({ userId: req.user?.id }).sort({ createdAt: -1 }).limit(12);
    return res.json(history);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};