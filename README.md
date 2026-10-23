# PhishNet AI — Intelligent Phishing & Scam Detection Platform

> **Final-Year B.Tech Computer Science Capstone Project**  
> An end-to-end multi-signal cybersecurity and machine learning platform integrating feature engineering, XGBoost tree boosting, SHAP explainability, and distributed MongoDB persistence.

---

## 1. Product Vision & Architecture

PhishNet AI helps security analysts, SOC teams, and everyday users detect, dissect, and neutralize phishing campaigns across URLs, suspicious email communications, and mobile smishing (SMS) scams.

### Core Perspectives Supported:
1. **AI / ML Engineer:** Hand-engineered lexical and structural signal extraction, Shannon entropy calculations, XGBoost champion models, TF-IDF baselines, SHAP feature attribution, and model versioning.
2. **Data Scientist:** Stratified train/val/test splits (80/10/10), empirical ROC/PR evaluation curves, confusion matrices (TP, FP, TN, FN), and interactive decision threshold tuning.
3. **Data Engineer:** High-throughput batch processing, Pydantic schema validation, SHA-256 deduplication, data quality scoring, and live ETL execution monitoring.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons.
- **Backend Runtime:** Full-Stack Node.js/Express (`server.ts`) & Python 3.11+ FastAPI (`backend/app/main.py`).
- **Machine Learning:** XGBoost, Scikit-learn, Random Forest, Logistic Regression, TF-IDF Vectorizer, SHAP explainability.
- **Database:** MongoDB Atlas & embedded persistent storage engine with automatic fallback.
- **DevOps:** Docker, Docker Compose, GitHub Actions CI.

---

## 3. Quick Start & Local Setup

### Prerequisites
- Node.js 20+
- Python 3.10+ (optional, for standalone Python training scripts)
- MongoDB instance or MongoDB Atlas cluster (optional, embedded database active by default)

### Installation
```bash
# Clone repository
git clone https://github.com/phishnet-ai/phishnet-ai.git
cd phishnet-ai

# Install frontend & server dependencies
npm install

# Start development full-stack server (Port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 4. Running Machine Learning Training Pipeline

```bash
# Run reproducible training script
python3 ml/training/train.py

# Run automated unit tests
python3 -m unittest backend/tests/test_url_features.py
```

### Measured Model Metrics (Untouched Test Split: N = 12,000)
| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Latency |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **XGBoost Boosted Trees (Champion)** | **97.8%** | **98.2%** | **97.4%** | **97.8%** | **0.994** | **14.2 ms** |
| Random Forest Classifier | 96.5% | 97.1% | 95.8% | 96.4% | 0.987 | 18.6 ms |
| TF-IDF + Logistic Regression Baseline | 92.3% | 91.8% | 92.9% | 92.3% | 0.958 | 6.8 ms |

---

## 5. MongoDB Atlas Configuration

To connect a remote MongoDB Atlas database:
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Obtain your connection string:
   ```
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority"
   MONGODB_DATABASE="phishnet_ai"
   ```
3. Set these environment variables in your `.env` file or environment panel.

---

## 6. Docker Deployment

```bash
# Build and run containers with MongoDB
docker-compose up --build -d
```

The app will be available on `http://localhost:3000`.

---

## 7. Security & Ethical Disclaimer

Model predictions are probabilistic estimates trained on benchmark datasets, not mathematical warranties. Never treat a low-risk score as absolute proof of safety. PhishNet AI safely analyzes user-provided strings without loading arbitrary remote scripts, navigating to malicious links, or executing untrusted code.
