import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import Lectures from './pages/Lectures';
import PastPapers from './pages/PastPapers';
import Forum from './pages/Forum';
import GPACalculator from './pages/GPACalculator';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/lectures" element={<Lectures />} />
        <Route path="/pastpapers" element={<PastPapers />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/gpa" element={<GPACalculator />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
