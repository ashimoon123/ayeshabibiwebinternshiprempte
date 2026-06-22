import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'student',
    department: '',
    semester: '',
  });

  const { name, email, password, password2, role, department, semester } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        name,
        email,
        password,
        role,
        department,
        semester: semester ? Number(semester) : undefined,
      };

      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">
                <i className="bi bi-person-plus me-2"></i>Register
              </h2>
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Enter password"
                    required
                    minLength="6"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password2" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password2"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    placeholder="Confirm password"
                    required
                    minLength="6"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={role}
                    onChange={onChange}
                  >
                    <option value="student">Student</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="department" className="form-label">
                    Department
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="department"
                    name="department"
                    value={department}
                    onChange={onChange}
                    placeholder="Enter your department"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="semester" className="form-label">
                    Semester
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="semester"
                    name="semester"
                    value={semester}
                    onChange={onChange}
                    placeholder="Enter your semester"
                    min="1"
                    max="12"
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                Already have an account? <Link to="/login">Login here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
