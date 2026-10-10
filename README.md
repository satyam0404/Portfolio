# Satyam Yadav — 3D Engineering & Analytics Portfolio

> **Live 3D WebGL Portfolio Website** built for GitHub Pages showcasing the intersection of **Mechanical Engineering (DTU)**, **Data Analytics**, **Supply Chain Optimization**, and **DRDO SSPL Crystal Growth Research**.

---

## 🌟 Key Highlights & Architecture

- **Interactive 3D WebGL Engine (`Three.js`)**:
  - Procedural mechanical gimbal rings, animated crystalline lattice core (inspired by DRDO SSPL semiconductor research), and dynamic orbital supply chain data nodes.
  - Interactive mouse parallax, depth-of-field lighting, and 3 switchable camera view modes:
    - *Crystal Core* (Semiconductor Lattice Focus)
    - *Supply Web* (Global Supply Chain Network)
    - *Mechanical Gimbal* (Precision Engineering Gimbal)
- **Supply Chain & Demand Forecasting Simulator**:
  - Live in-browser interactive mathematical sandbox allowing recruiters and engineers to test:
    - **Wilson's Economic Order Quantity (EOQ)**: $\text{EOQ} = \sqrt{\frac{2DS}{H}}$
    - **Dynamic 95% Safety Stock**: $\text{SS} = Z \cdot \sigma_L$
    - Real-time annual holding cost savings and interactive 12-month time-series canvas chart with 95% confidence intervals.
- **Full Credentials from Resumes**:
  - **Education**: Delhi Technological University (DTU, 2023–2027) | B.Tech Mechanical Engineering | **CGPA: 7.028** | 12th: **85.6%** | 10th: **93.8%**.
  - **Defense R&D Experience**: Solid State Physics Laboratory (**DRDO SSPL**) — Crystal Growth, Czochralski semiconductor pulling dynamics, thermal gradient process controls.
  - **E-Commerce Big Data Project**: Olist Delivery Performance & Seller Analysis — MySQL architecture with ~100K orders across 9 relational tables, cycle time KPI views, on-time delivery bottleneck analysis.
  - **Predictive Sales Modeling**: Vehicle demand curve forecasting using Python (Pandas, NumPy, Scikit-learn) and SQL to minimize holding expenditures.
  - **Dual Resume Downloads**: Direct 1-click access to both specialized resumes:
    1. *Supply Chain & Operations Focus* (`Satyam_23_ME_244.pdf`)
    2. *Data & Business Analyst Focus* (`Satyam_23ME244.pdf`)
- **Modern Design & Micro-Interactions**:
  - Cyber-industrial dark aesthetic with glassmorphism (`backdrop-filter: blur(16px)`), cyan & electric violet lighting, dynamic typing text, 3D card tilt with specular glare, and toast notifications.

---

## 🚀 How to Publish to GitHub Pages (Step-by-Step)

Your portfolio is 100% static and self-contained (HTML, CSS, JS, and local assets). It runs out-of-the-box on **GitHub Pages** without requiring any build step or compilation.

### Step 1: Initialize Git and Commit
Open PowerShell or your terminal in this `Portfolio` folder and run:

```bash
git init
git add .
git commit -m "feat: complete 3D portfolio website for Satyam Yadav"
```

### Step 2: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. For a personal portfolio URL like `https://satyam0404.github.io`:
   - Name your repository: **`satyam0404.github.io`** (or `portfolio`).
   - Set visibility to **Public**.
3. Push your code:
```bash
git branch -M main
git remote add origin https://github.com/satyam0404/satyam0404.github.io.git
git push -u origin main
```
*(If you named your repository `portfolio`, the command will be `https://github.com/satyam0404/portfolio.git`)*

### Step 3: Enable GitHub Pages
1. On your GitHub repository page, click **Settings** (top tab).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` and folder `/ (root)`.
4. Click **Save**.
5. Within 1–2 minutes, your website will be live at:
   - `https://satyam0404.github.io/` (or `https://satyam0404.github.io/portfolio/`).

---

## 💻 Running & Testing Locally

You can test the website locally at any time using any simple HTTP server:

```bash
# Using Python:
python -m http.server 5000

# Open in browser:
http://localhost:5000/
```

---

## 📂 Project Structure

```
Portfolio/
├── index.html                           # Main semantic HTML5 webpage
├── README.md                            # Documentation and deployment guide
├── Satyam_23_ME_244.pdf                 # Original Supply Chain resume
├── Satyam_23ME244.pdf                   # Original Data Analyst resume
├── assets/
│   ├── docs/
│   │   ├── Satyam_Yadav_Resume_SupplyChain.pdf
│   │   └── Satyam_Yadav_Resume_DataAnalyst.pdf
│   └── images/
│       ├── satyam-profile.jpg           # High-resolution tech portrait avatar
│       ├── ecommerce-project.jpg        # Olist delivery KPI dashboard visual
│       ├── forecasting-project.jpg      # Vehicle demand forecasting visual
│       └── crystal-growth-project.jpg   # DRDO SSPL crystal growth apparatus
├── css/
│   └── style.css                        # Design system tokens, glassmorphism, responsive grid
└── js/
    ├── three-scene.js                   # Three.js 3D WebGL engine & camera modes
    ├── forecast-simulator.js            # Live interactive EOQ & demand forecast sandbox
    └── main.js                          # 3D card tilt, scrollspy, SQL modal, toasts, typing effect
```

---

## 📬 Contact Information

- **Satyam Yadav**
- **Email**: [satyamyadav_23me244@dtu.ac.in](mailto:satyamyadav_23me244@dtu.ac.in)
- **Phone**: +91 9650446219
- **GitHub**: [github.com/satyam0404](https://github.com/satyam0404)
- **Location**: Rajeev Nagar extension, Delhi, India
- **University**: Delhi Technological University (DTU)
