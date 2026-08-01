# 🎵 MusicVault – AI-Powered Music Catalog Manager

A full-stack music catalog management platform that enables users to search albums using the **Apple iTunes Search API**, build a personal music library, visualize analytics, and generate **AI-powered music insights**.

Developed as part of the **Ledger CFO Take-Home Assignment**, this project demonstrates full-stack development using **Java Spring Boot**, **React**, **MySQL**, **JWT Authentication**, **REST APIs**, **Google Gemini AI**, and cloud deployment.

<p align="center">
  <a href="https://music-catalog-mu.vercel.app">Live application</a> ·
  <a href="https://music-catalog-154o.onrender.com">Backend API</a> ·
  <a href="#-local-setup">Local setup</a> ·
  <a href="#-assignment-requirements-checklist">Assignment checklist</a>
</p>

> **Reviewer note:** MusicVault focuses on **albums**. It persists only a user's saved library in MySQL; catalog metadata is searched from Apple iTunes on demand. This keeps ownership boundaries clear and directly follows the assignment scenario.

---

# 🚨 Important

## 🔑 Demo Credentials

**Email:** `test@gmail.com`

**Password:** `123456`

> If the account already exists, simply log in using the credentials above.

---

## 🗄 Database

This project uses **FreeDB (MySQL)**.

FreeDB provides a **7-day free database**, so the database may expire after 7 days. If that happens, the backend environment variables must be updated with a newly created database.

---

## ☁️ Backend Hosting

The backend is hosted on **Render Free Tier**.

Since Render automatically suspends inactive services, a **Google Apps Script scheduled trigger** periodically sends requests to the backend to reduce cold starts while the demo is available.

---

## 🌐 Live Demo

### Frontend

https://music-catalog-mu.vercel.app

### Backend API

https://music-catalog-154o.onrender.com

### GitHub Repository

https://github.com/gaganguddi/music-catalog

---

# 📸 Application Screenshots

## Dashboard

![Dashboard](image/Dashboard.png)

![Dashboard](image/Dashboard1.png)

---

## My Library

![Library](image/MyLibrary.png)

---

## Analytics Dashboard

![Analytics](image/Analytics.png)

---

## AI Music Recommendations

![AI Recommendations](image/AIMusicRecommendations.png)

---

# 📖 Project Overview

MusicVault allows users to discover albums through the Apple iTunes Search API and build a personalized music collection.

The application provides:

- 🔐 JWT Authentication
- 🔍 Album Search
- ❤️ Personal Music Library
- ⭐ Album Ratings
- 📝 Personal Notes
- 🗑 Album Management
- 📊 Analytics Dashboard
- 🤖 AI-Powered Music Recommendations
- ☁️ Cloud Deployment

---

# 🏗 System Architecture

```text
                    +----------------------+
                    |     React + Vite     |
                    |      Frontend        |
                    |      (Vercel)        |
                    +----------+-----------+
                               |
                               ▼
                  +----------------------------+
                  | Spring Boot REST API       |
                  | Authentication             |
                  | CRUD Operations            |
                  | AI Service                 |
                  | (Render)                   |
                  +------+-------------+-------+
                         |             |
                         |             |
                         ▼             ▼
                  MySQL (FreeDB)   Google Gemini API

                         |
                         ▼

               Apple iTunes Search API
```

---

# 🔄 Application Flow

```text
User

   │

   ▼

React Frontend

   │

   ▼

Spring Boot REST API

   │

   ├────────► JWT Authentication

   ├────────► MySQL Database

   ├────────► Apple iTunes Search API

   └────────► Google Gemini API
```

---

# 🎯 Assignment Focus

## Selected Entity

### ✅ Albums

Albums were selected because they provide richer metadata than songs or artists, including:

- Album Title
- Artist Name
- Genre
- Release Date
- Track Count
- Artwork
- Price

This richer metadata enables more meaningful analytics and AI-generated insights, matching the project requirements.

---

# 🚀 Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Logout
- Input Validation

---

## 🔍 Album Search

Search albums using the **Apple iTunes Search API**.

Each result displays:

- Album Artwork
- Album Name
- Artist
- Genre
- Release Date
- Track Count

---

## ❤️ Personal Library

Users can:

- Save Albums
- View Saved Albums
- Edit Ratings
- Add Personal Notes
- Delete Albums

Only the user's personal library is stored in the MySQL database.

---

## 📊 Analytics Dashboard

Built using **Recharts**.

Includes:

- 📊 Albums by Genre
- 🍩 Genre Distribution
- 📈 Albums Added Over Time
- 📉 Release Year Analysis

---

## 🤖 AI Music Recommendations

