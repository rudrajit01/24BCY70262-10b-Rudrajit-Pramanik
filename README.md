# 🚀 Advanced User Authentication & Content Management System

A full-stack application featuring a secure **JWT-based authentication** flow and a highly polished, glassmorphic UI. This project demonstrates modern frontend routing techniques and backend security best practices.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18%2B-brightgreen)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Protected Routing Logic](#protected-routing-logic)
- [UI/UX Implementation](#uiux-implementation)
- [Installation & Usage](#installation--usage)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

## 🔍 Project Overview

This full-stack application provides:

- **Secure JWT Authentication** – Register, login, and protected routes.
- **Post Management** – Create and fetch posts (authenticated users only).
- **Glassmorphic UI** – Modern, animated login and dashboard interface.
- **Responsive Design** – Works on desktop, tablet, and mobile.

**Tech Stack:**
- **Frontend:** React.js, React Router, Axios, CSS3 (Glassmorphism)
- **Backend:** Node.js, Express.js, MongoDB, JWT, bcryptjs
- **Styling:** Custom CSS with animated gradients and floating shapes

---

## 📡 API Documentation

The backend is built with Express.js and follows RESTful principles.

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate user & return JWT | Public |

### Posts Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/posts` | Fetch all posts | Private (Requires Token) |
| POST | `/api/posts` | Create a new post | Private (Requires Token) |

> **Authentication**: For protected routes, include the JWT token in the `Authorization` header:  
> `Authorization: Bearer <your_token>`

---

## 🔐 Environment Variables

To run this project, you need to add the following environment variables to your **`.env`** file in the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
⚠️ Never commit your .env file – add it to .gitignore.

🛡 Protected Routing Logic
One of the core features of this app is the Authentication Guard. It prevents unauthorized users from accessing internal pages by checking the browser's localStorage before rendering a component.

javascript
// Example of the logic used in App.js (or a PrivateRoute wrapper)
const isAuthenticated = () => localStorage.getItem('token') !== null;

<Route 
  path="/create" 
  element={isAuthenticated() ? <CreatePost /> : <Navigate to="/login" />} 
/>
For more complex checks (token expiration, user roles), you can extend this with a custom hook:

javascript
// useAuth.js
export const useAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  // Optional: verify token expiry with jwt-decode
  return true;
};
🎨 UI/UX Implementation
The login interface focuses on Visual Hierarchy and User Feedback:

Mesh Gradients: Created using CSS linear-gradient with a 400% background size, animated on a 15-second infinite loop.

Glassmorphism: Achieved using backdrop-filter: blur() and semi-transparent RGBA backgrounds.

Loading States: The login button dynamically changes to "Processing..." and disables itself during API calls to prevent duplicate requests.

Accessibility: Input fields feature high-contrast borders (#e2e8f0) to ensure they are visible on both white and colorful backgrounds.

Floating Shapes: Animated bubbles that enhance visual appeal without distracting the user.

Screenshot Preview (add your own image URL):

https://via.placeholder.com/800x400?text=Glassmorphic+Login+Screen

🏗 Installation & Usage
Prerequisites
Node.js (v18 or higher)

MongoDB (local or Atlas)

npm or yarn

Clone & Install
bash
git clone https://github.com/rudrajit01/24BCY70262-10b-Rudrajit-Pramanik.git
cd 24BCY70262-10b-Rudrajit-Pramanik
Backend Setup
bash
cd backend
npm install
# Create .env file with your variables (see above)
npm start   # Runs on http://localhost:5000
Frontend Setup
bash
cd frontend
npm install
npm start   # Runs on http://localhost:3000
Note: If you have a root package.json with a combined script, you can run npm run install-all and npm run dev.

Database
Ensure your MongoDB instance is running (local mongod or MongoDB Atlas connection string in .env).

📈 Future Roadmap
Implement Password Reset via Email (Nodemailer + reset tokens)

Add User Profile Picture uploads using Cloudinary

Integrate Google OAuth for one-click login

Add Post Editing & Deletion functionality

Implement Pagination for posts feed

Add Dark/Light mode toggle

📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

👤 Author
Rudrajit Pramanik

GitHub: @rudrajit01

Academic Reference: 24BCY70262

⭐ Show Your Support
If you found this project helpful, please give it a ⭐ on GitHub!
