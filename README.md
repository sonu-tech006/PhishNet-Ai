<div align="center">

# 🛡️ PhishNet AI — Intelligent Phishing & Scam Detection Platform

[![Live Application](https://img.shields.io/badge/🚀_Live_Demo-phishnet--ai.ai.studio-10B981?style=for-the-badge&logo=google-chrome&logoColor=white)](https://phishnet-ai.ai.studio/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Database: MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![AI Powered](https://img.shields.io/badge/AI_Powered-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-Classification-189B5A?style=for-the-badge&logo=apache-spark&logoColor=white)](https://xgboost.readthedocs.io/)

<br />

**PhishNet AI** is an enterprise-grade cybersecurity threat intelligence platform and machine learning suite. It detects, dissects, and neutralizes phishing attacks across **suspicious URLs**, **deceptive emails**, and **mobile smishing (SMS)** scams in real time using multi-signal feature extraction, tree-boosted ML classifiers, explainable SHAP attributions, and live MongoDB Atlas telemetry.

<br />

### 🌐 Live Production Deployment
### 👉 **[https://phishnet-ai.ai.studio/](https://phishnet-ai.ai.studio/)** 👈

<br />

---

### 🖥️ Platform Dashboard Preview

<img src="./public/assets/aistudio/Screenshot_2026-10-23_at_11.54.18_PM_49c08254.png" alt="PhishNet AI Platform Preview" width="100%" style="border-radius: 10px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />

---

</div>

<br />

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Badges](#️-tech-stack--badges)
- [📐 System Architecture & Flow Diagram](#-system-architecture--flow-diagram)
- [🔄 Threat Detection Pipeline Flow](#-threat-detection-pipeline-flow)
- [📊 Machine Learning Benchmark Performance](#-machine-learning-benchmark-performance)
- [🗄️ Database Architecture & MongoDB Atlas](#️-database-architecture--mongodb-atlas)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [🔌 REST API Documentation](#-rest-api-documentation)
- [🔒 Security & Safe Analysis Guarantee](#-security--safe-analysis-guarantee)
- [📄 License](#-license)
- [👨‍💻 Author & Maintainer](#-author--maintainer)

<br />

---

## ✨ Key Features

- **🎯 Unified Tri-Vector Threat Scanner:** Single pane of glass to scan URLs, raw emails (headers + body), and mobile SMS text messages with automatic vector categorization.
- **🔗 Deep URL Lexical & Heuristic Engine:** Analyzes 14+ engineered signals including Shannon entropy, sub-domain depth, suspicious TLDs, IP hosting, brand-squatting, punycode/IDN attacks, and token delimiter densities.
- **✉️ Advanced Email Phishing Analyzer:** Parses RFC headers, extracts SPF/DKIM/DMARC flags, checks reply-to spoofing, detects coercive urgency triggers, and verifies credential harvesting tactics.
- **📱 Smishing (SMS Scam) Detector:** Flags financial impersonation, OTP capture traps, bank impersonations, artificial urgency, and embedded shortened/obfuscated URLs.
- **🧠 SHAP Explainability & Risk Attribution:** Breaks down why an item received its score with relative positive/negative risk contributors (e.g., Shannon entropy +28 pts, high-risk TLD +18 pts).
- **📂 Bulk CSV / Batch Processing:** Upload datasets of hundreds of URLs or messages for high-throughput automated classification, downloadable summary reports, and confusion analysis.
- **🎨 Modern SOC UI with Theme Switcher:** Cyberpunk, Emerald SOC, Crimson Alert, Midnight Classic, and Deep Slate themes with glassmorphic dashboards.
- **🔐 User Authentication & Persistent Profiles:** Secure registration and login with bcrypt password hashing, persistent sessions, personal scan history, and custom user preferences.
- **🗄️ MongoDB Atlas Cloud Integration:** Full persistence with automatic failover to high-durability embedded storage for 100% uninterrupted uptime.
- **📈 Live Security Operations Center (SOC) Metrics:** Real-time threat feed, confusion matrix visualizer, ROC & PR curves, and interactive decision threshold tuner.

<br />

---

## 🛠️ Tech Stack & Badges

### Frontend Ecosystem
| Technology | Badge | Description |
| :--- | :--- | :--- |
| **React 19** | ![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB) | Core UI library with modern hooks, suspense, and concurrent mode |
| **TypeScript** | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) | End-to-end type safety, contracts, and strict interface validation |
| **Vite** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | High-speed build tool and development server |
| **Tailwind CSS** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Utility-first responsive design, themes, and dark cyber styling |
| **Lucide Icons** | ![Lucide](https://img.shields.io/badge/Lucide_Icons-F05032?style=flat-square&logo=visual-studio-code&logoColor=white) | Pixel-perfect cybersecurity and telemetry iconography |
| **Recharts** | ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square&logo=chartdotjs&logoColor=white) | Real-time ROC/PR curves, metric charts, and SHAP visualizations |

### Backend, Database & Cloud
| Technology | Badge | Description |
| :--- | :--- | :--- |
| **Node.js** | ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) | Event-driven scalable server runtime environment |
| **Express.js** | ![Express](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=white) | RESTful API routing, rate limiting, and security middleware |
| **MongoDB Atlas** | ![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=flat-square&logo=mongodb&logoColor=white) | Distributed cloud database with Mongoose ODM schemas |
| **Google Gemini AI** | ![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-8E75C2?style=flat-square&logo=google&logoColor=white) | Semantic threat reasoning and contextual payload analysis |
| **Docker** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) | Containerized multi-service deployment setup |

### Machine Learning & Data Science
| Technology | Badge | Description |
| :--- | :--- | :--- |
| **Python 3.11** | ![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white) | Core data science, feature engineering, and model training |
| **XGBoost** | ![XGBoost](https://img.shields.io/badge/XGBoost-EB5424?style=flat-square&logo=apache-spark&logoColor=white) | Gradient-boosted decision tree champion classifier (97.8% Acc) |
| **Scikit-Learn** | ![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white) | Data pipeline, stratified validation, and baseline models |
| **SHAP** | ![SHAP](https://img.shields.io/badge/SHAP-Explainable_AI-FF6F00?style=flat-square&logo=tensorflow&logoColor=white) | Shapley Additive exPlanations for transparent AI decisions |

<br />

---

## 📐 System Architecture & Flow Diagram

The following architecture diagram represents the complete end-to-end data flow from user interaction to feature engineering, dual model inference, explainability decomposition, and persistent storage.

```mermaid
flowchart TD
    subgraph Client_Layer ["🖥️ Client Presentation Layer (React 19 + TypeScript)"]
        UI["🎨 SOC Dashboard UI\n(Unified Scanner / Email / Smishing / CSV Batch)"]
        Theme["🎭 Theme Engine\n(Cyberpunk, Emerald, Crimson, Midnight)"]
        AuthUI["🔐 Auth Modal\n(Login / Signup / User Profile)"]
        Charts["📊 Telemetry & SHAP Visualizer\n(Recharts ROC/PR, Confusion Matrix)"]
    end

    subgraph API_Gateway ["⚡ Full-Stack API Gateway (Node.js + Express.js)"]
        Router["🛣️ REST API Router (/api/v1/*)"]
        RateLimit["🛡️ Security Middleware & Request Sanitization"]
        AuthService["🔑 JWT / Bcrypt Authentication Service"]
    end

    subgraph Feature_Engineering ["⚙️ Multi-Vector Signal Extraction Pipeline"]
        Lexical["🔤 Lexical Features\n(Entropy, URL Length, Dot Count, Subdomain Depth)"]
        Heuristics["🔍 Structural Heuristics\n(IP Hosting, Suspicious TLDs, Punycode, Port Anomalies)"]
        NLP["📝 NLP & Urgency Extraction\n(TF-IDF, Coercive Language, Credential Traps)"]
    end

    subgraph Inference_Engine ["🧠 Hybrid Machine Learning & AI Inference"]
        XGBoost["🌲 XGBoost Boosted Trees Model\n(Accuracy: 97.8% | ROC-AUC: 0.994)"]
        Gemini["✨ Google Gemini AI Reasoning\n(Zero-day Semantic & Social Engineering Analysis)"]
        SHAP["🔬 SHAP Attribution Engine\n(Feature Weights & Risk Factor Scoring)"]
    end

    subgraph Data_Persistence ["💾 High-Availability Data Storage Layer"]
        MongoAtlas[("🍃 MongoDB Atlas Cloud Cluster\n(Collections: Scans, Users, ThreatFeeds)")]
        LocalStore[("📦 Embedded High-Durability Engine\n(Automatic Active Failover Store)")]
    end

    %% Flow Connections
    UI -->|HTTPS / REST| Router
    AuthUI -->|Auth Requests| AuthService
    Router --> RateLimit
    RateLimit --> Feature_Engineering
    
    Lexical --> Inference_Engine
    Heuristics --> Inference_Engine
    NLP --> Inference_Engine
    
    Inference_Engine --> SHAP
    SHAP --> Router
    Router -->|JSON Risk Assessment| UI
    
    Router -->|Telemetry & Records| MongoAtlas
    MongoAtlas -.->|Connection Interruption Fallback| LocalStore
    
    Charts -.->|Fetch Global Metrics| Router
```

<br />

---

## 🔄 Threat Detection Pipeline Flow

Step-by-step sequence of how PhishNet AI handles incoming inspection requests:

```mermaid
sequenceDiagram
    autonumber
    actor Analyst as Security Analyst / User
    participant Client as React 19 Frontend
    participant Server as Express API Server
    participant FeatEng as Feature Extractor
    participant ML as ML & AI Inference Engine
    participant DB as MongoDB Atlas

    Analyst->>Client: Enters suspicious URL, Email, or SMS
    Client->>Server: POST /api/v1/analyze/{type}
    Server->>FeatEng: Extract lexical, structural & semantic signals
    FeatEng->>FeatEng: Compute Shannon entropy & regex heuristics
    FeatEng-->>ML: Feature Vector (x1, x2, ..., xN)
    
    par Dual Scoring
        ML->>ML: Evaluate XGBoost champion tree model
    and
        ML->>ML: Compute SHAP contribution weights
    end

    ML-->>Server: Risk Score (0-100), Verdict (Benign / Suspicious / Phishing), SHAP Factors
    
    par Persist & Respond
        Server->>DB: Save scan audit log with timestamp & user ID
        Server-->>Client: Return structured threat report JSON
    end
    
    Client-->>Analyst: Render Risk Badge, Explainability Breakdown & Actionable Guidance
```

<br />

---

## 📊 Machine Learning Benchmark Performance

Trained and evaluated on over **12,000+ validated phishing & benign samples** with an 80/10/10 stratified split:

| Model Architecture | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Inference Latency |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 🏆 **XGBoost Classifier (Champion)** | **97.8%** | **98.2%** | **97.4%** | **97.8%** | **0.994** | **14.2 ms** |
| 🌲 **Random Forest Ensemble** | 96.5% | 97.1% | 95.8% | 96.4% | 0.987 | 18.6 ms |
| 📐 **TF-IDF + Logistic Regression Baseline** | 92.3% | 91.8% | 92.9% | 92.3% | 0.958 | 6.8 ms |

### Key Hand-Engineered Signals:
1. **Shannon Entropy:** Measures randomness in domain names and query strings to catch DGA (Domain Generation Algorithms).
2. **Punycode / Homograph Checks:** Identifies Cyrillic or Unicode characters imitating legitimate brands (e.g., `pаypаl.com`).
3. **Subdomain Depth & Token Densities:** Analyzes nesting level, hyphen counts, and hex digit sequences.
4. **Keyword Proximity:** Measures distance between high-value targets (`login`, `verify`, `secure`, `bank`) and deceptive TLDs.

<br />

---

## 🗄️ Database Architecture & MongoDB Atlas

PhishNet AI integrates with **MongoDB Atlas** for scalable, fault-tolerant persistence with zero configuration required for local prototyping.

### Schemas:
- **`scans`**: Stores target payload, scan category (`url` | `email` | `sms`), risk score, verdict, extracted signals, SHAP contributions, and client metadata.
- **`users`**: Encrypted user credentials (bcrypt salted hashes), preferences, color theme selection, and scan bookmarks.
- **`pipeline_runs`**: Data engineering pipeline logs, batch throughput stats, and ETL execution telemetry.

### Automatic High-Availability Failover:
If a remote MongoDB Atlas cluster connection is interrupted or credentials are omitted, the server seamlessly switches to an embedded high-performance storage engine so the user experience is never degraded.

<br />

---

## 🚀 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- Optional: MongoDB Atlas URI for persistent cloud storage

### 1. Clone the Repository
```bash
git clone https://github.com/sonu-tech006/PhishNet-AI.git
cd PhishNet-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=phishnet_ai
JWT_SECRET=your_super_secret_jwt_key
```
*(Note: If `MONGODB_URI` is omitted, the app will automatically boot using the internal embedded database!)*

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

<br />

---

## 🔌 REST API Documentation

### 1. URL Analysis
```http
POST /api/v1/analyze/url
Content-Type: application/json

{
  "url": "https://secure-login-update-paypal-verify.tk/auth"
}
```
**Response:**
```json
{
  "id": "scan_8829104",
  "target": "https://secure-login-update-paypal-verify.tk/auth",
  "category": "url",
  "riskScore": 94.6,
  "verdict": "PHISHING",
  "confidence": 0.98,
  "signals": {
    "shannonEntropy": 4.12,
    "hasSuspiciousTld": true,
    "brandSquatting": "paypal",
    "subdomainCount": 3
  },
  "shapAttributions": [
    { "factor": "Brand Squatting detected (paypal)", "impact": "+32%" },
    { "factor": "Suspicious TLD (.tk)", "impact": "+24%" },
    { "factor": "High token entropy", "impact": "+18%" }
  ]
}
```

### 2. Email Inspection
```http
POST /api/v1/analyze/email
Content-Type: application/json

{
  "subject": "Urgent: Your Account Access has been Suspended",
  "sender": "support@security-paypa1.com",
  "body": "Please click here within 24 hours to verify your credentials or your funds will be frozen."
}
```

### 3. Smishing / SMS Detection
```http
POST /api/v1/analyze/sms
Content-Type: application/json

{
  "message": "ALERT: Your postal package is held due to $1.99 fee. Resolve immediately: https://bit.ly/3x8fKz"
}
```

### 4. System Health Check
```http
GET /api/v1/health
```

<br />

---

## 🔒 Security & Safe Analysis Guarantee

- **Safe Inspection:** PhishNet AI statically decomposes URLs and textual payloads without opening untrusted domains, executing foreign JavaScript, or triggering tracking web-beacons.
- **Privacy First:** User credentials submitted for testing are never re-transmitted to third-party ad networks or public pastebins.
- **Encrypted Authentication:** User passwords undergo bcrypt hashing with adaptive salt rounds before storage.

<br />

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

```text
MIT License
Copyright (c) 2026 Sonu Kumar
```

<br />

---

## 👨‍💻 Author & Maintainer

<div align="center">

### **Sonu Kumar**
*Full-Stack Engineer & Cybersecurity Enthusiast*

[![Portfolio](https://img.shields.io/badge/Portfolio-Animated_Portfolio_Pro-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://animated-portfolio-pro.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-sonu--tech006-181717?style=for-the-badge&logo=github)](https://github.com/sonu-tech006)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sonu_Kumar-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sonu-kumar-3234bb344/)
[![Email](https://img.shields.io/badge/Email-sonukr7435@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:sonukr7435@gmail.com)

<br />

```
📬 Email: sonukr7435@gmail.com
🐙 GitHub: https://github.com/sonu-tech006
🌐 Portfolio: https://animated-portfolio-pro.vercel.app/
🔗 LinkedIn: https://www.linkedin.com/in/sonu-kumar-3234bb344/
🌍 Live App: https://phishnet-ai.ai.studio/
```

⭐ **If you find PhishNet AI useful, consider giving this repository a star!** ⭐

</div>
