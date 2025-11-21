# 🎬 Movie Box Office Revenue Predictor - Full Stack Application

A modern full-stack web application that predicts movie box office revenue using machine learning. Built with **React + Vite** frontend and **FastAPI** backend.

## 🌟 Features

- **Modern UI**: Beautiful, responsive interface built with React, TypeScript, and Tailwind CSS
- **Real-time Predictions**: Get instant box office revenue predictions
- **Interactive Charts**: Visualize predictions with confidence intervals using Recharts
- **ML-Powered**: XGBoost regression model trained on historical box office data
- **RESTful API**: FastAPI backend with automatic API documentation
- **Type-Safe**: Full TypeScript support for better development experience

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React + Vite   │ ◄─────► │   FastAPI       │ ◄─────► │  XGBoost Model  │
│   Frontend      │  HTTP   │   Backend       │         │   (Trained)     │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## 📁 Project Structure

```
movies/
├── backend/                 # FastAPI backend
│   ├── main.py             # API endpoints and model serving
│   └── requirements.txt    # Python dependencies
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── MovieForm.tsx
│   │   │   └── PredictionResults.tsx
│   │   ├── App.tsx         # Main app component
│   │   ├── api.ts          # API client
│   │   ├── types.ts        # TypeScript types
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── vite.config.ts
├── src/                    # ML pipeline (existing)
│   ├── models.py
│   ├── features.py
│   ├── train.py
│   └── ...
├── outputs/                # Trained models and reports
│   └── models/
│       ├── xgboost_model.joblib
│       └── metadata.json
└── data/                   # Training data
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

### 1. Train the Model (if not already done)

```bash
# Install Python dependencies
pip install -r requirements.txt

# Train the model
python src/train.py --model xgboost
```

This will create the trained model in `outputs/models/xgboost_model.joblib`.

### 2. Start the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### 3. Start the Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 🎯 Usage

1. **Open the app** at `http://localhost:3000`
2. **Fill in movie details**:
   - Movie title
   - Budget (slider)
   - Opening theaters (slider)
   - Expected release days
   - MPAA rating
   - Genres (multiple selection)
   - Distributor
   - Release month and day
3. **Click "Predict Revenue"**
4. **View results**:
   - Predicted revenue
   - ROI percentage
   - Revenue per theater
   - Confidence interval chart
   - Key factors analysis

## 🔌 API Endpoints

### `GET /`
Health check and API info

### `GET /health`
Server health status

### `GET /api/options`
Get available options for dropdowns (genres, ratings, distributors, etc.)

### `POST /api/predict`
Predict box office revenue

**Request Body:**
```json
{
  "title": "My Awesome Movie",
  "budget": 50000000,
  "opening_theaters": 3000,
  "release_days": 90,
  "mpaa_rating": "PG-13",
  "genres": ["Action", "Adventure"],
  "distributor": "Universal",
  "release_month": 6,
  "release_dayofweek": 4
}
```

**Response:**
```json
{
  "success": true,
  "predicted_revenue": 125000000,
  "predicted_revenue_formatted": "$125.00M",
  "roi": 150.0,
  "roi_percentage": "150.0%",
  "revenue_per_theater": 41666.67,
  "revenue_per_theater_formatted": "$41.67K",
  "confidence_range": {
    "lower": 87500000,
    "upper": 162500000,
    "lower_formatted": "$87.50M",
    "upper_formatted": "$162.50M"
  },
  "key_factors": { ... },
  "input_summary": { ... }
}
```

### `GET /api/model/info`
Get model information and metrics

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **FastAPI** - Web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **Scikit-learn** - ML utilities
- **XGBoost** - ML model
- **Joblib** - Model serialization

## 📊 Model Details

- **Algorithm**: XGBoost Regressor
- **Target**: Log-transformed domestic box office revenue
- **Features**: 20+ engineered features including:
  - Budget and theater count
  - Genre combinations
  - MPAA rating
  - Release timing (month, day, season)
  - Distributor information
  - Interaction features

## 🎨 UI Features

- **Dark Mode Design**: Modern dark theme with gradient accents
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Forms**: Sliders, multi-select, and dropdowns
- **Real-time Validation**: Instant feedback on form inputs
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Data Visualization**: Interactive charts with Recharts

## 🔧 Development

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or use the main.py script
python main.py
```

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Backend
No environment variables required for local development.

## 🚢 Production Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
# Or use a production ASGI server like Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## 🐛 Troubleshooting

### Model Not Found Error
- Make sure you've trained the model: `python src/train.py --model xgboost`
- Check that `outputs/models/xgboost_model.joblib` exists

### CORS Errors
- Ensure the backend is running on port 8000
- Check that CORS middleware is properly configured in `backend/main.py`

### Frontend Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Make sure you're using Node.js 18+

## 📄 License

This project is for educational purposes only.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This tool is for educational and entertainment purposes only. Predictions are estimates based on historical patterns and should not be used for actual investment or business decisions. Actual box office performance depends on many factors including movie quality, marketing effectiveness, competition, and external events.

---

**Built with ❤️ using React, Vite, FastAPI, and XGBoost**

