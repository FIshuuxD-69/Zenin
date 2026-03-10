MangaZone2
MangaZone2 is a comprehensive MERN stack web application designed for personal manga collection management. Users can track their reading progress, rate their favorite series, and maintain a detailed catalog of their manga collection.

🚀 Features
Personal Dashboard: View your entire manga collection at a glance with beautiful cards.
Manga Management (CRUD):
Create: Add new manga entries with detailed metadata (Title, Author, Genre, Chapters, etc.).
Read: View detailed information about specific manga series.
Update: Keep your collection up to date by editing series information or reading status.
Delete: Easily remove series from your collection.
Advanced Filtering & Sorting:
Search by manga title.
Filter by Genre and Author.
Sort by release year, title, or rating.
Reading Status Tracking: Categorize manga as 'Ongoing', 'Completed', or 'Cancelled'.
Responsive Design: Fully responsive UI built with Tailwind CSS for a seamless experience across devices.
🛠️ Tech Stack
Frontend
React 19: Modern UI library for building dynamic components.
Vite: Ultra-fast build tool and development server.
Tailwind CSS: Utility-first CSS framework for modern styling.
React Router Dom: Client-side routing for navigating between pages.
Axios: Promised-based HTTP client for API requests.
Lucide React: Clean and consistent icon set.
React Hot Toast: Beautiful notifications for user actions.
Backend
Node.js: JavaScript runtime for the backend server.
Express.js: Minimal and flexible web application framework.
MongoDB & Mongoose: NoSQL database for flexible data storage and object modeling.
Dotenv: Environment variable management.
CORS: Cross-origin resource sharing configuration.
📁 Project Structure
text
Zenin/
├── backend/            # Express Server & API
│   ├── src/
│   │   ├── config/     # Database connection
│   │   ├── controllers/# API logic
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # API endpoints
│   │   └── server.js   # Entry point
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # View components
│   │   ├── context/    # State management
│   │   └── lib/        # Axios configuration
⚙️ Installation & Setup
Prerequisites
Node.js (v18 or higher)
MongoDB account (Atlas or local instance)
Backend Setup
Navigate to the backend directory: cd backend
Install dependencies: npm install
Create a .env file in the backend directory and add:
env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
Start the server: npm run dev
Frontend Setup
Navigate to the frontend directory: cd frontend
Install dependencies: npm install
Start the development server: npm run dev
🔗 API Endpoints
Method	Endpoint	Description
GET	/manga	Get all manga (supports search, filter, sort)
GET	/manga/:id	Get specific manga by ID
POST	/manga	Add a new manga
PUT	/manga/:id	Update an existing manga
DELETE	/manga/:id	Delete a manga
📝 License
This project is licensed under the ISC License.
