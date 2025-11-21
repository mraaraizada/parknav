import pandas as pd
import os
from src.data_loader import load_data


def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Perform basic preprocessing on the movie credits dataset.
    """
    print("\n--- Starting Preprocessing ---")

    # Handle missing values
    df.fillna("", inplace=True)

    # Clean column names
    df.columns = df.columns.str.strip().str.lower()

    # Show some stats
    print(f"✅ After cleaning: {df.shape[0]} rows, {df.shape[1]} columns")
    print(f"Columns: {list(df.columns)}")

    return df


if __name__ == "__main__":
    # Define input and output paths
    input_path = os.path.join("data", "tmdb_5000_credits.csv")
    output_path = os.path.join("data", "tmdb_5000_credits_clean.csv")

    # Load and preprocess
    df = load_data(input_path)
    if not df.empty:
        df_clean = preprocess_data(df)
        df_clean.to_csv(output_path, index=False)
        print(f"\n✅ Cleaned data saved to: {output_path}")
    else:
        print("❌ Preprocessing skipped: could not load data.")

import ast
import pandas as pd
from src.data_loader import load_data


import ast
import pandas as pd
from src.data_loader import load_data


def prepare_for_modeling(df: pd.DataFrame) -> pd.DataFrame:
    """
    Prepares the movie credits dataset for modeling by extracting key features.
    """
    print("\n--- Starting Feature Engineering ---")

    required_cols = {'cast', 'crew', 'title'}
    if not required_cols.issubset(df.columns):
        print(f"❌ Missing columns. Expected: {required_cols}")
        return pd.DataFrame()

    def parse_json(x):
        import ast
        try:
            return ast.literal_eval(x)
        except:
            return []

    df["cast_parsed"] = df["cast"].apply(parse_json)
    df["top_cast"] = df["cast_parsed"].apply(lambda x: [i["name"] for i in x[:3]] if isinstance(x, list) else [])

    df["crew_parsed"] = df["crew"].apply(parse_json)
    df["director"] = df["crew_parsed"].apply(
        lambda x: next((i["name"] for i in x if i.get("job") == "Director"), None)
    )

    df.drop(["cast_parsed", "crew_parsed"], axis=1, inplace=True)

    print("✅ Feature engineering completed!")
    print("\nColumns now available:", df.columns.tolist())
    return df
