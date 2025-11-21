"""
FastAPI Backend for Movie Box Office Revenue Prediction
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
import json
import sys

# Add parent directory to path to import src modules
sys.path.append(str(Path(__file__).parent.parent))

app = FastAPI(
    title="Movie Box Office Predictor API",
    description="Predict movie box office revenue using machine learning",
    version="1.0.0"
)

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and metadata
model = None
metadata = None


class MovieInput(BaseModel):
    """Input schema for movie prediction"""
    title: str = Field(..., example="My Awesome Movie")
    budget: float = Field(..., ge=100000, le=500000000, example=50000000)
    opening_theaters: int = Field(..., ge=1, le=5000, example=3000)
    release_days: int = Field(..., ge=7, le=365, example=90)
    mpaa_rating: str = Field(..., example="PG-13")
    genres: List[str] = Field(..., example=["Action", "Adventure"])
    distributor: str = Field(..., example="Universal")
    release_month: int = Field(..., ge=1, le=12, example=6)
    release_dayofweek: int = Field(..., ge=0, le=6, example=4)


class ConfidenceRange(BaseModel):
    """Confidence range schema"""
    lower: float
    upper: float
    lower_formatted: str
    upper_formatted: str


class PredictionResponse(BaseModel):
    """Response schema for prediction"""
    success: bool
    predicted_revenue: float
    predicted_revenue_formatted: str
    roi: float
    roi_percentage: str
    revenue_per_theater: float
    revenue_per_theater_formatted: str
    confidence_range: ConfidenceRange
    key_factors: Dict[str, Any]
    input_summary: Dict[str, Any]


class ModelMetrics(BaseModel):
    """Model performance metrics"""
    model_type: str
    metrics: Dict[str, Any]
    feature_count: int


def format_currency(value: float) -> str:
    """Format value as currency string"""
    if value >= 1e9:
        return f"${value/1e9:.2f}B"
    elif value >= 1e6:
        return f"${value/1e6:.2f}M"
    elif value >= 1e3:
        return f"${value/1e3:.2f}K"
    else:
        return f"${value:.2f}"


def load_model_pipeline():
    """Load the trained model and metadata"""
    global model, metadata
    
    try:
        # Try multiple possible paths
        possible_paths = [
            Path(__file__).parent.parent / 'outputs' / 'models' / 'xgboost_model.joblib',
            Path(__file__).parent.parent / 'outputs' / 'models' / 'pipeline_xgboost.joblib',
            Path(__file__).parent.parent / 'models' / 'boxoffice_rf_model.pkl',
        ]
        
        model_path = None
        for path in possible_paths:
            if path.exists():
                model_path = path
                break
        
        if model_path is None:
            print("⚠️ No trained model found. Please train the model first.")
            return False
        
        model = joblib.load(model_path)
        print(f"✅ Model loaded from: {model_path}")
        
        # Load metadata
        metadata_path = Path(__file__).parent.parent / 'outputs' / 'models' / 'metadata.json'
        if metadata_path.exists():
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            print(f"✅ Metadata loaded")
        else:
            metadata = None
            print("⚠️ Metadata not found, using defaults")
        
        return True
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False


def prepare_input_features(user_inputs: Dict[str, Any], metadata: Optional[Dict] = None) -> pd.DataFrame:
    """
    Prepare user inputs into feature vector matching training format
    """
    # Create base dataframe
    df = pd.DataFrame([user_inputs])
    
    # Date features
    if 'release_month' in user_inputs:
        df['is_summer'] = int(user_inputs['release_month'] in [5, 6, 7, 8])
        df['is_holiday_season'] = int(user_inputs['release_month'] in [11, 12])
        df['release_quarter'] = (user_inputs['release_month'] - 1) // 3 + 1
    
    # Weekend release
    df['is_weekend_release'] = int(user_inputs.get('release_dayofweek', 4) in [4, 5, 6])
    
    # Genre features (one-hot)
    selected_genres = user_inputs.get('genres', [])
    for genre in ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance', 'Sci-Fi', 'Adventure']:
        df[f'genre_{genre.lower()}'] = int(genre in selected_genres)
    
    # MPAA features (one-hot)
    for rating in ['G', 'PG', 'PG-13', 'R', 'NR']:
        df[f'mpaa_{rating}'] = int(user_inputs.get('mpaa_rating') == rating)
    
    # Distributor features
    dist_mapping = {
        'Universal': 0.15, 'Warner Bros.': 0.15, 'Disney': 0.20,
        'Sony': 0.12, 'Paramount': 0.12, 'Fox': 0.12,
        'Lionsgate': 0.09, 'Other': 0.05
    }
    distributor = user_inputs.get('distributor', 'Other')
    df['distributor_freq'] = dist_mapping.get(distributor, 0.05)
    
    for dist in dist_mapping.keys():
        df[f'dist_{dist}'] = int(distributor == dist)
    
    # Interaction features
    if 'budget' in df.columns and 'opening_theaters' in df.columns:
        df['budget_per_theater'] = df['budget'] / (df['opening_theaters'] + 1)
    
    if 'release_days' in df.columns and 'opening_theaters' in df.columns:
        df['theater_days'] = df['release_days'] * df['opening_theaters']
    
    # Ensure all required features are present
    if metadata and 'all_features' in metadata:
        for feature in metadata['all_features']:
            if feature not in df.columns:
                df[feature] = 0
        
        # Select only required features in correct order
        df = df[metadata['all_features']]
    
    return df


@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    success = load_model_pipeline()
    if not success:
        print("⚠️ Warning: Model not loaded. Predictions will not work.")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Movie Box Office Predictor API",
        "version": "1.0.0",
        "status": "running",
        "model_loaded": model is not None
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "metadata_loaded": metadata is not None
    }


@app.get("/api/model/info", response_model=ModelMetrics)
async def get_model_info():
    """Get model information and metrics"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Try to load metrics
    metrics_path = Path(__file__).parent.parent / 'outputs' / 'reports' / 'xgboost_metrics.json'
    metrics_data = {}
    
    if metrics_path.exists():
        with open(metrics_path, 'r') as f:
            metrics_data = json.load(f)
    
    return ModelMetrics(
        model_type="XGBoost Regressor",
        metrics=metrics_data,
        feature_count=len(metadata.get('all_features', [])) if metadata else 0
    )


