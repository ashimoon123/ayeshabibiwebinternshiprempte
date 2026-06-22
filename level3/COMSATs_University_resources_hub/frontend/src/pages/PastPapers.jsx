import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getPastPapers, uploadPastPaper, approvePastPaper, getPendingPastPapers } from '../features/pastPapers/pastPapersSlice';
import Spinner from '../components/Spinner';

const PastPapers = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { pastPapers, pendingPapers, isLoading, isError, message } = useSelector((state) => state.pastPapers);

  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    subject: '',
    semester: '',
    year: '',
    file: null,
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getPastPapers());
    if (user && (user.role === 'admin' || user.role === 'moderator')) {
      dispatch(getPendingPastPapers());
    }
  }, [dispatch, isError, message, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    if (search) filters.search = search;
    if (subject) filters.subject = subject;
    if (semester) filters.semester = semester;
    if (year) filters.year = year;
    dispatch(getPastPapers(filters));
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadData.file) {
      toast.error('Please select a file');
      return;
    }
    dispatch(uploadPastPaper(uploadData));
    setShowUploadModal(false);
    setUploadData({
      title: '',
      description: '',
      subject: '',
      semester: '',
      year: '',
      file: null,
    });
    toast.success('Past paper uploaded! Waiting for approval.');
  };

  const handleApprove = (id) => {
    dispatch(approvePastPaper(id));
    toast.success('Past paper approved!');
  };

  const handleDownload = async (file) => {
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
          <i className="bi bi-file-earmark-text me-2"></i>Past Papers
        </h2>
        {user && (
          <button
            className="btn btn-primary"
            onClick={() => setShowUploadModal(true)}
          >
            <i className="bi bi-upload me-2"></i>Upload Past Paper
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
                  placeholder="Search papers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="col-md-3">
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
                  type="number"
                  className="form-control"
                  placeholder="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </div>
            <div className="d-grid mt-3">
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Pending Papers (Admin/Moderator) */}
      {user && (user.role === 'admin' || user.role === 'moderator') && pendingPapers.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-warning text-dark">
            <h5 className="mb-0">
              <i className="bi bi-clock me-2"></i>Pending Approval
            </h5>
          </div>
          <div className="card-body">
            <div className="list-group">
              {pendingPapers.map((paper) => (
                <div key={paper._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{paper.title}</h6>
                    <small className="text-muted">
                      {paper.subject} - Semester {paper.semester} ({paper.year})
                    </small>
                    <br />
                    <small className="text-muted">
                      Uploaded by: {paper.uploadedBy?.name}
                    </small>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(paper._id)}
                  >
                    <i className="bi bi-check-lg me-1"></i>Approve
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Past Papers Grid */}
      <div className="row g-4">
        {pastPapers.map((paper) => (
          <div key={paper._id} className="col-md-6 col-lg-4">
            <div className="card h-100 card-hover">
              <div className="card-body">
                <h5 className="card-title">{paper.title}</h5>
                <p className="card-text text-muted small">
                  {paper.description}
                </p>
                <div className="mb-2">
                  <span className="badge bg-primary me-2">
                    {paper.subject}
                  </span>
                  <span className="badge bg-secondary me-2">
                    Semester {paper.semester}
                  </span>
                  <span className="badge bg-info">{paper.year}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">
                    By: {paper.uploadedBy?.name}
                  </small>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-download text-primary me-1"></i>
                    <span>{paper.downloadCount || 0}</span>
                  </div>
                </div>
                <button
                  className="btn btn-outline-success w-100"
                  onClick={() => handleDownload(paper.file)}
                >
                  <i className="bi bi-download me-2"></i>Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pastPapers.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <h4 className="mt-3">No past papers found</h4>
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
                <h5 className="modal-title">Upload Past Paper</h5>
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
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={uploadData.subject}
                        onChange={(e) =>
                          setUploadData({
                            ...uploadData,
                            subject: e.target.value,
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
                      <label className="form-label">Year</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={uploadData.year}
                        onChange={(e) =>
                          setUploadData({
                            ...uploadData,
                            year: e.target.value,
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
                      accept=".pdf,.doc,.docx"
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

export default PastPapers;
