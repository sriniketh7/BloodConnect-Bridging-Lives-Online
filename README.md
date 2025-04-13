# 🩸 BloodConnect: Bridging Lives Online

**BloodConnect** is a full-stack platform designed to bridge the gap between **blood donors and recipients** through a hospital-mediated, secure workflow. It ensures smooth, reliable, and secure blood donation coordination.

## 🚀 Project Overview

This application allows:
- **General users** to register and choose roles as **Donors** or **Recipients**
- **Recipients** to request blood from nearby donors via hospitals
- **Hospitals** to manage and approve blood requests
- **Donors** to view and accept approved blood requests
- **Admins** to confirm donations and issue certificates

## 🛠️ Tech Stack

### Frontend:
- React Native
- Axios for API calls
- React Navigation
- Expo for development

### Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for session handling
- Twilio for SMS notifications

### Other Tools:
- AES Encryption for sensitive data
- Git & GitHub for version control
- Emailing donation certificates
- RESTful APIs

---

## 📲 Features

### 👤 User Roles
- **Recipient**:
  - Register/login with Username and Password
  - Select a hospital
  - View and request from nearby donors
  - Receive SMS notifications when a donor accepts

- **Donor**:
  -Register/login with Username and Password
  - View approved requests from nearby hospitals
  - Accept requests and receive recipient details
  - Track donations and receive certificate post-donation

- **Hospital Admin**:
  - Login with secure credentials
  - View incoming requests from recipients
  - Approve or reject requests
  - Confirm successful donations
  - Trigger certificate generation

---

## 📜 User Flow

1. **Login/Register**
2. **Role Selection (Donor/Recipient)**
3. **Recipients select hospital & request blood**
4. **Request sent to Hospital Admin**
5. **Hospital approves → Notifies Donor**
6. **Donor accepts → Receives recipient info**
7. **Hospital confirms donation**
8. **Certificate emailed to Donor**

---
**⚙️ How to Run Locally**:
**Backend**
cd BloodConnect-Backend
npm install
npm start

**Frontend**
cd BloodConnect-FrontEnd/Frontend
npm install
npx expo start

---

## Author
Challa Sriniketh,
Email:srinikethchalla6304@gmail.com