@app.post("/api/predict", response_model=PredictionResponse)
async def predict_revenue(movie: MovieInput):
    """Predict box office revenue for a movie"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please train the model first.")
    
    try:
        # Convert input to dict
        user_inputs = movie.dict()
        
        # Prepare features
        X = prepare_input_features(user_inputs, metadata)
        
        # Make prediction
        if hasattr(model, 'predict'):
            # Direct model
            prediction_log = model.predict(X)[0]
            prediction_dollars = 10 ** prediction_log
        elif isinstance(model, dict) and 'model' in model:
            # Pipeline format
            prediction_log = model['model'].predict(X, return_dollars=False)[0]
            prediction_dollars = 10 ** prediction_log
        else:
            raise ValueError("Unknown model format")
        
        # Calculate metrics
        roi = ((prediction_dollars - movie.budget) / movie.budget) * 100
        revenue_per_theater = prediction_dollars / movie.opening_theaters
        
        # Confidence range (±30% for illustration)
        lower_bound = prediction_dollars * 0.7
        upper_bound = prediction_dollars * 1.3
        
        # Key factors
        key_factors = {
            "release_season": "Summer" if movie.release_month in [5, 6, 7, 8] else "Holiday" if movie.release_month in [11, 12] else "Regular",
            "weekend_release": movie.release_dayofweek in [4, 5, 6],
            "genre_count": len(movie.genres),
            "theater_count": movie.opening_theaters,
            "budget_category": "High" if movie.budget > 100000000 else "Medium" if movie.budget > 30000000 else "Low"
        }
        
        return PredictionResponse(
            success=True,
            predicted_revenue=prediction_dollars,
            predicted_revenue_formatted=format_currency(prediction_dollars),
            roi=roi,
            roi_percentage=f"{roi:.1f}%",
            revenue_per_theater=revenue_per_theater,
            revenue_per_theater_formatted=format_currency(revenue_per_theater),
            confidence_range={
                "lower": lower_bound,
                "upper": upper_bound,
                "lower_formatted": format_currency(lower_bound),
                "upper_formatted": format_currency(upper_bound)
            },
            key_factors=key_factors,
            input_summary={
                "title": movie.title,
                "budget": format_currency(movie.budget),
                "theaters": movie.opening_theaters,
                "genres": ", ".join(movie.genres),
                "rating": movie.mpaa_rating,
                "distributor": movie.distributor
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/api/options")
async def get_options():
    """Get available options for dropdowns"""
    return {
        "mpaa_ratings": ["G", "PG", "PG-13", "R", "NR"],
        "genres": ["Action", "Comedy", "Drama", "Horror", "Thriller", "Romance", "Sci-Fi", "Adventure"],
        "distributors": ["Universal", "Warner Bros.", "Disney", "Sony", "Paramount", "Fox", "Lionsgate", "Other"],
        "months": [
            {"value": 1, "label": "January"},
            {"value": 2, "label": "February"},
            {"value": 3, "label": "March"},
            {"value": 4, "label": "April"},
            {"value": 5, "label": "May"},
            {"value": 6, "label": "June"},
            {"value": 7, "label": "July"},
            {"value": 8, "label": "August"},
            {"value": 9, "label": "September"},
            {"value": 10, "label": "October"},
            {"value": 11, "label": "November"},
            {"value": 12, "label": "December"}
        ],
        "days_of_week": [
            {"value": 0, "label": "Monday"},
            {"value": 1, "label": "Tuesday"},
            {"value": 2, "label": "Wednesday"},
            {"value": 3, "label": "Thursday"},
            {"value": 4, "label": "Friday"},
            {"value": 5, "label": "Saturday"},
            {"value": 6, "label": "Sunday"}
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

