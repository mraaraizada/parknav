import joblib
import pandas as pd
import numpy as np

# Load trained model
model = joblib.load("models/boxoffice_rf_model.pkl")

# Load the column order used during training
expected_features = model.feature_names_in_  # built-in attribute in sklearn 1.0+

# Example input (replace with your own test values)
sample = {
    "budget": 150000000,
    "genres": "Action",
    "popularity": 32.5,
    "runtime": 130,
    "vote_average": 7.5,
    "vote_count": 2000,
    "production_companies": "Marvel Studios",
    "original_language": "en",
    "release_date": "2019-04-26",
    "movie_id": 299534,        # add this to match training features
    "revenue": 0               # dummy value (not used for prediction)
}

# Create DataFrame and ensure columns match training order
df = pd.DataFrame([sample])
for col in expected_features:
    if col not in df.columns:
        df[col] = 0  # fill missing columns with dummy values
df = df[expected_features]  # reorder to match training

# Predict log_revenue
pred_log = model.predict(df)[0]

# Convert back to dollars
pred_revenue = np.expm1(pred_log)
print(f"💰 Predicted box office revenue: ${pred_revenue:,.2f}")
