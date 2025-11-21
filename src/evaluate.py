"""
Evaluation script for trained models.
"""
import argparse
import pandas as pd
import numpy as np
from pathlib import Path
import json

from src.utils import (
    load_model, log_message, plot_predictions, 
    plot_residuals, calculate_metrics, print_metrics_report,
    format_currency
)


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='Evaluate trained models')
    
    parser.add_argument('--model-path', type=str, 
                       default='outputs/models/xgboost_model.joblib',
                       help='Path to trained model')
    parser.add_argument('--data', type=str, default='data/boxoffice.csv',
                       help='Path to evaluation data')
    parser.add_argument('--output-dir', type=str, default='outputs/reports',
                       help='Directory for evaluation outputs')
    
    return parser.parse_args()


def evaluate_model_comprehensive(model, X, y_true, dataset_name="Dataset"):
    """
    Comprehensive model evaluation with multiple visualizations.
    
    Args:
        model: Trained model
        X: Features
        y_true: True target values (log-scale)
        dataset_name: Name for outputs
        
    Returns:
        Dictionary of metrics
    """
    log_message("="*80)
    log_message(f"EVALUATING: {dataset_name}")
    log_message("="*80)
    
    # Make predictions
    y_pred = model.predict(X, return_dollars=False)
    
    # Calculate metrics
    metrics = calculate_metrics(y_true, y_pred, log_scale=True)
    print_metrics_report(metrics, dataset_name)
    
    # Predictions plot
    plot_predictions(
        y_true, y_pred,
        title=f'{dataset_name} - Predictions vs Actual',
        log_scale=True,
        save_path=f'outputs/figures/{dataset_name.lower()}_predictions_detailed.png'
    )
    
    # Residuals plot
    plot_residuals(
        y_true, y_pred,
        save_path=f'outputs/figures/{dataset_name.lower()}_residuals.png'
    )
    
    # Error analysis
    y_true_dollars = 10 ** y_true
    y_pred_dollars = 10 ** y_pred
    
    errors_dollars = y_pred_dollars - y_true_dollars
    pct_errors = ((y_pred_dollars - y_true_dollars) / y_true_dollars) * 100
    
    print("\nError Analysis (in dollars):")
    print(f"  Mean Error: {format_currency(errors_dollars.mean())}")
    print(f"  Median Error: {format_currency(np.median(errors_dollars))}")
    print(f"  Mean Absolute Error: {format_currency(np.abs(errors_dollars).mean())}")
    print(f"  Max Overestimation: {format_currency(errors_dollars.max())}")
    print(f"  Max Underestimation: {format_currency(errors_dollars.min())}")
    
    print("\nPercentage Error Analysis:")
    print(f"  Mean Absolute Percentage Error: {np.abs(pct_errors).mean():.2f}%")
    print(f"  Median Absolute Percentage Error: {np.median(np.abs(pct_errors)):.2f}%")
    print(f"  Predictions within 20%: {(np.abs(pct_errors) < 20).mean()*100:.1f}%")
    print(f"  Predictions within 50%: {(np.abs(pct_errors) < 50).mean()*100:.1f}%")
    
    # Best and worst predictions
    error_df = pd.DataFrame({
        'true_revenue': y_true_dollars,
        'pred_revenue': y_pred_dollars,
        'error': errors_dollars,
        'pct_error': pct_errors,
        'abs_pct_error': np.abs(pct_errors)
    })
    
    print("\nTop 5 Best Predictions (lowest % error):")
    print(error_df.nsmallest(5, 'abs_pct_error')[['true_revenue', 'pred_revenue', 'pct_error']])
    
    print("\nTop 5 Worst Predictions (highest % error):")
    print(error_df.nlargest(5, 'abs_pct_error')[['true_revenue', 'pred_revenue', 'pct_error']])
    
    return metrics, error_df


def generate_evaluation_report(metrics_dict, model_name, save_path):
    """
    Generate a comprehensive evaluation report.
    
    Args:
        metrics_dict: Dictionary of metrics from different datasets
        model_name: Name of the model
        save_path: Path to save report
    """
    report_lines = []
    report_lines.append("="*80)
    report_lines.append(f"MODEL EVALUATION REPORT: {model_name}")
    report_lines.append("="*80)
    report_lines.append("")
    
    for dataset_name, metrics in metrics_dict.items():
        report_lines.append(f"\n{dataset_name} Metrics:")
        report_lines.append("-"*80)
        
        for metric_name, value in metrics.items():
            if 'dollars' in metric_name.lower():
                report_lines.append(f"  {metric_name:25s}: ${value:,.2f}")
            elif 'MAPE' in metric_name:
                report_lines.append(f"  {metric_name:25s}: {value:.2f}%")
            else:
                report_lines.append(f"  {metric_name:25s}: {value:.4f}")
    
    report_lines.append("\n" + "="*80)
    
    report_text = "\n".join(report_lines)
    
    # Print to console
    print(report_text)
    
    # Save to file
    with open(save_path, 'w') as f:
        f.write(report_text)
    
    log_message(f"Evaluation report saved to {save_path}")


