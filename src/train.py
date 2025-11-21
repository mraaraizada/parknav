"""
Training script for box office prediction models.
"""
import argparse
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split
import joblib
import json

from src.data_loader import load_data, create_sample_data
from src.preprocess import clean_data, handle_missing_values
from src.features import engineer_all_features, scale_features
from src.models import BoxOfficePredictor, tune_xgboost, compare_models
from src.utils import (
    setup_directories, log_message, save_model, save_json,
    plot_predictions, calculate_metrics
)


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='Train box office prediction models')
    
    parser.add_argument('--data', type=str, default='data/boxoffice.csv',
                        help='Path to input data')
    parser.add_argument('--model', type=str, default='xgboost',
                        choices=['linear', 'ridge', 'lasso', 'xgboost', 'all'],
                        help='Model type to train')
    parser.add_argument('--tune', action='store_true',
                        help='Perform hyperparameter tuning (XGBoost only)')
    parser.add_argument('--n-trials', type=int, default=50,
                        help='Number of tuning trials')
    parser.add_argument('--test-size', type=float, default=0.1,
                        help='Validation set size')
    parser.add_argument('--random-state', type=int, default=42,
                        help='Random seed')
    parser.add_argument('--create-sample', action='store_true',
                        help='Create sample data if file not found')
    
    return parser.parse_args()


def load_and_preprocess_data(data_path: str, create_sample: bool = False):
    """Load and preprocess data."""
    log_message("=" * 80)
    log_message("STEP 1: LOADING AND PREPROCESSING DATA")
    log_message("=" * 80)
    
    # Check if file exists
    if not Path(data_path).exists():
        if create_sample:
            log_message(f"Data file not found. Creating sample data at {data_path}")
            create_sample_data(data_path)
        else:
            raise FileNotFoundError(f"Data file not found: {data_path}")
    
    # Load data
    df = load_data(data_path)
    df = clean_data(df)
    df = handle_missing_values(df)
    
    # Engineer features
    X, y_log, metadata = engineer_all_features(df)
    
    log_message("✓ Data preprocessing complete")
    log_message(f"  Final shape: {X.shape}")
    log_message(f"  Features: {X.shape[1]}")
    log_message(f"  Samples: {X.shape[0]}")
    
    return X, y_log, metadata


