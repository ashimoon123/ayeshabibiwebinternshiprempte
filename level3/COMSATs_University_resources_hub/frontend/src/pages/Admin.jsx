import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../services/api';
import Spinner from '../components/Spinner';

const Admin = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [pastPapers, setPastPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'moderator')) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [usersRes, notesRes, lecturesRes, pastPapersRes] = await Promise.all([
        api.get('/users'),
        api.get('/notes'),
        api.get('/lectures'),
        api.get('/pastpapers'),
      ]);
      setUsers(usersRes.data);
      setNotes(notesRes.data);
      setLectures(lecturesRes.data);
      setPastPapers(pastPapersRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
        toast.success('User deleted');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/notes/${id}`);
        setNotes(notes.filter(n => n._id !== id));
        toast.success('Note deleted');
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  const deleteLecture = async (id) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await api.delete(`/lectures/${id}`);
        setLectures(lectures.filter(l => l._id !== id));
        toast.success('Lecture deleted');
      } catch (error) {
        toast.error('Failed to delete lecture');
      }
    }
  };

  const deletePastPaper = async (id) => {
    if (window.confirm('Are you sure you want to delete this past paper?')) {
      try {
        await api.delete(`/pastpapers/${id}`);
        setPastPapers(pastPapers.filter(p => p._id !== id));
        toast.success('Past paper deleted');
      } catch (error) {
        toast.error('Failed to delete past paper');
      }
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await api.put(`/users/${id}`, { role });
      setUsers(users.map(u => u._id === id ? { ...u, role } : u));
      toast.success('User role updated');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  if (isLoading) return <Spinner />;
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-lock display-1 text-muted"></i>
        <h4 className="mt-3">Access Denied</h4>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">
        <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
      </h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'lectures' ? 'active' : ''}`}
            onClick={() => setActiveTab('lectures')}
          >
            Lectures
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'pastpapers' ? 'active' : ''}`}
            onClick={() => setActiveTab('pastpapers')}
          >
            Past Papers
          </button>
        </li>
      </ul>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div>
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card text-center bg-primary text-white">
                <div className="card-body">
                  <i className="bi bi-people display-4"></i>
                  <h3 className="mt-2">{users.length}</h3>
                  <p className="mb-0">Users</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center bg-success text-white">
                <div className="card-body">
                  <i className="bi bi-file-earmark-pdf display-4"></i>
                  <h3 className="mt-2">{notes.length}</h3>
                  <p className="mb-0">Notes</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center bg-info text-white">
                <div className="card-body">
                  <i className="bi bi-play-circle display-4"></i>
                  <h3 className="mt-2">{lectures.length}</h3>
                  <p className="mb-0">Lectures</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center bg-warning text-dark">
                <div className="card-body">
                  <i className="bi bi-file-earmark-text display-4"></i>
                  <h3 className="mt-2">{pastPapers.length}</h3>
                  <p className="mb-0">Past Papers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        {user.role === 'admin' ? (
                          <select
                            className="form-select form-select-sm"
                            value={u.role}
                            onChange={(e) => updateUserRole(u._id, e.target.value)}
                          >
                            <option value="student">Student</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          u.role
                        )}
                      </td>
                      <td>{u.department || '-'}</td>
                      <td>{u.semester || '-'}</td>
                      <td>
                        {user.role === 'admin' && u._id !== user._id && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteUser(u._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {activeTab === 'notes' && (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Course Code</th>
                    <th>Uploaded By</th>
                    <th>Downloads</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((n) => (
                    <tr key={n._id}>
                      <td>{n.title}</td>
                      <td>{n.department}</td>
                      <td>{n.courseCode}</td>
                      <td>{n.uploadedBy?.name}</td>
                      <td>{n.downloadCount}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteNote(n._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Lectures */}
      {activeTab === 'lectures' && (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Course Code</th>
                    <th>Uploaded By</th>
                    <th>Views</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lectures.map((l) => (
                    <tr key={l._id}>
                      <td>{l.title}</td>
                      <td>{l.department}</td>
                      <td>{l.courseCode}</td>
                      <td>{l.uploadedBy?.name}</td>
                      <td>{l.views}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteLecture(l._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Past Papers */}
      {activeTab === 'pastpapers' && (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Year</th>
                    <th>Uploaded By</th>
                    <th>Downloads</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pastPapers.map((p) => (
                    <tr key={p._id}>
                      <td>{p.title}</td>
                      <td>{p.subject}</td>
                      <td>{p.year}</td>
                      <td>{p.uploadedBy?.name}</td>
                      <td>{p.downloadCount}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deletePastPaper(p._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
