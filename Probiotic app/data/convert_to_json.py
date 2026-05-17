import pandas as pd
import json
import os

# Get script directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# File paths
excel_path = os.path.join(script_dir, "Probiotic App.xlsx")
output_path = os.path.join(script_dir, "probiotic_db_clean.json")

try:
    print("📂 Looking for file at:", excel_path)

    # Load Excel
    df = pd.read_excel(excel_path)
    print("Shape of data:", df.shape)
    print("Columns:", df.columns.tolist())
    print(df.head())

    # Clean column names
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

    print("📊 Columns found:", df.columns.tolist())

    # Rename columns safely (handles variations)
    df = df.rename(columns={
        "food_sources": "food_source",
        "foodsource": "food_source",
        "food": "food_source",
        "disease": "disorder",
        "condition": "disorder",
        "articles": "article",
        "reference": "article"
    })

    # Check required columns
    required_cols = ["disorder", "probiotic", "food_source"]
    for col in required_cols:
        if col not in df.columns:
            raise Exception(f"❌ Missing required column: {col}")

    cleaned_data = []

    for _, row in df.iterrows():
        # Handle food sources safely
        raw_food = "" if pd.isna(row["food_source"]) else str(row["food_source"])
        food_sources = [f.strip() for f in raw_food.split(",") if f.strip()]

        cleaned_data.append({
            "disease": "" if pd.isna(row["disorder"]) else str(row["disorder"]).strip(),
            "probiotic": "" if pd.isna(row["probiotic"]) else str(row["probiotic"]).strip(),
            "food_sources": food_sources,
            "evidence": "" if pd.isna(row.get("article")) else str(row.get("article")).strip()
        })

    # Save JSON
    with open(output_path, "w") as f:
        json.dump(cleaned_data, f, indent=4)

    print(f"\n✅ Clean JSON ready at:\n{output_path}")

except FileNotFoundError:
    print(f"❌ File not found: {excel_path}")
    print("➡️ Make sure Excel file is in the SAME folder as this script")

except Exception as e:
    print("⚠️ Error:", str(e))