def load_and_evaluate(model_path, data_path=None, X_test=None, y_test=None):
    """
    Load model and evaluate on test data.
    
    Args:
        model_path: Path to saved model
        data_path: Path to test data (optional if X_test, y_test provided)
        X_test: Test features (optional if data_path provided)
        y_test: Test target (optional if data_path provided)
        
    Returns:
        Evaluation metrics
    """
    # Load model
    log_message(f"Loading model from {model_path}")
    model = load_model(model_path)
    
    # Load test data if needed
    if X_test is None or y_test is None:
        if data_path is None:
            raise ValueError("Either provide data_path or X_test/y_test")
        
        log_message(f"Loading test data from {data_path}")
        # Note: This assumes data is already preprocessed
        # In practice, you'd need to apply the same preprocessing pipeline
        from src.data_loader import load_data
        from src.preprocess import clean_data, handle_missing_values
        from src.features import engineer_all_features
        
        df = load_data(data_path)
        df = clean_data(df)
        df = handle_missing_values(df)
        X, y_log, _ = engineer_all_features(df)
        
        X_test = X
        y_test = y_log
    
    # Evaluate
    metrics, error_df = evaluate_model_comprehensive(model, X_test, y_test, "Test Set")
    
    return metrics, error_df


def compare_saved_models(model_dir='outputs/models', X_test=None, y_test=None):
    """
    Load and compare all saved models.
    
    Args:
        model_dir: Directory containing saved models
        X_test: Test features
        y_test: Test target (log-scale)
        
    Returns:
        Comparison dataframe
    """
    model_files = list(Path(model_dir).glob('*_model.joblib'))
    
    if len(model_files) == 0:
        log_message("No model files found", level="WARNING")
        return None
    
    log_message(f"Found {len(model_files)} models to compare")
    
    results = []
    
    for model_file in model_files:
        model_name = model_file.stem.replace('_model', '')
        log_message(f"\nEvaluating {model_name}...")
        
        try:
            model = load_model(str(model_file))
            
            # Determine if model needs scaled data
            if model_name in ['linear', 'ridge', 'lasso']:
                # Load scaler
                scaler_path = Path(model_dir) / 'scaler.joblib'
                if scaler_path.exists():
                    scaler = load_model(str(scaler_path))
                    metadata_path = Path(model_dir) / 'metadata.json'
                    with open(metadata_path, 'r') as f:
                        metadata = json.load(f)
                    
                    X_test_use = X_test.copy()
                    X_test_use[metadata['numeric_features']] = scaler.transform(
                        X_test[metadata['numeric_features']]
                    )
                else:
                    X_test_use = X_test
            else:
                X_test_use = X_test
            
            metrics = model.evaluate(X_test_use, y_test, model_name)
            
            results.append({
                'Model': model_name,
                'MAE_log': metrics['MAE'],
                'RMSE_log': metrics['RMSE'],
                'R2': metrics['R2'],
                'MAE_dollars': metrics['MAE_dollars'],
                'RMSE_dollars': metrics['RMSE_dollars'],
                'MAPE': metrics.get('MAPE', np.nan)
            })
            
        except Exception as e:
            log_message(f"Error evaluating {model_name}: {e}", level="ERROR")
    
    if len(results) > 0:
        results_df = pd.DataFrame(results)
        results_df = results_df.sort_values('MAE_dollars')
        
        print("\n" + "="*100)
        print("MODEL COMPARISON ON TEST SET")
        print("="*100)
        print(results_df.to_string(index=False))
        print("="*100 + "\n")
        
        # Save comparison
        results_df.to_csv('outputs/reports/test_set_comparison.csv', index=False)
        
        return results_df
    
    return None


def main():
    """Main evaluation function."""
    args = parse_args()
    
    # Ensure output directory exists
    Path(args.output_dir).mkdir(parents=True, exist_ok=True)
    
    # Load and evaluate model
    metrics, error_df = load_and_evaluate(
        args.model_path,
        args.data
    )
    
    # Save detailed error analysis
    error_df.to_csv(
        f'{args.output_dir}/error_analysis.csv',
        index=False
    )
    
    # Generate report
    generate_evaluation_report(
        {'Test Set': metrics},
        args.model_path,
        f'{args.output_dir}/evaluation_report.txt'
    )
    
    log_message("\n✓ Evaluation complete!")


if __name__ == "__main__":
    main()