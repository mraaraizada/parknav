# 🚀 Quick Start Guide - Movie Box Office Predictor

## Step-by-Step Instructions

### ✅ Step 1: Train the Model (One-time setup)

If you haven't trained the model yet, run:

```bash
python src/train.py --model xgboost
```

This creates the trained model file at `outputs/models/xgboost_model.joblib`.

**Note**: If you already have a trained model, skip this step.

---

### ✅ Step 2: Start the Backend Server

**Option A - Using the batch file (Windows):**
```bash
start_backend.bat
```

**Option B - Manual start:**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

The backend will start at: **http://localhost:8000**
- View API docs at: **http://localhost:8000/docs**

**Keep this terminal window open!**

---

### ✅ Step 3: Start the Frontend (New Terminal)

Open a **NEW terminal window** and run:

**Option A - Using the batch file (Windows):**
```bash
start_frontend.bat
```

**Option B - Manual start:**
```bash
cd frontend
npm install
npm run dev
```

The frontend will start at: **http://localhost:3000**

**Keep this terminal window open too!**

---

### ✅ Step 4: Use the Application

1. Open your browser to **http://localhost:3000**
2. Fill in the movie details:
   - Movie title
   - Budget (use slider)
   - Opening theaters (use slider)
   - Release days
   - MPAA rating
   - Select genres (click multiple)
   - Choose distributor
   - Select release month and day
3. Click **"Predict Revenue"**
4. View your prediction results!

---

## 🎯 What You'll See

### Input Form (Left Side)
- Modern dark-themed interface
- Interactive sliders for budget and theaters
- Multi-select genre buttons
- Dropdown menus for ratings and distributors

### Prediction Results (Right Side)
- **Predicted Revenue** - Main prediction
- **ROI Percentage** - Return on investment
- **Revenue Per Theater** - Average per location
- **Confidence Range Chart** - Visual prediction range
- **Key Factors** - Important decision factors
- **Movie Summary** - Your input recap

---

## 🔧 Troubleshooting

### "Model not found" error
**Solution**: Train the model first:
```bash
python src/train.py --model xgboost
```

### Backend won't start
**Solution**: Make sure you have Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Frontend won't start
**Solution**: Install Node.js dependencies:
```bash
cd frontend
npm install
```

### Port already in use
**Solution**: 
- Backend (8000): Stop any other process using port 8000
- Frontend (3000): Stop any other process using port 3000

### CORS errors in browser
**Solution**: Make sure the backend is running on port 8000

---

## 📊 Example Movie to Try

Try these values for a quick test:

- **Title**: "Summer Blockbuster"
- **Budget**: $150,000,000
- **Opening Theaters**: 4,000
- **Release Days**: 120
- **MPAA Rating**: PG-13
- **Genres**: Action, Adventure, Sci-Fi
- **Distributor**: Disney
- **Release Month**: July (7)
- **Day of Week**: Friday (4)

Expected prediction: ~$300M+ revenue

---

## 🎨 Features to Explore

1. **Interactive Sliders**: Drag to adjust budget and theater count
2. **Multi-Genre Selection**: Click multiple genre buttons
3. **Real-time Validation**: Form validates as you type
4. **Confidence Intervals**: See prediction range in chart
5. **ROI Calculator**: Automatic profit calculation
6. **Responsive Design**: Try resizing your browser

---

## 📝 Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python
- **ML Model**: XGBoost Regressor
- **Charts**: Recharts library

---

## 🆘 Need Help?

1. Check that both servers are running (backend AND frontend)
2. Look at the terminal output for error messages
3. Make sure you trained the model first
4. Verify you're using the correct URLs:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

---

## 🎉 Enjoy!

You now have a fully functional movie box office prediction system!

**Happy Predicting! 🎬**

