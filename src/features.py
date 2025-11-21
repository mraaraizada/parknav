"""
Feature engineering module for box office prediction project.
"""
import pandas as pd
import numpy as np
from typing import Tuple, List
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.feature_extraction.text import CountVectorizer
from src.utils import log_message


def create_log_target(y: pd.Series) -> pd.Series:
    """Create log-transformed target variable."""
    if (y <= 0).any():
        log_message("Warning: Found non-positive values in target", level="WARNING")
        y = y.clip(lower=1)
    y_log = np.log10(y)
    log_message(f"Target transformed: mean={y.mean():.2f} -> log_mean={y_log.mean():.2f}")
    return y_log


def extract_date_features(df: pd.DataFrame, date_col: str = 'release_date') -> pd.DataFrame:
    """Extract date-related features."""
    df = df.copy()
    if date_col not in df.columns:
        log_message(f"Date column '{date_col}' not found", level="WARNING")
        return df

    df[date_col] = pd.to_datetime(df[date_col], errors='coerce')

    df['release_month'] = df[date_col].dt.month
    df['release_dayofweek'] = df[date_col].dt.dayofweek
    df['release_quarter'] = df[date_col].dt.quarter
    df['release_year'] = df[date_col].dt.year
    df['is_weekend_release'] = df['release_dayofweek'].isin([4, 5, 6]).astype(int)
    df['is_summer'] = df['release_month'].isin([5, 6, 7, 8]).astype(int)
    df['is_holiday_season'] = df['release_month'].isin([11, 12]).astype(int)
    df = df.drop(columns=[date_col])

    log_message(f"✓ Extracted date features from '{date_col}'")
    return df


def process_genres(df: pd.DataFrame,
                   genre_col: str = 'genres',
                   delimiter: str = '|',
                   min_frequency: float = 0.05) -> Tuple[pd.DataFrame, CountVectorizer]:
    """Safely process genre column into binary encoded features."""
    df = df.copy()

    if genre_col not in df.columns:
        log_message(f"Genre column '{genre_col}' not found", level="WARNING")
        return df, None

    # --- ✅ FIX START: Handle mixed/non-string genre types ---
    def safe_convert_genre(val):
        if pd.isna(val):
            return "Unknown"
        if isinstance(val, (list, tuple)):
            return " ".join(map(str, val))
        return str(val)
    
    df[genre_col] = df[genre_col].apply(safe_convert_genre)
    df[genre_col] = df[genre_col].str.replace(delimiter, ' ', regex=False)
    df[genre_col] = df[genre_col].str.replace(',', ' ', regex=False)
    # --- ✅ FIX END ---

    # Create binary genre features
    vectorizer = CountVectorizer(binary=True, token_pattern=r'\b\w+\b')
    genre_features = vectorizer.fit_transform(df[genre_col])

    genre_df = pd.DataFrame(
        genre_features.toarray(),
        columns=[f'genre_{g}' for g in vectorizer.get_feature_names_out()],
        index=df.index
    )

    # Remove rare genres
    genre_counts = genre_df.sum()
    rare_threshold = len(df) * min_frequency
    rare_genres = genre_counts[genre_counts < rare_threshold].index

    if len(rare_genres) > 0:
        log_message(f"Removing {len(rare_genres)} rare genres (< {min_frequency*100}% frequency)")
        genre_df = genre_df.drop(columns=rare_genres)

    df = df.drop(columns=[genre_col])
    df = pd.concat([df, genre_df], axis=1)

    log_message(f"✓ Created {genre_df.shape[1]} genre features")
    return df, vectorizer


def encode_mpaa_rating(df: pd.DataFrame, mpaa_col: str = 'MPAA_rating') -> pd.DataFrame:
    """Encode MPAA rating with one-hot encoding."""
    df = df.copy()
    if mpaa_col not in df.columns:
        log_message(f"MPAA column '{mpaa_col}' not found", level="WARNING")
        return df
    df[mpaa_col] = df[mpaa_col].fillna('NR')
    mpaa_dummies = pd.get_dummies(df[mpaa_col], prefix='mpaa')
    df = df.drop(columns=[mpaa_col])
    df = pd.concat([df, mpaa_dummies], axis=1)
    log_message(f"✓ Encoded MPAA rating into {mpaa_dummies.shape[1]} features")
    return df


