import { PredictionResponse } from '../types';
import { DollarSign, TrendingUp, Theater, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PredictionResultsProps {
  prediction: PredictionResponse;
}

const PredictionResults = ({ prediction }: PredictionResultsProps) => {
  const chartData = [
    {
      name: 'Lower Bound',
      value: prediction.confidence_range.lower,
      formatted: prediction.confidence_range.lower_formatted,
    },
    {
      name: 'Prediction',
      value: prediction.predicted_revenue,
      formatted: prediction.predicted_revenue_formatted,
    },
    {
      name: 'Upper Bound',
      value: prediction.confidence_range.upper,
      formatted: prediction.confidence_range.upper_formatted,
    },
  ];

  const colors = ['#f87171', '#60a5fa', '#34d399'];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Success Header */}
      <div className="card bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/50">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Prediction Complete!</h3>
            <p className="text-green-300 text-sm">Analysis for "{prediction.input_summary.title}"</p>
          </div>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
          <div className="flex items-start justify-between mb-2">
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Predicted Revenue</p>
          <p className="text-3xl font-bold text-white mb-1">
            {prediction.predicted_revenue_formatted}
          </p>
          <p className="text-xs text-slate-500">
            ${(prediction.predicted_revenue / 1000000).toFixed(1)}M total
          </p>
        </div>

        <div className="card bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
          <div className="flex items-start justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Return on Investment</p>
          <p className="text-3xl font-bold text-white mb-1">
            {prediction.roi_percentage}
          </p>
          <p className="text-xs text-slate-500">
            {prediction.roi > 0 ? 'Profitable' : 'Loss'} projection
          </p>
        </div>

        <div className="card bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
          <div className="flex items-start justify-between mb-2">
            <Theater className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Per Theater</p>
          <p className="text-3xl font-bold text-white mb-1">
            {prediction.revenue_per_theater_formatted}
          </p>
          <p className="text-xs text-slate-500">
            Across {prediction.input_summary.theaters} theaters
          </p>
        </div>
      </div>

      {/* Confidence Range Chart */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-bold text-white">Revenue Confidence Range</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [
                `$${(value / 1000000).toFixed(2)}M`,
                'Revenue'
              ]}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-300">
            <strong>Confidence Interval:</strong> The actual revenue is likely to fall between{' '}
            <span className="text-red-400 font-semibold">{prediction.confidence_range.lower_formatted}</span>
            {' '}and{' '}
            <span className="text-green-400 font-semibold">{prediction.confidence_range.upper_formatted}</span>
          </p>
        </div>
      </div>

      {/* Key Factors */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-bold text-white">Key Factors</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Release Season</p>
            <p className="text-white font-semibold text-lg">
              {prediction.key_factors.release_season}
            </p>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Weekend Release</p>
            <p className="text-white font-semibold text-lg">
              {prediction.key_factors.weekend_release ? 'Yes ✓' : 'No ✗'}
            </p>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Budget Category</p>
            <p className="text-white font-semibold text-lg">
              {prediction.key_factors.budget_category}
            </p>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Genre Count</p>
            <p className="text-white font-semibold text-lg">
              {prediction.key_factors.genre_count} genres
            </p>
          </div>
        </div>
      </div>

      {/* Movie Summary */}
      <div className="card bg-slate-700/30">
        <h3 className="text-lg font-bold text-white mb-3">Movie Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Title:</span>
            <span className="text-white font-medium">{prediction.input_summary.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Budget:</span>
            <span className="text-white font-medium">{prediction.input_summary.budget}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Genres:</span>
            <span className="text-white font-medium">{prediction.input_summary.genres}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Rating:</span>
            <span className="text-white font-medium">{prediction.input_summary.rating}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Distributor:</span>
            <span className="text-white font-medium">{prediction.input_summary.distributor}</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card bg-yellow-900/20 border-yellow-500/30">
        <p className="text-sm text-yellow-200">
          <strong>⚠️ Disclaimer:</strong> This prediction is based on historical data and machine learning models. 
          Actual box office performance depends on many factors including movie quality, marketing, competition, 
          and external events. Use for educational purposes only.
        </p>
      </div>
    </div>
  );
};

export default PredictionResults;

