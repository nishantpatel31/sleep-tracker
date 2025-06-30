# 💤 Sleep Tracker Backend

A backend API built with **Node.js** + **Express** to track sleep behaviors, power onboarding flows, and crunch analytics — like a dream. 😴



Live URL: [https://sleep-tracker-sysj.onrender.com](https://sleep-tracker-sysj.onrender.com)

---

## 🧠 What It Does

- 🔐 **JWT Auth** (Signup/Login)
- 📲 **Multi-Step Onboarding** via a **unified endpoint**
- 📊 **Analytics APIs** for average screen time & drop-off detection
- 🧑‍💻 **Visitor Support** — auto-temp identity without login
- 🧱 **Clean Data Model** — optimized for analytics

---


---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start in dev mode
npm run dev

# 3. Start in prod
npm start
```


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
```

---

## 🔐 Auth API

These APIs handle user login/signup. JWT token returned on login is used for all protected routes.

### POST `/api/auth/signup`

Register a new user. If a user is already active as a **visitor**, pass their current `identity` to link progress.

**Request:**
```json
{
  "nickname": "nishant52@sleeptracker.com",
  "password": "password123",
  "identity": "112233"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully.",
  "identity": "nishant52@sleeptracker.com"
}
```

---

### POST `/api/auth/signin`

Authenticate a user and receive a JWT token.

**Request:**
```json
{
  "nickname": "nishant52@sleeptracker.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User login successful.",
  "token": "<JWT_TOKEN>",
  "nickname": "nishant52@sleeptracker.com"
}
```

🔐 Add this header to all protected routes:
```
Authorization: Bearer <JWT_TOKEN>
```

✅ If email ends with `@sleeptracker.com` → user is considered an **admin**.

---

## 🛏️ Onboarding API

All onboarding screens use the same endpoint:  
**POST** `/api/onboarding/step`

### Payload Format
```json
{
  "identity": "nishant52@sleeptracker.com",
  "stepKey": "timeToGoForSleep",
  "data": {
    "timeToGoForSleep": {
      "hour": 11,
      "period": "PM"
    }
  },
  "meta": {
    "enteredAt": "2025-06-30T06:05:00Z",
    "exitedAt": "2025-06-30T06:06:40Z"
  },
}
```

### Access Modes

- Visitors (not logged in): Auto-generated `identity` via session
- Logged-in Users: `identity = nickname` + JWT header

---

### Step Keys & Purpose

| Step Key                  | Purpose                                      |
|--------------------------|----------------------------------------------|
| `sleepHabitChange`       | What sleep improvements the user wants       |
| `sleepStruggleDurationFrom` | How long they’ve had sleep issues         |
| `timeToGoForSleep`       | Usual time they go to sleep                  |
| `timeToWakeUp`           | Typical wake-up time                         |
| `typicalSleepHours`      | Average sleep hours                          |

---

### Example Responses

**Intermediate Screen:**
```json
{
  "success": true,
  "message": "Response recorded for timeToWakeUp. Proceed to typicalSleepHours screen.",
  "nextScreen": "typicalSleepHours"
}
```

**Final Screen:**
```json
{
  "success": true,
  "message": "Response recorded for typicalSleepHours. Onboarding completed.",
  "nextScreen": "done"
}
```

---

## 📊 Analytics APIs

⚠️ **Admin-only** → Must use a nickname ending with `@sleeptracker.com` + valid JWT token.

### GET `/api/analytics/average-screen-time`

Returns average duration spent on each screen.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "screen": "sleepHabitChange",
      "totalResponses": 2,
      "avgDurationInSec": 100
    },
    {
      "screen": "sleepStruggleDurationFrom",
      "totalResponses": 3,
      "avgDurationInSec": 57680
    }
  ]
}
```

---

### GET `/api/analytics/screen-drop-off?idleMinutes=5`

Tracks users who dropped off (didn’t proceed for given idle time).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "screen": "timeToWakeUp",
      "dropOffCount": 1
    }
  ]
}
```

---

## 🧨 Error Format (For All APIs)

```json
{
    "success": false,
    "code": "STATUS_CODE",
    "error": {
        "name": "ERROR_NAME",
        "message": "CUSTOM_MESSAGE",
        "type": "ERROR_TYPE"
    }
}
```

🧠 Common Gotchas:
- Missing `stepKey`
- Expired or missing JWT
- Trying admin route without `@sleeptracker.com`

---

## 🧪 Testing with Postman

Use [postman collection](https://documenter.getpostman.com/view/29087657/2sB34Zq4JL) to test all APIs.

✅ Replace `{{PATH}}` with the live backend URL  
✅ Add Authorization header with Bearer Token for protected routes

---

## ⚙️ .env File Example

```
PORT=4000
JWT_SECRET=super_secret_jwt_key
MONGO_URI=mongodb://localhost:27017/sleep-tracker
```
---

## 🙌 Final Summary

🔁 Unified Endpoint: Just pass a stepKey to post onboarding data  
⏱️ Smart Drop-off Tracking: Via nextScreen and timestamps — analytics ready  
🔐 JWT Auth & Role-Based Access: Auth is tight; admin access is email-based (no role flags needed)  
📊 Admin-Only Insights: Drop-off and screen time analytics are gated and protected  
🧱 Data Model = Analytics-Ready: Clean, structured storage with every stepKey logged separately  
🧑‍🚀 Visitors Supported: Temporary identity ensures progress sticks even pre-signup  
📝 Simple Signup Flow: Just a nickname + password — no fuss, no frills  

---

## ✍️ Author

Made with ☕ & ❤️ by **Nishant Patel**  
If this helped you sleep better (or code better), drop a ⭐