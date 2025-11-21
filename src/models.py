import os
import joblib
import numpy as np
import shap
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import KFold
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb


class BoxOfficePredictor:
    def __init__(self, model_type="xgboost", **kwargs):
        """Initialize model based on chosen type"""
        self.model_type = model_type
        self.params = kwargs

        if model_type == "xgboost":
            self.model = xgb.XGBRegressor(**kwargs)
        elif model_type == "linear_regression":
            self.model = LinearRegression(**kwargs)
        elif model_type == "random_forest":
            self.model = RandomForestRegressor(**kwargs)
        else:
            raise ValueError(f"Unsupported model type: {model_type}")

    def fit(self, X_train, y_train, X_val=None, y_val=None, **kwargs):
        """Train model with optional validation data"""
        if self.model_type == "xgboost" and X_val is not None and y_val is not None:
            self.model.fit(
                X_train,
                y_train,
                eval_set=[(X_val, y_val)],
                verbose=False,
                **kwargs
            )
        else:
            self.model.fit(X_train, y_train)

    def predict(self, X_test, return_dollars=False):
        """Generate predictions"""
        preds = self.model.predict(X_test)
        if return_dollars:
            preds = np.expm1(preds)
        return preds

    def evaluate(self, X, y_true, dataset_name=None):
        """Compute evaluation metrics"""
        y_pred = self.predict(X)
        mae = mean_absolute_error(y_true, y_pred)
        rmse = mean_squared_error(y_true, y_pred, squared=False)
        r2 = r2_score(y_true, y_pred)

        if dataset_name:
            print(f"📊 {dataset_name} -> MAE: {mae:.4f}, RMSE: {rmse:.4f}, R²: {r2:.4f}")

        return {"MAE": mae, "RMSE": rmse, "R2": r2}

    def save(self, path):
        """Save trained model"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.model, path)

    def load(self, path):
        """Load trained model"""
        self.model = joblib.load(path)

    def plot_feature_importance(self, feature_names, save_path=None, top_n=20):
        """Plot feature importance"""
        if hasattr(self.model, "feature_importances_"):
            importances = self.model.feature_importances_
            indices = np.argsort(importances)[::-1][:top_n]

            plt.figure(figsize=(8, 6))
            plt.barh(np.array(feature_names)[indices][::-1],
                     importances[indices][::-1])
            plt.title("Feature Importance")
            plt.xlabel("Importance Score")
            plt.tight_layout()

            if save_path:
                plt.savefig(save_path)
                print(f"💾 Saved feature importance plot: {save_path}")
            plt.close()
        else:
            print("[⚠️] Model has no feature_importances_ attribute.")

    def plot_shap_summary(self, X, save_path=None):
        """Generate SHAP summary plot"""
        try:
            explainer = shap.Explainer(self.model, X)
            shap_values = explainer(X)
            shap.summary_plot(shap_values, X, show=False)

            if save_path:
                plt.savefig(save_path, bbox_inches="tight")
                print(f"💾 Saved SHAP summary plot: {save_path}")
            plt.close()
        except Exception as e:
            print(f"[⚠️] Could not generate SHAP plot: {e}")

    def cross_validate(self, X, y, cv=5):
        """Perform K-Fold cross-validation"""
        kf = KFold(n_splits=cv, shuffle=True, random_state=42)

        mae_scores, rmse_scores, r2_scores = [], [], []

        for fold, (train_idx, val_idx) in enumerate(kf.split(X), 1):
            X_tr, X_val = X.iloc[train_idx], X.iloc[val_idx]
            y_tr, y_val = y.iloc[train_idx], y.iloc[val_idx]

            self.model.fit(X_tr, y_tr)
            preds = self.model.predict(X_val)

            mae = mean_absolute_error(y_val, preds)
            rmse = np.sqrt(mean_squared_error(y_val, preds))
            r2 = r2_score(y_val, preds)

            mae_scores.append(mae)
            rmse_scores.append(rmse)
            r2_scores.append(r2)

            print(f"[Fold {fold}/{cv}] MAE={mae:.4f}, RMSE={rmse:.4f}, R²={r2:.4f}")

        print("\n[✅ Cross-validation Summary]")
        print(f"MAE  = {np.mean(mae_scores):.4f} ± {np.std(mae_scores):.4f}")
        print(f"RMSE = {np.mean(rmse_scores):.4f} ± {np.std(rmse_scores):.4f}")
        print(f"R²   = {np.mean(r2_scores):.4f} ± {np.std(r2_scores):.4f}")

        return {
            "MAE_mean": np.mean(mae_scores),
            "RMSE_mean": np.mean(rmse_scores),
            "R2_mean": np.mean(r2_scores),
            "MAE_std": np.std(mae_scores),
            "RMSE_std": np.std(rmse_scores),
            "R2_std": np.std(r2_scores)
        }


    # --------------------------
    # 💾 Save / Load
    # --------------------------
    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.model, path)

    def load(self, path):
        self.model = joblib.load(path)

    # --------------------------
    # 🌳 Visualization Tools
    # --------------------------
    def plot_feature_importance(self, feature_names, save_path=None, top_n=20):
        """Plot feature importance for XGBoost or tree-based models."""
        if hasattr(self.model, "feature_importances_"):
            importances = self.model.feature_importances_
            indices = np.argsort(importances)[::-1][:top_n]
            plt.figure(figsize=(8, 6))
            plt.barh(np.array(feature_names)[indices][::-1],
                     importances[indices][::-1])
            plt.title("Feature Importance")
            plt.xlabel("Importance Score")
            plt.tight_layout()
            if output_path:
                plt.savefig(output_path)
                print(f"💾 Saved feature importance plot at: {output_path}")
            plt.close()
        else:
            print("[WARNING] Model has no feature_importances_ attribute.")

    def plot_shap_summary(self, X, save_path=None):
        """Generate SHAP summary plot if model supports SHAP."""
        try:
            explainer = shap.Explainer(self.model, X)
            shap_values = explainer(X)
            shap.summary_plot(shap_values, X, show=False)
            if output_path:
                plt.savefig(output_path, bbox_inches="tight")
                print(f"💾 Saved SHAP summary plot at: {output_path}")
            plt.close()
        except Exception as e:
            print(f"[WARNING] Could not generate SHAP plot: {e}")

    # --------------------------
    # 🔁 Cross-Validation
    # --------------------------
    def cross_validate(self, X, y, cv=5):
        from sklearn.model_selection import KFold
        kf = KFold(n_splits=cv, shuffle=True, random_state=42)

        mae_scores, rmse_scores, r2_scores = [], [], []
        fold = 1

        for train_idx, val_idx in kf.split(X):
            X_tr, X_val = X.iloc[train_idx], X.iloc[val_idx]
            y_tr, y_val = y.iloc[train_idx], y.iloc[val_idx]

            self.model.fit(X_tr, y_tr)
            preds = self.model.predict(X_val)

            mae = mean_absolute_error(y_val, preds)
            rmse = np.sqrt(mean_squared_error(y_val, preds))
            r2 = r2_score(y_val, preds)

            mae_scores.append(mae)
            rmse_scores.append(rmse)
            r2_scores.append(r2)

            print(f"\n[INFO] Fold {fold}/{cv}: MAE={mae:.4f}, RMSE={rmse:.4f}, R²={r2:.4f}")
            fold += 1

        print("\n[INFO] Cross-validation summary:")
        print(f"  MAE  = {np.mean(mae_scores):.4f} ± {np.std(mae_scores):.4f}")
        print(f"  RMSE = {np.mean(rmse_scores):.4f} ± {np.std(rmse_scores):.4f}")
        print(f"  R²   = {np.mean(r2_scores):.4f} ± {np.std(r2_scores):.4f}")

        return {
            "MAE_mean": np.mean(mae_scores),
            "RMSE_mean": np.mean(rmse_scores),
            "R2_mean": np.mean(r2_scores),
            "MAE_std": np.std(mae_scores),
            "RMSE_std": np.std(rmse_scores),
            "R2_std": np.std(r2_scores)
        }


# -------------------------
# 🔍 Optional: Model Comparison
# -------------------------
def compare_models(X_train, X_test, y_train, y_test):
    results = {}
    for name in ["linear", "random_forest", "gradientboosting", "xgboost"]:
        model = BoxOfficePredictor(name)
        model.train(X_train, y_train)
        results[name] = model.evaluate(X_test, y_test)
    return results


# -------------------------
# 🧠 Optional: Hyperparameter Tuning
# -------------------------
def tune_xgboost(X_train, y_train, X_test, y_test, n_trials=20):
    import optuna

    def objective(trial):
        params = {
            "n_estimators": trial.suggest_int("n_estimators", 100, 500),
            "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3),
            "max_depth": trial.suggest_int("max_depth", 3, 10),
            "subsample": trial.suggest_float("subsample", 0.5, 1.0),
            "colsample_bytree": trial.suggest_float("colsample_bytree", 0.5, 1.0),
        }

        model = XGBRegressor(**params, random_state=42)
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        return rmse

    study = optuna.create_study(direction="minimize")
    study.optimize(objective, n_trials=n_trials)
    print("✅ Best params:", study.best_params)
    return study.best_params