def train_single_model(model_type: str, 
                       X_train, y_train, 
                       X_val, y_val,
                       tune: bool = False,
                       n_trials: int = 50,
                       random_state: int = 42):
    """Train a single model."""
    log_message("=" * 80)
    log_message(f"TRAINING {model_type.upper()} MODEL")
    log_message("=" * 80)
    
    best_params = {}
    if tune and model_type == 'xgboost':
        tuning_results = tune_xgboost(
            X_train, y_train, X_val, y_val,
            n_trials=n_trials,
            random_state=random_state
        )
        best_params = tuning_results['best_params']
        save_json(best_params, f'outputs/reports/{model_type}_best_params.json')
    
    model = BoxOfficePredictor(model_type, **best_params)
    
    if model_type == 'xgboost':
        model.fit(X_train, y_train, X_val, y_val)
    else:
        model.fit(X_train, y_train)
    
    # Evaluate
    train_metrics = model.evaluate(X_train, y_train, "Training")
    val_metrics = model.evaluate(X_val, y_val, "Validation")
        # Evaluate
    train_metrics = model.evaluate(X_train, y_train, "Training")
    val_metrics = model.evaluate(X_val, y_val, "Validation")

    # ------------------------------------------------------------
    # Cross-validation using scikit-learn
    # ------------------------------------------------------------
    from sklearn.model_selection import cross_validate

    scoring = {
        'r2': 'r2',
        'neg_mae': 'neg_mean_absolute_error',
        'neg_rmse': 'neg_root_mean_squared_error'
    }

    cv_results = cross_validate(
        model.model,  # access the underlying sklearn/xgboost model
        X_train,
        y_train,
        cv=5,
        scoring=scoring,
        return_train_score=False
    )

    cv_summary = {
        'mae': float(-cv_results['test_neg_mae'].mean()),
        'rmse': float(-cv_results['test_neg_rmse'].mean()),
        'r2': float(cv_results['test_r2'].mean()),
        'mae_std': float(cv_results['test_neg_mae'].std()),
        'rmse_std': float(cv_results['test_neg_rmse'].std()),
        'r2_std': float(cv_results['test_r2'].std())
    }

    print("\n[INFO] Cross-validation summary:")
    print(f"  MAE  = {cv_summary['mae']:.4f} ± {cv_summary['mae_std']:.4f}")
    print(f"  RMSE = {cv_summary['rmse']:.4f} ± {cv_summary['rmse_std']:.4f}")
    print(f"  R²   = {cv_summary['r2']:.4f} ± {cv_summary['r2_std']:.4f}")

    # ------------------------------------------------------------
    # Save model and metrics
    # ------------------------------------------------------------
    model_path = f'outputs/models/{model_type}_model.joblib'
    save_model(model, model_path)

    metrics_data = {
        'train': train_metrics,
        'validation': val_metrics,
        'cv_mean': {
            'mae': cv_summary['mae'],
            'rmse': cv_summary['rmse'],
            'r2': cv_summary['r2']
        },
        'cv_std': {
            'mae': cv_summary['mae_std'],
            'rmse': cv_summary['rmse_std'],
            'r2': cv_summary['r2_std']
        }
    }
    save_json(metrics_data, f'outputs/reports/{model_type}_metrics.json')

    
    # Plot predictions
    y_val_pred = model.predict(X_val, return_dollars=False)
    plot_predictions(
        y_val, y_val_pred,
        title=f'{model_type.upper()} - Predictions vs Actual',
        log_scale=True,
        save_path=f'outputs/figures/{model_type}_predictions.png'
    )
    
    # Feature importance
    try:
        feature_imp = model.plot_feature_importance(
            top_n=20,
            save_path=f'outputs/figures/{model_type}_feature_importance.png'
        )
        if feature_imp is not None:
            feature_imp.to_csv(f'outputs/reports/{model_type}_feature_importance.csv', index=False)
    except Exception as e:
        print(f"[WARNING] Could not create feature importance plot: {e}")

    
    # SHAP plots for XGBoost
    if model_type == 'xgboost':
        try:
            X_val_sample = X_val.sample(min(500, len(X_val)), random_state=random_state)
            model.plot_shap_summary(
                X_val_sample,
                save_path=f'outputs/figures/{model_type}_shap_summary.png'
            )
        except Exception as e:
            log_message(f"Could not create SHAP plot: {e}", level="WARNING")
    
    return model, metrics_data


