import { useState } from 'react';
import { MovieInput, Options } from '../types';
import { Sparkles } from 'lucide-react';

interface MovieFormProps {
  onSubmit: (data: MovieInput) => void;
  loading: boolean;
  options: Options;
}

const MovieForm = ({ onSubmit, loading, options }: MovieFormProps) => {
  const [formData, setFormData] = useState<MovieInput>({
    title: 'My Awesome Movie',
    budget: 50000000,
    opening_theaters: 3000,
    release_days: 90,
    mpaa_rating: 'PG-13',
    genres: ['Action', 'Adventure'],
    distributor: 'Universal',
    release_month: 6,
    release_dayofweek: 4,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Movie Title */}
      <div>
        <label className="label">Movie Title</label>
        <input
          type="text"
          className="input-field"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      {/* Budget */}
      <div>
        <label className="label">
          Budget: {formatCurrency(formData.budget)}
        </label>
        <input
          type="range"
          min="100000"
          max="500000000"
          step="1000000"
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>$100K</span>
          <span>$500M</span>
        </div>
      </div>

      {/* Opening Theaters */}
      <div>
        <label className="label">
          Opening Theaters: {formData.opening_theaters.toLocaleString()}
        </label>
        <input
          type="range"
          min="1"
          max="5000"
          step="50"
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
          value={formData.opening_theaters}
          onChange={(e) => setFormData({ ...formData, opening_theaters: Number(e.target.value) })}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>1</span>
          <span>5,000</span>
        </div>
      </div>

      {/* Release Days */}
      <div>
        <label className="label">
          Expected Release Days: {formData.release_days}
        </label>
        <input
          type="range"
          min="7"
          max="365"
          step="7"
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
          value={formData.release_days}
          onChange={(e) => setFormData({ ...formData, release_days: Number(e.target.value) })}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>1 week</span>
          <span>1 year</span>
        </div>
      </div>

      {/* MPAA Rating */}
      <div>
        <label className="label">MPAA Rating</label>
        <select
          className="input-field"
          value={formData.mpaa_rating}
          onChange={(e) => setFormData({ ...formData, mpaa_rating: e.target.value })}
        >
          {options.mpaa_ratings.map(rating => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
      </div>

      {/* Genres */}
      <div>
        <label className="label">Genres (select multiple)</label>
        <div className="grid grid-cols-2 gap-2">
          {options.genres.map(genre => (
            <button
              key={genre}
              type="button"
              onClick={() => handleGenreToggle(genre)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                formData.genres.includes(genre)
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Distributor */}
      <div>
        <label className="label">Distributor</label>
        <select
          className="input-field"
          value={formData.distributor}
          onChange={(e) => setFormData({ ...formData, distributor: e.target.value })}
        >
          {options.distributors.map(dist => (
            <option key={dist} value={dist}>{dist}</option>
          ))}
        </select>
      </div>

      {/* Release Month */}
      <div>
        <label className="label">Release Month</label>
        <select
          className="input-field"
          value={formData.release_month}
          onChange={(e) => setFormData({ ...formData, release_month: Number(e.target.value) })}
        >
          {options.months.map(month => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </select>
      </div>

      {/* Day of Week */}
      <div>
        <label className="label">Release Day of Week</label>
        <select
          className="input-field"
          value={formData.release_dayofweek}
          onChange={(e) => setFormData({ ...formData, release_dayofweek: Number(e.target.value) })}
        >
          {options.days_of_week.map(day => (
            <option key={day.value} value={day.value}>{day.label}</option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || formData.genres.length === 0}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            Predicting...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Predict Revenue
          </>
        )}
      </button>

      {formData.genres.length === 0 && (
        <p className="text-sm text-yellow-500 text-center">
          Please select at least one genre
        </p>
      )}
    </form>
  );
};

export default MovieForm;

