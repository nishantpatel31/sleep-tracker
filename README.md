# 💤 Sleep Tracker Backend

A backend API for tracking user sleep behavior, built with **Node.js** and **Express**.  
Supports JWT-based authentication, multi-step onboarding, and analytics like average screen time & drop-off detection.

Live Backend: [https://sleep-tracker-sysj.onrender.com](https://sleep-tracker-sysj.onrender.com)

---

## 🧠 Features

- ✅ **User Auth**: Signup/Login using identity, nickname, and password (JWT-based)
- 🧭 **Multi-Step Onboarding Flow** via a **single endpoint**:
  - Sleep habit changes
  - Struggle duration
  - Time to go to sleep
  - Time to wake up
  - Typical sleep hours
- 📊 **Analytics**
  - Drop-off detection on onboarding screens
  - Average time spent per screen

---

## 📁 Folder Structure

```

sleep-tracker-backend/
├── public/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── docs/
│   ├── helpers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validators/
│   └── app.js
├── package-lock.json
├── package.json
├── server.js
└── README.md

---

## 🔐 Auth Endpoints

| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | `/api/auth/signup`   | Register a user     |
| POST   | `/api/auth/signin`   | Login and get JWT   |

### Signup Payload
```json
{
  "nickname": "john123",
  "password": "secret123",
  "identity": "abc123"
}
```

### Signin Payload
```json
{
  "nickname": "john123",
  "password": "secret123"
}
```

---

## 🛏️ Onboarding Endpoint

> All onboarding steps use the **same endpoint**:  
`POST /api/onboarding/step`

### Common Payload Structure
```json
{
  "identity": "abc123",
  "stepKey": "timeToGoForSleep",
  "data": {
    "timeToGoForSleep": {
      "hour": 11,
      "period": "AM"
    }
  },
  "meta": {
    "enteredAt": "2025-06-29T06:05:00Z",
    "exitedAt": "2025-06-29T06:06:40Z"
  },
  "completedSteps": ["previousStepKey"],
  "onboardingComplete": false
}
```

### Step Keys and Their Purpose

| stepKey                  | Purpose                                      |
|--------------------------|----------------------------------------------|
| `sleepHabitChange`       | What sleep improvements user wants           |
| `sleepStruggleDurationFrom` | Duration of user's sleep issues           |
| `timeToGoForSleep`       | Usual time the user goes to sleep            |
| `timeToGoWakeUp`         | Typical wake-up time                         |
| `typicalSleepHours`      | Avg. sleep hours                             |

---

## 📊 Analytics

### GET `/api/analytics/average-screen-time`
- Returns avg. screen time per onboarding step.
- Requires Bearer Token

### GET `/api/analytics/screen-drop-off?idleMinutes=0`
- Tracks where users drop off during onboarding.
- Use `idleMinutes` query to define inactivity threshold.
- Requires Bearer Token


## 🔒 JWT-Based Authentication & Authorization (⭐ Highlight)

- All protected routes require a **valid JWT token**.
- Token is issued on login and includes role-based claims (e.g., `"role": "admin"`).
- Middleware `authenticateToken` checks validity.
- Optional `authorizeRole("admin")` middleware for restricting access to admin-only routes.

### Sample Token Payload
```json
{
  "nickname": "userX",
  "role": "admin",
  "iat": 1712345678
}
```
---

## 🛡️ Auth Notes

- Uses **JWT** for protected routes
- Role-based access supported via middleware
- Auth token must be passed as `Authorization: Bearer <token>`

---

## 🧪 Testing APIs

Use Postman collection:  
`sleep-tracker-APIs.postman_collection.json`

Make sure to:
- Replace `{{PATH}}` with your deployed URL.
- Add a valid `Authorization` token in headers for protected routes.

---

## ⚙️ Env Variables Example

`.env`
```
PORT=4000
JWT_SECRET=your_super_secret_key
MONGO_URI=mongodb://localhost:27017/sleep-tracker
```

---

## 🚀 Run Project

```bash
# Install deps
npm install

# Start in dev
npm run dev

# Start in prod
npm start
```

---

## ✍️ Author

Made with 🧠 by Nishant Patel  
Drop a ⭐ if you find it helpful!

---