def train_all_models(X_train, y_train, X_val, y_val, X_train_scaled, X_val_scaled):
    """Train all models and compare."""
    log_message("=" * 80)
    log_message("TRAINING ALL MODELS")
    log_message("=" * 80)
    
    models = {}
    
    # Linear models (scaled)
    for model_type in ['linear', 'ridge', 'lasso']:
        log_message(f"\nTraining {model_type}...")
        model = BoxOfficePredictor(model_type)
        model.fit(X_train_scaled, y_train)
        models[model_type] = model
        save_model(model, f'outputs/models/{model_type}_model.joblib')
    
    # XGBoost (unscaled)
    log_message("\nTraining XGBoost...")
    xgb_model = BoxOfficePredictor('xgboost')
    xgb_model.fit(X_train, y_train, X_val, y_val, early_stopping_rounds=10)
    models['xgboost'] = xgb_model
    save_model(xgb_model, 'outputs/models/xgboost_model.joblib')
    
    # Compare models
    models_for_comparison = {
        'Linear': models['linear'],
        'Ridge': models['ridge'],
        'Lasso': models['lasso'],
        'XGBoost': models['xgboost']
    }
    
    results = []
    for name, model in models_for_comparison.items():
        if name == 'XGBoost':
            X_train_use, X_val_use = X_train, X_val
        else:
            X_train_use, X_val_use = X_train_scaled, X_val_scaled
        
        y_train_pred = model.predict(X_train_use, return_dollars=False)
        train_metrics = calculate_metrics(y_train, y_train_pred, log_scale=True)
        y_val_pred = model.predict(X_val_use, return_dollars=False)
        val_metrics = calculate_metrics(y_val, y_val_pred, log_scale=True)
        
        results.append({
            'Model': name,
            'Train_MAE': train_metrics['MAE'],
            'Val_MAE': val_metrics['MAE'],
            'Train_RMSE': train_metrics['RMSE'],
            'Val_RMSE': val_metrics['RMSE'],
            'Train_R2': train_metrics['R2'],
            'Val_R2': val_metrics['R2'],
            'Val_MAE_dollars': val_metrics['MAE_dollars'],
            'Val_RMSE_dollars': val_metrics['RMSE_dollars']
        })
    
    results_df = pd.DataFrame(results)
    
    print("\n" + "=" * 100)
    print("MODEL COMPARISON")
    print("=" * 100)
    print(results_df.to_string(index=False))
    print("=" * 100 + "\n")
    
    results_df.to_csv('outputs/reports/model_comparison.csv', index=False)
    return models


def main():
    """Main training function."""
    args = parse_args()
    setup_directories()
    
    # Load and preprocess
    X, y_log, metadata = load_and_preprocess_data(args.data, create_sample=args.create_sample)
    
    log_message("=" * 80)
    log_message("STEP 2: SPLITTING DATA")
    log_message("=" * 80)
    
    X_train, X_val, y_train, y_val = train_test_split(
        X, y_log,
        test_size=args.test_size,
        random_state=args.random_state
    )
    
    log_message(f"Training set: {X_train.shape}")
    log_message(f"Validation set: {X_val.shape}")
    
    X_train_scaled, X_val_scaled, scaler = scale_features(
        X_train, X_val,
        numeric_features=metadata['numeric_features']
    )
    save_model(scaler, 'outputs/models/scaler.joblib')

    # ✅ Properly indented metadata serialization
    if "genre_vectorizer" in metadata:
        vectorizer = metadata["genre_vectorizer"]
        metadata["genre_vectorizer"] = {
            "vocabulary_size": len(vectorizer.vocabulary_),
            "analyzer": str(vectorizer.analyzer),
            "ngram_range": vectorizer.ngram_range
        }

    save_json(metadata, 'outputs/models/metadata.json')
    
    log_message("=" * 80)
    log_message("STEP 3: TRAINING MODELS")
    log_message("=" * 80)
    
    if args.model == 'all':
        train_all_models(X_train, y_train, X_val, y_val, X_train_scaled, X_val_scaled)
    else:
        X_train_use = X_train_scaled if args.model in ['linear', 'ridge', 'lasso'] else X_train
        X_val_use = X_val_scaled if args.model in ['linear', 'ridge', 'lasso'] else X_val
        
        model, metrics = train_single_model(
            args.model, X_train_use, y_train, X_val_use, y_val,
            tune=args.tune, n_trials=args.n_trials, random_state=args.random_state
        )
        
        pipeline = {
            'model': model,
            'scaler': scaler,
            'metadata': metadata
        }
        save_model(pipeline, f'outputs/models/pipeline_{args.model}.joblib')
    
    log_message("=" * 80)
    log_message("TRAINING COMPLETE!")
    log_message("=" * 80)
    log_message("\nOutputs saved to:")
    log_message("  - outputs/models/ (trained models)")
    log_message("  - outputs/figures/ (plots)")
    log_message("  - outputs/reports/ (metrics and reports)")


if __name__ == "__main__":
    main()
