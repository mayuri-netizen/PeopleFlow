PeopleFlow - Full-Stack User Management Dashboard
<div align="center">
<img src="./client/public/peopleflow-logo.png" alt="PeopleFlow Logo" width="400"/>
</div>

<p align="center">
A complete and feature-rich MERN stack application for managing user data. This responsive dashboard provides full CRUD (Create, Read, Update, Delete) functionality, professional image uploads, data export, and a polished user interface.
</p>

✨ Key Features
Full CRUD Operations: Seamlessly add, view, edit, and delete user records.

Cloud-Based Image Uploads: Users can upload profile pictures, which are professionally handled and stored using Cloudinary.

Server-Side Search & Pagination: Efficiently search through users and navigate large datasets with server-side pagination.

Export to CSV: Download the entire user list as a CSV file with a single click.

Robust Form Validation: Comprehensive client-side validation ensures data integrity.

Professional UI/UX:

Skeleton Loaders: Smooth loading states prevent content jarring.

Custom Modals: Elegant confirmation modals for critical actions like deleting a user.

Notifications: Interactive "toast" notifications for success and error feedback.

Fully Responsive Design: A seamless experience across all devices, from mobile phones to desktops.

🛠️ Tech Stack
Category

Technology

Frontend

React, Vite, React Router, Axios, React Hook Form, Yup, React Toastify, React Icons

Backend

Node.js, Express.js, MongoDB

Database ODM

Mongoose

Image Hosting

Cloudinary

File Handling

Multer

Validation

express-validator

CSV Generation

json2csv

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18 or later)

A free MongoDB Atlas account

A free Cloudinary account

Installation
Clone the repository:

git clone [https://github.com/your-username/peopleflow.git](https://github.com/your-username/peopleflow.git)
cd peopleflow

Setup the Backend:

cd server
npm install

Create a .env file in the server directory and add the following variables:

MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Then, start the backend server:

npm start

Setup the Frontend:
(Open a new terminal window)

cd client
npm install
npm run dev

The application will be available at http://localhost:5173.

📜 API Endpoints
Method

Endpoint

Description

POST

/api/users

Create a new user (with image upload)

GET

/api/users

Get all users (supports search & pagination)

GET

/api/users/:id

Get a single user by their ID

PUT

/api/users/:id

Update a user (with optional image upload)

DELETE

/api/users/:id

Delete a user

GET

/api/users/export

Export all users to a CSV file

This README.md file should be placed in the root directory of your project (the bits-and-volts-app folder). When you push your code to GitHub, this will automatically become the project's beautiful homepage.

Next Steps: GitHub and Vercel
You are now ready to put your code on GitHub and deploy it. I will guide you through those steps next.