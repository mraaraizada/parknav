# src/preprocess.py

import pandas as pd
from sklearn.preprocessing import LabelEncoder

def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Fill or drop missing values."""
    df = df.fillna({
        'budget': df['budget'].median() if 'budget' in df else 0,
        'runtime': df['runtime'].median() if 'runtime' in df else 0
    })
    df = df.dropna()
    return df

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Encode categorical columns and prepare data for modeling."""
    df = df.copy()
    categorical_cols = df.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
    return df
