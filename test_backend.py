"""
Quick test script to verify the backend works
"""
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / 'backend'))

from backend.main import load_model_pipeline, prepare_input_features

print("=" * 60)
print("Testing Backend Components")
print("=" * 60)

# Test 1: Load model
print("\n1. Testing model loading...")
success = load_model_pipeline()
if success:
    print("   ✅ Model loaded successfully!")
else:
    print("   ❌ Model loading failed!")
    sys.exit(1)

# Test 2: Prepare features
print("\n2. Testing feature preparation...")
test_input = {
    'title': 'Test Movie',
    'budget': 50000000,
    'opening_theaters': 3000,
    'release_days': 90,
    'mpaa_rating': 'PG-13',
    'genres': ['Action', 'Adventure'],
    'distributor': 'Universal',
    'release_month': 6,
    'release_dayofweek': 4,
}

try:
    from backend.main import metadata
    features = prepare_input_features(test_input, metadata)
    print(f"   ✅ Features prepared! Shape: {features.shape}")
except Exception as e:
    print(f"   ❌ Feature preparation failed: {e}")
    sys.exit(1)

# Test 3: Make prediction
print("\n3. Testing prediction...")
try:
    from backend.main import model
    if hasattr(model, 'predict'):
        prediction_log = model.predict(features)[0]
        prediction_dollars = 10 ** prediction_log
        print(f"   ✅ Prediction successful!")
        print(f"   Predicted revenue: ${prediction_dollars:,.2f}")
    else:
        print("   ⚠️  Model format is different, checking pipeline...")
        if isinstance(model, dict) and 'model' in model:
            prediction_log = model['model'].predict(features, return_dollars=False)[0]
            prediction_dollars = 10 ** prediction_log
            print(f"   ✅ Prediction successful (pipeline)!")
            print(f"   Predicted revenue: ${prediction_dollars:,.2f}")
except Exception as e:
    print(f"   ❌ Prediction failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 60)
print("✅ All tests passed! Backend is ready.")
print("=" * 60)
print("\nYou can now start the backend with:")
print("  cd backend && python main.py")
print("\nOr use the batch file:")
print("  start_backend.bat")

