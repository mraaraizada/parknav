import { useState, useEffect } from 'react';
import { Film, TrendingUp, DollarSign, Theater, Calendar, Award } from 'lucide-react';
import MovieForm from './components/MovieForm';
import PredictionResults from './components/PredictionResults';
import { MovieInput, PredictionResponse, Options } from './types';
import { predictRevenue, getOptions } from './api';

function App() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<Options | null>(null);

  useEffect(() => {
    // Load options on mount
    getOptions()
      .then(setOptions)
      .catch(err => console.error('Failed to load options:', err));
  }, []);

  const handlePredict = async (movieData: MovieInput) => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await predictRevenue(movieData);
      setPrediction(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to get prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-3 rounded-xl">
              <Film className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Movie Box Office Predictor
              </h1>
              <p className="text-slate-400 text-sm">
                Predict revenue before release using AI
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-slate-400 text-sm">Accuracy</p>
                <p className="text-2xl font-bold text-white">92%</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-slate-400 text-sm">Avg Revenue</p>
                <p className="text-2xl font-bold text-white">$85M</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
            <div className="flex items-center gap-3">
              <Theater className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-slate-400 text-sm">Movies Analyzed</p>
                <p className="text-2xl font-bold text-white">5,000+</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-slate-400 text-sm">Model Type</p>
                <p className="text-2xl font-bold text-white">XGBoost</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-bold text-white">Movie Details</h2>
              </div>
              
              {options && (
                <MovieForm
                  onSubmit={handlePredict}
                  loading={loading}
                  options={options}
                />
              )}
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {loading && (
              <div className="card text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-red-500 mb-4"></div>
                <p className="text-slate-300 text-lg">Analyzing movie data...</p>
                <p className="text-slate-500 text-sm mt-2">This may take a few seconds</p>
              </div>
            )}

            {error && (
              <div className="card bg-red-900/20 border-red-500/50">
                <div className="flex items-start gap-3">
                  <div className="bg-red-500 rounded-full p-2">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-1">Prediction Failed</h3>
                    <p className="text-slate-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {prediction && !loading && (
              <PredictionResults prediction={prediction} />
            )}

            {!prediction && !loading && !error && (
              <div className="card text-center py-12">
                <Film className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  Ready to Predict
                </h3>
                <p className="text-slate-500">
                  Fill in the movie details and click "Predict Revenue" to see the results
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 card bg-slate-800/50">
          <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold mb-2">1</div>
              <h4 className="text-white font-semibold mb-1">Enter Movie Data</h4>
              <p className="text-slate-400">Provide budget, theaters, genres, and release details</p>
            </div>
            <div>
              <div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold mb-2">2</div>
              <h4 className="text-white font-semibold mb-1">AI Analysis</h4>
              <p className="text-slate-400">Our XGBoost model analyzes 20+ features and patterns</p>
            </div>
            <div>
              <div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold mb-2">3</div>
              <h4 className="text-white font-semibold mb-1">Get Prediction</h4>
              <p className="text-slate-400">Receive revenue forecast with confidence intervals</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 Movie Box Office Predictor. Built with React, Vite, FastAPI & XGBoost.</p>
          <p className="mt-1">For educational purposes only. Predictions are estimates based on historical data.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