Powered by **Google Gemini 3.5 Flash Lite**.

The AI analyzes the user's saved music library and generates:

- Collection Summary
- Favorite Genres
- Artist Trends
- Music Diversity
- Personalized Recommendations

---

# ✅ Assignment Requirements Covered

| Requirement | Status |
|------------|--------|
| Java Spring Boot Backend | ✅ |
| React Frontend | ✅ |
| MySQL Database | ✅ |
| JWT Authentication | ✅ |
| CRUD Operations | ✅ |
| Public Music API Integration | ✅ |
| Analytics Dashboard | ✅ |
| AI Feature | ✅ |
| Responsive UI | ✅ |
| Deployment | ✅ |
| README Documentation | ✅ |

---

# 🛠 Technology Stack

| Area | Technologies |
|------|--------------|
| Frontend | React, Vite, React Router, Axios, React Hook Form, Tailwind CSS, Recharts, Lucide React, React Hot Toast |
| Backend | Java 17, Spring Boot, Spring Security, Spring Data JPA, Hibernate, JWT, Maven |
| Database | MySQL (FreeDB) |
| AI | Google Gemini 3.5 Flash Lite |
| External API | Apple iTunes Search API |
| Deployment | Vercel, Render |

---

# 💾 Database Schema

## Users

| Field | Type |
|------|------|
| id | Long |
| name | String |
| email | String |
| password | String |
| created_at | Timestamp |

---

## Library

| Field | Type |
|------|------|
| id | Long |
| apple_catalog_id | Long |
| title | String |
| artist_name | String |
| genre | String |
| release_date | Date |
| track_count | Integer |
| artwork_url | String |
| user_rating | Integer |
| user_notes | Text |
| created_at | Timestamp |
| updated_at | Timestamp |

Only the user's personal library is stored in the database.

Album metadata is fetched dynamically from the Apple iTunes Search API.

---

# 🔐 Authentication Flow

```text
Register

↓

Login

↓

JWT Generated

↓

Stored in Local Storage

↓

JWT Sent with Every Protected Request

↓

Backend Validation
```

Protected requests include:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 📡 REST API Endpoints

| Feature | Endpoint |
|---------|----------|
| Register | POST /api/auth/register |
| Login | POST /api/auth/login |
| Search Albums | GET /api/search/albums?term={album} |
| Get Library | GET /api/library |
| Add Album | POST /api/library |
| Update Album | PUT /api/library/{id} |
| Delete Album | DELETE /api/library/{id} |
| AI Recommendations | POST /api/ai/insights |

---

# 📁 Project Structure

```text
music-catalog/
│
├── music-catalog-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/gagan/musiccatalog/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       ├── service/
│   │   │   │       ├── util/
│   │   │   │       └── MusicCatalogBackendApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── music-catalog-frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── image/
├── README.md
└── .gitignore
```

---

# ⚙️ Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/gaganguddi/music-catalog.git

cd music-catalog
```

---

## 2. Backend Setup

```bash
cd music-catalog-backend
```

Create a `.env` file (or configure the following environment variables):

```env
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
GEMINI_API_KEY=
```

Run the backend:

```bash
mvn spring-boot:run
```

Backend will start at:

```
http://localhost:8080
```

---

## 3. Frontend Setup

```bash
cd music-catalog-frontend

npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080/api
```

Run the frontend:

```bash
npm run dev
```

Frontend will start at:

```
http://localhost:5173
```

---

# 🌍 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | FreeDB (MySQL) |

---

# 🔒 Security Features

- JWT Authentication
- BCrypt Password Encryption
- Protected Routes
- Spring Security
- CORS Configuration
- Input Validation
- Secure REST API Endpoints

---

# ⚖️ Design Decisions & Trade-offs

### Why Albums?

Albums provide more metadata than songs or artists, enabling richer analytics and AI-generated insights.

---

### Why MySQL?

MySQL was chosen because it:

- Provides a structured relational database
- Integrates well with Spring Data JPA
- Is ideal for CRUD operations
- Efficiently stores user library data

---

### Why JWT?

JWT enables stateless authentication between the React frontend and Spring Boot backend.

---

### Why Google Gemini?

Google Gemini provides fast and high-quality AI-generated recommendations based on the user's saved music library.

---

### Trade-offs

- Apple iTunes Search API is read-only.
- JWT tokens are stored in Local Storage for simplicity (HttpOnly cookies would be more secure in production).
- Analytics are generated only from the user's saved library.
- Render Free Tier introduces cold starts after inactivity.
- FreeDB databases expire after 7 days and have connection limits.

---

# 🚀 Future Improvements

- Playlist Generation
- Favorite Albums
- Advanced Filtering
- Debounced Search
- Pagination
- Infinite Scrolling
- Export Library to CSV
- Export Library to PDF
- User Profile Management
- Unit Testing
- Integration Testing
- CI/CD Pipeline
- Docker Deployment
- Custom Domain
- Email Verification
- Password Reset
- Dark / Light Theme
- Offline Caching

---

# 🌍 External APIs

## Apple iTunes Search API

Used to search public music albums.

Documentation:

https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/

---

## Google Gemini API

Used to generate AI-powered music recommendations and collection insights.

---

# 📊 Analytics Implemented

The Analytics Dashboard includes:

- 📊 Bar Chart – Albums by Genre
- 🥧 Pie Chart – Genre Distribution
- 📈 Line Chart – Albums Added Over Time
- 📉 Histogram / Release Year Analysis

These charts satisfy the assignment requirement of implementing at least four visualizations.

---

# 🤖 AI Feature

### AI Music Recommendations

Google Gemini analyzes the user's saved music collection and generates:

- Collection Summary
- Favorite Genres
- Artist Trends
- Listening Diversity
- Personalized Music Recommendations

This satisfies the assignment requirement of implementing one AI-powered feature.

---

# 🧭 Assignment Alignment

This section provides a quick, evidence-based map from the Ledger CFO take-home requirements to the implemented product.

| Assignment requirement | MusicVault implementation | Where to review |
|---|---|---|
| Choose one focus entity and explain it | **Albums** were selected for their richer metadata, which supports meaningful analytics and AI insights. | [Assignment Focus](#-assignment-focus) |
| Persist only the user's saved library | MySQL stores library records and user-specific rating/notes data; iTunes remains the source for public catalog search metadata. | [Database Schema](#-database-schema) |
| Search public music catalog | Album-focused Apple iTunes Search API integration. The backend endpoint is `GET /api/search/albums?term={album}`. | [Album Search](#-album-search) |
| Library CRUD | Authenticated create, read, update, and delete endpoints for saved albums. | [REST API Endpoints](#-rest-api-endpoints) |
| JWT, validation, and error handling | Spring Security protects private operations; JWTs are issued at login and sent as Bearer tokens. | [Authentication Flow](#-authentication-flow) and [Security Features](#-security-features) |
| Responsive frontend with loading and empty states | React/Vite UI includes search, library, dashboard, and responsive user flows. | [Features](#-features) and screenshots above |
| At least four analytics visualizations | Genre bar chart, genre donut chart, albums-added line chart, and release-year analysis. | [Analytics Implemented](#-analytics-implemented) |
| One AI feature | Gemini generates collection summaries and personalized music recommendations from the saved library. | [AI Feature](#-ai-feature) |
| Deploy frontend and backend | Frontend runs on Vercel; backend runs on Render. | [Live Demo](#-live-demo) and [Deployment](#-deployment) |
| Document setup and trade-offs | Environment variables, local-run steps, technical decisions, and limitations are documented below. | [Local Setup](#-local-setup) and [Design Decisions & Trade-offs](#%EF%B8%8F-design-decisions--trade-offs) |

**Good-to-have items:** the project includes a dedicated album search experience and deployment documentation. Pagination, debounced search, caching, automated tests, and CI/CD are explicitly captured as future improvements rather than overstated as completed work.

---

# 📋 Assignment Requirements Checklist

| Requirement | Status |
|--------------|--------|
| Spring Boot Backend | ✅ |
| React Frontend | ✅ |
| MySQL Database | ✅ |
| JWT Authentication | ✅ |
| CRUD Operations | ✅ |
| Public API Integration | ✅ |
| Responsive UI | ✅ |
| Loading States | ✅ |
| Analytics Dashboard | ✅ |
| Four Charts | ✅ |
| AI Feature | ✅ |
| Cloud Deployment | ✅ |
| GitHub Repository | ✅ |
| Live Demo | ✅ |
| README Documentation | ✅ |

---

# 🙏 Acknowledgements

- Apple iTunes Search API
- Google Gemini API
- Spring Boot
- Spring Security
- Hibernate
- React
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- Axios
- React Hook Form
- Render
- Vercel
- FreeDB

---

# 👨‍💻 Author

## Gagan H

**GitHub**

https://github.com/gaganguddi

**Portfolio**

https://gaganh-portfolio.netlify.app

---

# 📄 License

This project was developed as part of the **Ledger CFO Take-Home Assignment** for evaluation purposes.

It is intended to demonstrate full-stack software engineering skills, including backend development, frontend development, database design, authentication, analytics, AI integration, and cloud deployment.

---

# ⭐ If you found this project interesting, consider giving it a Star on GitHub!
