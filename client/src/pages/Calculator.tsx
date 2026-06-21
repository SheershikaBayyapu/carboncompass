import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Zap, Utensils, ShoppingBag, Loader2 } from 'lucide-react';

export const Calculator: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transport, setTransport] = useState(300);
  const [electricity, setElectricity] = useState(150);
  const [food, setFood] = useState<'vegan' | 'vegetarian' | 'omnivore' | 'heavy-meat'>('omnivore');
  const [shopping, setShopping] = useState(200);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/carbon/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ transport, electricity, food, shopping }),
      });
      if (res.ok) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Footprint Input Core</h1>
        <p className="text-slate-500">Provide baseline performance details below to compute net carbon offset structures.</p>
      </div>

      <form onSubmit={handleCalculate} className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 text-emerald-600"><Car className="w-5 h-5" /><span className="font-semibold text-sm uppercase tracking-wider">Transport (Monthly KM)</span></div>
          <input type="number" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" value={transport} onChange={(e) => setTransport(Number(e.target.value))} />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 text-emerald-600"><Zap className="w-5 h-5" /><span className="font-semibold text-sm uppercase tracking-wider">Electricity (Monthly kWh)</span></div>
          <input type="number" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" value={electricity} onChange={(e) => setElectricity(Number(e.target.value))} />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 text-emerald-600"><Utensils className="w-5 h-5" /><span className="font-semibold text-sm uppercase tracking-wider">Dietary Blueprint</span></div>
          <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" value={food} onChange={(e) => setFood(e.target.value as any)}>
            <option value="vegan">100% Plant-Based (Vegan)</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="omnivore">Balanced Omnivore</option>
            <option value="heavy-meat">High meat-intensive intake</option>
          </select>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 text-emerald-600"><ShoppingBag className="w-5 h-5" /><span className="font-semibold text-sm uppercase tracking-wider">Retail Expenditures ($/Mo)</span></div>
          <input type="number" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" value={shopping} onChange={(e) => setShopping(Number(e.target.value))} />
        </div>

        <button type="submit" disabled={loading} className="md:col-span-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run Analytical Computations'}
        </button>
      </form>
    </div>
  );
};