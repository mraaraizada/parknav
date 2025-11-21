from src.data_loader import load_data
import pandas as pd

# --- Step 1: Load both datasets ---
credits_path = r"C:\Drive\College\2nd year\movie_boxoffice_predication\data\tmdb_5000_credits.csv"
movies_path = r"C:\Drive\College\2nd year\movie_boxoffice_predication\data\tmdb_5000_movies.csv"

credits_df = load_data(credits_path)
movies_df = load_data(movies_path)

if credits_df.empty or movies_df.empty:
    print("⚠️ Dataset(s) could not be loaded. Check file path or format.")
else:
    print("\n✅ Both datasets loaded successfully!")

    # --- Step 2: Merge both datasets ---
    print("\n🔄 Merging datasets on 'title' column...")
    df = movies_df.merge(credits_df, on='title')

    print(f"\n✅ Merged dataset shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")

    # --- Step 3: Quick check ---
    print("\nPreview:")
    print(df.head())

    # --- Step 4: Save the merged dataset ---
    merged_path = r"C:\Drive\College\2nd year\movie_boxoffice_predication\data\merged_tmdb.csv"
    df.to_csv(merged_path, index=False)
    print(f"\n💾 Merged dataset saved at: {merged_path}")
