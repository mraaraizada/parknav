import pandas as pd

def load_data(filepath: str) -> pd.DataFrame:
    """
    Load dataset from a CSV file and display info.
    """
    try:
        df = pd.read_csv(filepath)
        print(f"✅ Loaded data from: {filepath}")
        print(f"\nShape: {df.shape}\n")
        print(f"Columns: {list(df.columns)}\n")
        print("Preview:\n", df.head())
        return df
    except FileNotFoundError:
        print(f"❌ File not found: {filepath}")
    except pd.errors.EmptyDataError:
        print(f"❌ File is empty: {filepath}")
    except Exception as e:
        print(f"❌ Error loading data: {e}")
    return pd.DataFrame()

if __name__ == "__main__":
    # 🧩 Optional test run (edit path below as needed)
    test_path = "data/tmdb_5000_credits.csv"
    df = load_data(test_path)

import pandas as pd
import numpy as np

def create_sample_data(path: str):
    np.random.seed(42)
    data = {
        "title": [f"Movie {i}" for i in range(500)],
        "budget": np.random.randint(1_000_000, 200_000_000, 500),
        "popularity": np.random.uniform(1, 100, 500),
        "runtime": np.random.randint(80, 180, 500),
        "vote_average": np.random.uniform(4, 9, 500),
        "vote_count": np.random.randint(50, 5000, 500),
        "release_month": np.random.randint(1, 12, 500),
        "genres": np.random.choice(["Action", "Drama", "Comedy", "Horror", "Sci-Fi"], 500),
        "revenue": np.random.randint(1_000_000, 500_000_000, 500),
    }
    df = pd.DataFrame(data)
    df.to_csv(path, index=False)
    print(f"✅ Sample data created at {path}")
