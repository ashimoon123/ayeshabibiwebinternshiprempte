import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getNotes, uploadNote, likeNote, rateNote } from '../features/notes/notesSlice';
import Spinner from '../components/Spinner';

const Notes = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notes, isLoading, isError, message } = useSelector((state) => state.notes);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    department: '',
    semester: '',
    courseCode: '',
    file: null,
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getNotes());
  }, [dispatch, isError, message]);

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    if (search) filters.search = search;
    if (department) filters.department = department;
    if (semester) filters.semester = semester;
    if (courseCode) filters.courseCode = courseCode;
    dispatch(getNotes(filters));
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadData.file) {
      toast.error('Please select a file');
      return;
    }
    dispatch(uploadNote(uploadData));
    setShowUploadModal(false);
    setUploadData({
      title: '',
      description: '',
      department: '',
      semester: '',
      courseCode: '',
      file: null,
    });
    toast.success('Note uploaded successfully!');
  };

  const handleLike = (id) => {
    if (!user) {
      toast.error('Please login first');
      return;
    }
    dispatch(likeNote(id));
  };

  const handleRate = (id, rating) => {
    if (!user) {
      toast.error('Please login first');
      return;
    }
    dispatch(rateNote({ id, rating }));
  };

  const handleDownload = async (id, file) => {
    try {
      const response = await fetch(`/uploads/${file}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-file-earmark-pdf me-2"></i>Notes
        </h2>
        {user && (
          <button
            className="btn btn-primary"
            onClick={() => setShowUploadModal(true)}
          >
            <i className="bi bi-upload me-2"></i>Upload Note
          </button>
        )}
      </div>

      {/* Search Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Course Code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="row g-4">
        {notes.map((note) => (
          <div key={note._id} className="col-md-6 col-lg-4">
            <div className="card h-100 card-hover">
              <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <p className="card-text text-muted small">
                  {note.description}
                </p>
                <div className="mb-2">
                  <span className="badge bg-primary me-2">
                    {note.department}
                  </span>
                  <span className="badge bg-secondary me-2">
                    Semester {note.semester}
                  </span>
                  <span className="badge bg-info">{note.courseCode}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">
                    By: {note.uploadedBy?.name}
                  </small>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-star text-warning me-1"></i>
                    <span>{note.averageRating?.toFixed(1) || 0}</span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-outline-primary btn-sm flex-grow-1 ${
                      user && note.likes?.includes(user._id) ? 'active' : ''
                    }`}
                    onClick={() => handleLike(note._id)}
                  >
                    <i className="bi bi-heart me-1"></i>
                    {note.likes?.length || 0}
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm flex-grow-1"
                    onClick={() => handleDownload(note._id, note.file)}
                  >
                    <i className="bi bi-download me-1"></i>
                    {note.downloadCount || 0}
                  </button>
                </div>
                <div className="mt-2">
                  <small className="text-muted">Rate:</small>
                  <div className="d-flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => handleRate(note._id, r)}
                      >
                        <i
                          className={`bi ${
                            r <= Math.round(note.averageRating || 0)
                              ? 'bi-star-fill text-warning'
                              : 'bi-star text-muted'
                          }`}
                        ></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <h4 className="mt-3">No notes found</h4>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Note</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUploadModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUploadSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={uploadData.title}
                      onChange={(e) =>
                        setUploadData({ ...uploadData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={uploadData.description}
                      onChange={(e) =>
                        setUploadData({
                          ...uploadData,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={uploadData.department}
                        onChange={(e) =>
                          setUploadData({
                            ...uploadData,
                            department: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Semester</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={uploadData.semester}
                        onChange={(e) =>
                          setUploadData({
                            ...uploadData,
                            semester: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Course Code</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={uploadData.courseCode}
                        onChange={(e) =>
                          setUploadData({
                            ...uploadData,
                            courseCode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">File</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      required
                      onChange={(e) =>
                        setUploadData({
                          ...uploadData,
                          file: e.target.files[0],
                        })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