def encode_distributor(df: pd.DataFrame,
                       dist_col: str = 'distributor',
                       min_count: int = 10) -> pd.DataFrame:
    """Encode distributor using frequency + one-hot."""
    df = df.copy()
    if dist_col not in df.columns:
        log_message(f"Distributor column '{dist_col}' not found", level="WARNING")
        return df
    df[dist_col] = df[dist_col].fillna('Unknown')
    dist_counts = df[dist_col].value_counts()
    rare_distributors = dist_counts[dist_counts < min_count].index
    df['distributor_grouped'] = df[dist_col].copy()
    df.loc[df['distributor_grouped'].isin(rare_distributors), 'distributor_grouped'] = 'Other'
    df['distributor_freq'] = df.groupby('distributor_grouped')['distributor_grouped'].transform('count') / len(df)
    dist_dummies = pd.get_dummies(df['distributor_grouped'], prefix='dist')
    df = df.drop(columns=[dist_col, 'distributor_grouped'])
    df = pd.concat([df, dist_dummies], axis=1)
    log_message(f"✓ Encoded distributor into {dist_dummies.shape[1]} features + frequency")
    return df


def create_interaction_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create key interaction features."""
    df = df.copy()
    if 'budget' in df.columns and 'opening_theaters' in df.columns:
        df['budget_per_theater'] = df['budget'] / (df['opening_theaters'] + 1)
        log_message("✓ Created budget_per_theater interaction")
    if 'release_days' in df.columns and 'opening_theaters' in df.columns:
        df['theater_days'] = df['release_days'] * df['opening_theaters']
        log_message("✓ Created theater_days interaction")
    return df


def engineer_all_features(df: pd.DataFrame, target_col: str = 'revenue') -> Tuple[pd.DataFrame, pd.Series, dict]:
    """Apply all feature engineering steps."""
    log_message("=" * 80)
    log_message("FEATURE ENGINEERING")
    log_message("=" * 80)

    metadata = {}
    y = df[target_col].copy()
    y_log = create_log_target(y)
    X = df.drop(columns=[target_col])

    if 'title' in X.columns:
        X = X.drop(columns=['title'])
    if 'release_date' in X.columns:
        X = extract_date_features(X, 'release_date')
    if 'genres' in X.columns:
        X, genre_vectorizer = process_genres(X, 'genres')
        metadata['genre_vectorizer'] = genre_vectorizer
    if 'MPAA_rating' in X.columns:
        X = encode_mpaa_rating(X, 'MPAA_rating')
    if 'distributor' in X.columns:
        X = encode_distributor(X, 'distributor')

    X = create_interaction_features(X)

    numeric_features = X.select_dtypes(include=[np.number]).columns.tolist()
    categorical_features = X.select_dtypes(include=['object']).columns.tolist()

    metadata['numeric_features'] = numeric_features
    metadata['categorical_features'] = categorical_features
    metadata['all_features'] = X.columns.tolist()

    log_message(f"✓ Feature engineering complete")
    log_message(f"  Total features: {X.shape[1]}")
    log_message(f"  Numeric features: {len(numeric_features)}")
    log_message(f"  Categorical features: {len(categorical_features)}")
    log_message("=" * 80)
    return X, y_log, metadata


def scale_features(X_train: pd.DataFrame,
                   X_val: pd.DataFrame = None,
                   numeric_features: List[str] = None) -> Tuple:
    """Scale numeric features using StandardScaler."""
    if numeric_features is None:
        numeric_features = X_train.select_dtypes(include=[np.number]).columns.tolist()
    scaler = StandardScaler()
    X_train_scaled = X_train.copy()
    X_train_scaled[numeric_features] = scaler.fit_transform(X_train[numeric_features])
    log_message(f"✓ Scaled {len(numeric_features)} numeric features")
    if X_val is not None:
        X_val_scaled = X_val.copy()
        X_val_scaled[numeric_features] = scaler.transform(X_val[numeric_features])
        return X_train_scaled, X_val_scaled, scaler
    return X_train_scaled, None, scaler


if __name__ == "__main__":
    from src.data_loader import load_data, create_sample_data
    from src.preprocess import clean_data, handle_missing_values
    from pathlib import Path

    sample_path = 'data/sample_boxoffice.csv'
    if not Path(sample_path).exists():
        create_sample_data(sample_path)

    df = load_data(sample_path)
    df = clean_data(df)
    df = handle_missing_values(df)
    X, y_log, metadata = engineer_all_features(df)

    print(f"\n✓ Feature engineering complete")
    print(f"Features shape: {X.shape}")
    print(f"Target (log) shape: {y_log.shape}")
    print(f"Target (log) range: [{y_log.min():.2f}, {y_log.max():.2f}]")
    print(f"\nFeature columns: {X.columns.tolist()}")
