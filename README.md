# 🏋️ Online Fitness Class Booking Platform - Backend

This is the backend API for an Online Fitness Class Booking Platform built using the MERN stack.

The backend provides REST APIs for authentication, users, trainers, fitness classes, bookings, feedback, payments, schedules, and admin management.

---

## 🚀 Features

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Role-based authentication
- User role
- Trainer role
- Admin role

---

### 👤 User

- User registration and login
- User profile
- Update profile
- View bookings
- Booking statistics
- Upcoming bookings
- Completed bookings
- Feedback management

---

### 🧑‍🏫 Trainer

- Get all trainers
- Get trainer by ID
- Create trainer
- Update trainer profile
- Upload trainer profile image
- Delete trainer
- Trainer dashboard
- Trainer bookings
- Trainer students
- Trainer reviews
- Trainer rating
- Trainer schedule
- Add schedule
- Delete schedule
- Online meeting link

---

### 📚 Fitness Classes

- Create fitness class
- Get all classes
- Get class by ID
- Update class
- Delete class
- Assign trainer
- Class schedule
- Class time slots
- Class seats
- Class image
- Online meeting link

---

### 📅 Bookings

- Create booking
- View user bookings
- View trainer bookings
- Select class time slot
- Booking status
- Payment status
- Cancel booking
- Complete booking
- Booking history

---

### 💳 Payment

The project currently uses a dummy payment flow.

Booking stores:

- Payment status
- Payment ID
- Order ID
- Signature

---

### ⭐ Feedback & Reviews

- Submit trainer rating
- Submit class feedback
- Get trainer reviews
- Calculate average trainer rating
- Track feedback given by users

---

### 👨‍💼 Admin

Admin dashboard provides:

- Total Users
- Total Trainers
- Total Classes
- Total Bookings
- Total Revenue
- Paid Bookings
- Total Feedback
- Today's Bookings
- Recent Bookings

Admin can also manage:

- Users
- Trainers
- Classes
- Bookings

---

# 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Cloudinary
- Multer
- CORS
- dotenv

---

# 📁 Project Structure

```text
backend/
│
├── Controllers/
│   ├── adminController.js
│   ├── trainerController.js
│   ├── userController.js
│   ├── classController.js
│   ├── bookingController.js
│   └── feedbackController.js
│
├── Models/
│   ├── user.js
│   ├── class.js
│   ├── booking.js
│   └── feedback.js
│
├── Routes/
│   ├── adminRoutes.js
│   ├── trainerRoutes.js
│   ├── userRoutes.js
│   ├── classRoutes.js
│   ├── bookingRoutes.js
│   └── feedbackRoutes.js
│
├── Middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── config/
│   ├── db.js
│   └── multer.js
│
├── uploads/
│
├── .env
├── .gitignore
├── package.json
└── server.js