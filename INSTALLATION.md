# 📦 Installation Guide - Movie Box Office Predictor

## Prerequisites

Before you begin, make sure you have:

- ✅ **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
- ✅ **Node.js 18 or higher** - [Download Node.js](https://nodejs.org/)
- ✅ **Git** (optional) - [Download Git](https://git-scm.com/)

Check your versions:
```bash
python --version
node --version
npm --version
```

---

## 🔧 Installation Steps

### Step 1: Install Backend Dependencies

Open a terminal in the project root directory and run:

```bash
# Install backend Python packages
pip install -r backend/requirements.txt
```

**Alternative**: If you want to use the existing project dependencies:
```bash
pip install -r requirements.txt
```

This installs:
- FastAPI - Web framework
- Uvicorn - ASGI server
- Pydantic - Data validation
- Pandas, NumPy - Data processing
- Scikit-learn, XGBoost - Machine learning
- Joblib - Model serialization

---

### Step 2: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js packages
npm install

# Go back to root
cd ..
```

This installs:
- React - UI library
- TypeScript - Type safety
- Vite - Build tool
- Tailwind CSS - Styling
- Recharts - Charts
- Axios - HTTP client
- And more...

---

### Step 3: Train the Model (if needed)

If you don't have a trained model yet:

```bash
# Train the XGBoost model
python src/train.py --model xgboost
```

This will:
- Load and preprocess the data
- Engineer features
- Train the XGBoost model
- Save the model to `outputs/models/xgboost_model.joblib`
- Save metadata to `outputs/models/metadata.json`

**Note**: If you already have `outputs/models/xgboost_model.joblib`, you can skip this step.

---

## ✅ Verify Installation

### Test Backend

```bash
python test_backend.py
```

You should see:
```
============================================================
Testing Backend Components
============================================================

1. Testing model loading...
   ✅ Model loaded successfully!

2. Testing feature preparation...
   ✅ Features prepared! Shape: (1, XX)

3. Testing prediction...
   ✅ Prediction successful!
   Predicted revenue: $XXX,XXX,XXX.XX

============================================================
✅ All tests passed! Backend is ready.
============================================================
```

### Test Frontend Build

```bash
cd frontend
npm run build
```

You should see a successful build with no errors.

---

## 🚀 Running the Application

### Option 1: Using Batch Files (Windows)

**Terminal 1 - Backend:**
```bash
start_backend.bat
```

**Terminal 2 - Frontend:**
```bash
start_frontend.bat
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🌐 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

---

## 🐛 Common Installation Issues

### Issue 1: "pip: command not found"

**Solution**: Python is not in your PATH. Try:
```bash
python -m pip install -r backend/requirements.txt
```

### Issue 2: "npm: command not found"

**Solution**: Node.js is not installed or not in PATH.
- Download and install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Issue 3: "ModuleNotFoundError: No module named 'fastapi'"

**Solution**: Backend dependencies not installed:
```bash
pip install -r backend/requirements.txt
```

### Issue 4: "Model not found" error

**Solution**: Train the model first:
```bash
python src/train.py --model xgboost
```

### Issue 5: Port already in use

**Solution**: 
- Backend (8000): Kill the process using port 8000
- Frontend (3000): Kill the process using port 3000

Windows:
```bash
# Find process on port 8000
netstat -ano | findstr :8000
# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue 6: Permission denied errors

**Solution**: Run terminal as Administrator (Windows) or use `sudo` (Mac/Linux)

### Issue 7: SSL/Certificate errors during npm install

**Solution**:
```bash
npm config set strict-ssl false
npm install
npm config set strict-ssl true
```

---

## 📁 Project Structure After Installation

```
movies/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── __pycache__/
├── frontend/
│   ├── node_modules/          # ← Created after npm install
│   ├── dist/                  # ← Created after npm run build
│   ├── src/
│   ├── package.json
│   └── ...
├── outputs/
│   └── models/
│       ├── xgboost_model.joblib    # ← Created after training
│       └── metadata.json           # ← Created after training
├── src/
├── data/
└── ...
```

---

## 🔄 Updating Dependencies

### Update Backend
```bash
pip install --upgrade -r backend/requirements.txt
```

### Update Frontend
```bash
cd frontend
npm update
```

---

## 🧹 Clean Installation

If you encounter persistent issues, try a clean install:

### Backend
```bash
pip uninstall -r backend/requirements.txt -y
pip install -r backend/requirements.txt
```

### Frontend
```bash
cd frontend
rm -rf node_modules package-lock.json  # Mac/Linux
# OR
rmdir /s node_modules & del package-lock.json  # Windows
npm install
```

---

## 💡 Development Tools (Optional)

### Python Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

### VS Code Extensions (Recommended)

- Python
- Pylance
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

---

## ✅ Installation Complete!

You're all set! Proceed to **START_HERE.md** for usage instructions.

**Need help?** Check the troubleshooting section above or review the error messages carefully.

---

**Happy Coding! 🎬**

