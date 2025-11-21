# src/utils.py

import os
import json
import joblib
import matplotlib.pyplot as plt


def setup_directories():
    """
    Create necessary folders for models, reports, and figures.
    """
    directories = [
        "outputs/models",
        "outputs/reports",
        "outputs/figures",
        "data",
    ]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
    print("✅ All directories are set up successfully!")


def save_json(data, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
    print(f"💾 Saved report to {path}")


def save_model(model, path):
    joblib.dump(model, path)
    print(f"💾 Model saved at {path}")


def plot_feature_importance(model, feature_names, output_path):
    """
    Plot and save feature importance for XGBoost or any model with feature_importances_.
    """
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
        plt.figure(figsize=(10, 6))
        plt.barh(feature_names, importances)
        plt.xlabel("Importance")
        plt.ylabel("Features")
        plt.title("Feature Importance")
        plt.tight_layout()
        plt.savefig(output_path)
        print(f"📊 Feature importance saved at {output_path}")
        plt.close()


def log_message(message, level="INFO"):
    """Logs a message with a given level (INFO, WARNING, ERROR)."""
    prefix = f"[{level.upper()}]"
    print(f"{prefix} {message}")


import matplotlib.pyplot as plt

def plot_predictions(y_true, y_pred, title=None, log_scale=False, save_path=None):
    import matplotlib.pyplot as plt
    import numpy as np
    import os

    plt.figure(figsize=(6, 6))
    plt.scatter(y_true, y_pred, alpha=0.6, edgecolors='k')

    # Plot diagonal line
    min_val, max_val = min(y_true.min(), y_pred.min()), max(y_true.max(), y_pred.max())
    plt.plot([min_val, max_val], [min_val, max_val], 'r--', lw=2)

    plt.xlabel("Actual Revenue (log scale)" if log_scale else "Actual Revenue")
    plt.ylabel("Predicted Revenue (log scale)" if log_scale else "Predicted Revenue")
    plt.title(title if title else "Predictions vs Actual")
    plt.grid(True)
    plt.tight_layout()

    # Save or show
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path)
        plt.close()
        print(f"💾 Saved prediction plot at: {save_path}")
    else:
        plt.show()


from sklearn.metrics import mean_squared_error, r2_score
import numpy as np
import json

def calculate_metrics(y_true, y_pred, output_path=None):
    """
    Calculate and optionally save model performance metrics.
    """
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)

    metrics = {
        "RMSE": round(rmse, 4),
        "R2_Score": round(r2, 4)
    }

    if output_path:
        with open(output_path, "w") as f:
            json.dump(metrics, f, indent=4)
        print(f"📊 Metrics saved at {output_path}")

    return metrics


