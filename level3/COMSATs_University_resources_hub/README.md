# COMSATS University Resource Hub

A full-stack MERN application for COMSATS students to share and access academic resources.

## Features

### User Authentication & Authorization
- Student/Moderator/Admin registration and login
- JWT-based authentication
- Password hashing with bcrypt
- User profile management
- Role-based access control

### Notes Sharing System
- Upload notes (PDF, DOCX, PPT)
- Categorize by Department, Semester, Course Code
- Search and filter notes
- Download notes
- Like and rate notes
- View upload history

### Recorded Lectures Module
- Upload lecture videos (or YouTube links)
- Course-wise categorization
- Video player integration
- Lecture search functionality

### Past Papers Repository
- Upload past papers
- Filter by Subject, Semester, Year
- Download functionality
- Admin/Moderator approval system

### GPA Calculator
- Dynamic GPA calculator
- SGPA calculation
- CGPA calculation
- Grade conversion table
- Semester-wise GPA tracking
- Save GPA records

### Discussion Forum
- Create questions and topics
- Comment and reply system
- Upvote/Downvote feature
- Category-wise discussions
- Real-time updates with Socket.io

### Admin Dashboard
- Manage users
- Manage notes
- Manage lectures
- Manage past papers
- Manage forum posts
- Analytics dashboard
- Reported content management

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Socket.io for real-time features

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- Bootstrap 5 for UI
- React Toastify for notifications
- Axios for API calls

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/comsats-resource-hub
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
COMSATs_University_resources_hub/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── noteController.js
│   │   ├── lectureController.js
│   │   ├── pastPaperController.js
│   │   ├── forumController.js
│   │   └── gpaController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Note.js
│   │   ├── Lecture.js
│   │   ├── PastPaper.js
│   │   ├── ForumPost.js
│   │   └── GPARecord.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── noteRoutes.js
│   │   ├── lectureRoutes.js
│   │   ├── pastPaperRoutes.js
│   │   ├── forumRoutes.js
│   │   └── gpaRoutes.js
│   ├── uploads/                  # File uploads directory
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── upload.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── app/
    │   │   └── store.js           # Redux store
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   └── Spinner.jsx
    │   ├── features/
    │   │   ├── auth/
    │   │   │   └── authSlice.js
    │   │   ├── notes/
    │   │   │   └── notesSlice.js
    │   │   ├── lectures/
    │   │   │   └── lecturesSlice.js
    │   │   ├── pastPapers/
    │   │   │   └── pastPapersSlice.js
    │   │   ├── forum/
    │   │   │   └── forumSlice.js
    │   │   └── gpa/
    │   │       └── gpaSlice.js
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Notes.jsx
    │   │   ├── Lectures.jsx
    │   │   ├── PastPapers.jsx
    │   │   ├── Forum.jsx
    │   │   └── GPACalculator.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/users` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes` - Upload note (protected)
- `PUT /api/notes/:id` - Update note (protected)
- `DELETE /api/notes/:id` - Delete note (protected)
- `POST /api/notes/:id/like` - Like note (protected)
- `POST /api/notes/:id/rate` - Rate note (protected)

### Lectures
- `GET /api/lectures` - Get all lectures
- `GET /api/lectures/:id` - Get lecture by ID
- `POST /api/lectures` - Upload lecture (protected)
- `PUT /api/lectures/:id` - Update lecture (protected)
- `DELETE /api/lectures/:id` - Delete lecture (protected)

### Past Papers
- `GET /api/pastpapers` - Get all approved past papers
- `GET /api/pastpapers/pending` - Get pending past papers (admin/moderator)
- `POST /api/pastpapers` - Upload past paper (protected)
- `PUT /api/pastpapers/:id/approve` - Approve past paper (admin/moderator)
- `DELETE /api/pastpapers/:id` - Delete past paper (protected)

### Forum
- `GET /api/forum` - Get all posts
- `GET /api/forum/:id` - Get post by ID
- `POST /api/forum` - Create post (protected)
- `POST /api/forum/:id/upvote` - Upvote post (protected)
- `POST /api/forum/:id/downvote` - Downvote post (protected)
- `GET /api/forum/:postId/comments` - Get comments for post
- `POST /api/forum/:postId/comments` - Add comment (protected)

### GPA Calculator
- `POST /api/gpa/calculate` - Calculate GPA (protected)
- `POST /api/gpa` - Save GPA record (protected)
- `GET /api/gpa` - Get user's GPA records (protected)
- `GET /api/gpa/conversion` - Get grade conversion table

## Usage

1. Register an account (select role: Student/Moderator/Admin)
2. Login with your credentials
3. Explore the platform:
   - Upload and download notes
   - Watch recorded lectures
   - Access past papers
   - Use the GPA calculator
   - Participate in forum discussions
4. Admins/Moderators can approve past papers and manage content

## License

MIT
