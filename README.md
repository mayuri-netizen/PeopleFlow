# **PeopleFlow - A Full-Stack User Management Dashboard**

PeopleFlow is a complete, full-stack web application designed for managing user data. It features a modern, responsive UI, cloud-based image uploads, server-side search and pagination, and a full suite of CRUD functionalities, making it a comprehensive solution for user administration.

**Live Application:** https://people-flow-sigma.vercel.app/

---
<img width="500" height="500" alt="Screenshot 2025-10-16 111946" src="https://github.com/user-attachments/assets/10189e33-b276-4be5-8c4c-d92e4aaa6944" />

---

## **Features**

- **Full CRUD Operations**: Seamlessly add, view, edit, and delete user records with a clean and intuitive interface.
- **Cloud-Based Image Uploads**: Users can upload profile pictures, which are professionally handled and stored using **Cloudinary**.
- **Server-Side Search & Pagination**: Efficiently search through users and navigate large datasets with server-side pagination to ensure high performance.
- **Export to CSV**: Download the entire user list as a CSV file with a single click for reporting or data analysis.
- **Robust Form Validation**: Comprehensive client-side validation using React Hook Form and Yup ensures data integrity before API calls are made.
- **Professional UI/UX**:
    - **Skeleton Loaders:** Smooth loading states prevent content jarring and improve the perceived performance of the application.
    - **Custom Modals:** Elegant confirmation modals for critical actions like deleting a user, providing a better user experience than native browser popups.
    - **Toast Notifications:** Interactive notifications for success and error feedback, keeping the user informed of application events.
- **Responsive Design**: A fluid user interface that works perfectly on all devices, from small mobile phones to large desktops.

---

## **Tech Stack**

- **Frontend**: React (with Vite), React Router, Plain CSS, Axios, React Hook Form
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Image Management**: Cloudinary (for cloud storage), Multer (for file handling)
- **Deployment**:
    - **Frontend:** Vercel
    - **Backend:** Render

---

## **Getting Started**

To run this application locally, you will need to set up both the backend server and the frontend client.

### **Prerequisites**

- Node.js (v18.x or later)
- npm (or yarn)
- MongoDB Atlas account (for the database)
- Cloudinary account (for image hosting)

### **Backend Setup (`/server`)**

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    In the `/server` directory, create a new file named `.env` and add the following environment variables.
    ```
    MONGO_URI=<your_mongodb_connection_string>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    ```
    - Get your `MONGO_URI` from your MongoDB Atlas cluster.
    - Get your Cloudinary credentials from your Cloudinary dashboard.

4.  **Run the server:**
    ```bash
    npm start
    ```
    The backend API will be running at `http://localhost:5000`.

### **Frontend Setup (`/client`)**

1.  **Open a new terminal window.**

2.  **Navigate to the client directory:**
    ```bash
    cd client
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Create a `.env` file:**
    In the `/client` directory, create a new file named `.env` and add the following environment variable to connect to your local backend.
    ```
    VITE_API_BASE_URL=http://localhost:5000
    ```

5.  **Run the React development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

---

## **Deployment**

This application is deployed using a split-deployment strategy, which is a standard practice for MERN applications.

- The **backend** (`server`) is deployed as a "Web Service" on Render. The `Root Directory` is set to `server`, and all necessary environment variables (`MONGO_URI`, Cloudinary keys) are configured in the Render dashboard.
- The **frontend** (`client`) is deployed on Vercel. The `Root Directory` is set to `client`. An environment variable named `VITE_API_BASE_URL` is configured in the Vercel project settings with the URL of the live Render backend.
- **Continuous Deployment** is enabled on both platforms. Any `git push` to the `main` branch will automatically trigger new deployments on both Render and Vercel.
