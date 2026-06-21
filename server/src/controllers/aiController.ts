import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Footprint } from '../models/Footprint.js';
import { Recommendation } from '../models/Recommendation.js';
import { User } from '../models/User.js';
import { generateAIRecommendations, predictNextMonthFootprint } from '../services/aiEngine.js';

export const getAIInsightsHub = async (req: AuthRequest, res: Response): Promise<any> => {
  const userId = req.user?.id;
  try {
    const currentFootprint = await Footprint.findOne({ userId }).sort({ createdAt: -1 });
    if (!currentFootprint) {
      return res.status(400).json({ message: 'Please run baseline calculations first to train the coach models.' });
    }

    const { recommendations, insight } = await generateAIRecommendations(userId!, currentFootprint);
    const predictedNextMonth = await predictNextMonthFootprint(userId!);

    return res.json({ recommendations, insight, predictedNextMonth });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const completeActionTask = async (req: AuthRequest, res: Response): Promise<any> => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const recommendation = await Recommendation.findOne({ _id: id, userId });
    if (!recommendation) return res.status(404).json({ message: 'Action recommendation trace not found.' });

    if (!recommendation.completed) {
      recommendation.completed = true;
      await recommendation.save();

      // Reward the user with XP for completing an action item
      await User.findByIdAndUpdate(userId, { 
        $inc: { sustainabilityScore: recommendation.carbonSaved },
        $set: { streak: 4 } // Updates the streak baseline counter
      });
    }

    return res.json({ message: 'Action task successfully tracked and rewarded.', recommendation });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};