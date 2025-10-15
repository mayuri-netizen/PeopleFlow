import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import UserListPage from './pages/UserListPage';
import UserFormPage from './pages/UserFormPage';
import UserDetailsPage from './pages/UserDetailsPage';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <main className="container">
        {/* Using location.key to ensure re-render for animations */}
        <div key={location.key} className="page">
          <Routes>
            <Route path="/" element={<UserListPage />} />
            <Route path="/add" element={<UserFormPage />} />
            <Route path="/edit/:id" element={<UserFormPage />} />
            <Route path="/view/:id" element={<UserDetailsPage />} />
          </Routes>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default App;
