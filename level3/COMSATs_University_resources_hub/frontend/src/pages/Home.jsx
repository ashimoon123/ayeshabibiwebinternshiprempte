import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Welcome to COMSATS Resource Hub
              </h1>
              <p className="lead mb-4">
                Your one-stop platform for notes, lectures, past papers, and more.
                Connect with fellow students and excel in your studies.
              </p>
              {!user ? (
                <div>
                  <Link to="/register" className="btn btn-light btn-lg me-3">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg">
                    Login
                  </Link>
                </div>
              ) : (
                <div>
                  <Link to="/notes" className="btn btn-light btn-lg me-3">
                    Browse Notes
                  </Link>
                  <Link to="/forum" className="btn btn-outline-light btn-lg">
                    Join Discussion
                  </Link>
                </div>
              )}
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="text-center">
                <i className="bi bi-bookshelf display-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">What We Offer</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 card-hover">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-file-earmark-pdf display-4 text-primary"></i>
                  </div>
                  <h5 className="card-title">Notes Sharing</h5>
                  <p className="card-text">
                    Access and share high-quality notes from fellow students.
                    Rate and download notes easily.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 card-hover">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-play-circle display-4 text-primary"></i>
                  </div>
                  <h5 className="card-title">Recorded Lectures</h5>
                  <p className="card-text">
                    Watch recorded lectures anytime, anywhere.
                    Support for YouTube links and direct uploads.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 card-hover">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-file-earmark-text display-4 text-primary"></i>
                  </div>
                  <h5 className="card-title">Past Papers</h5>
                  <p className="card-text">
                    Prepare for exams with past papers from previous semesters.
                    Filter by subject and year.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 card-hover">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-calculator display-4 text-primary"></i>
                  </div>
                  <h5 className="card-title">GPA Calculator</h5>
                  <p className="card-text">
                    Calculate your SGPA and CGPA easily.
                    Save your GPA records for future reference.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 card-hover">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-chat-dots display-4 text-primary"></i>
                  </div>
                  <h5 className="card-title">Discussion Forum</h5>
                  <p className="card-text">
                    Ask questions, share knowledge, and connect with peers.
                    Real-time updates and notifications.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 card-hover">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-person-check display-4 text-primary"></i>
                  </div>
                  <h5 className="card-title">Role-Based Access</h5>
                  <p className="card-text">
                    Students, moderators, and admins each have tailored access
                    to ensure a safe and productive platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
