import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
