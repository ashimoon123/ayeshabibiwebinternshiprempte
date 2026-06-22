import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getLectures, uploadLecture } from '../features/lectures/lecturesSlice';
import Spinner from '../components/Spinner';

const Lectures = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { lectures, isLoading, isError, message } = useSelector((state) => state.lectures);

  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    department: '',
    semester: '',
    courseCode: '',
    videoUrl: '',
    videoFile: null,
    isYouTube: false,
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getLectures());
  }, [dispatch, isError, message]);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (uploadData.isYouTube && !uploadData.videoUrl) {
      toast.error('Please enter YouTube URL');
      return;
    }
    if (!uploadData.isYouTube && !uploadData.videoFile) {
      toast.error('Please select a video file');
      return;
    }
    dispatch(uploadLecture(uploadData));
    setShowUploadModal(false);
    setUploadData({
      title: '',
      description: '',
      department: '',
      semester: '',
      courseCode: '',
      videoUrl: '',
      videoFile: null,
      isYouTube: false,
    });
    toast.success('Lecture uploaded successfully!');
  };

  const getYouTubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-play-circle me-2"></i>Recorded Lectures
        </h2>
        {user && (
          <button
            className="btn btn-primary"
            onClick={() => setShowUploadModal(true)}
          >
            <i className="bi bi-upload me-2"></i>Upload Lecture
          </button>
        )}
      </div>

      <div className="row g-4">
        {lectures.map((lecture) => (
          <div key={lecture._id} className="col-md-6 col-lg-4">
            <div className="card h-100 card-hover">
              <div className="ratio ratio-16x9">
                {lecture.isYouTube ? (
                  <iframe
                    src={getYouTubeEmbedUrl(lecture.videoUrl)}
                    title={lecture.title}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="bg-dark d-flex align-items-center justify-content-center">
                    <i className="bi bi-file-earmark-play text-white display-3"></i>
                  </div>
                )}
              </div>
              <div className="card-body">
                <h5 className="card-title">{lecture.title}</h5>
                <p className="card-text text-muted small">
                  {lecture.description}
                </p>
                <div className="mb-2">
                  <span className="badge bg-primary me-2">
                    {lecture.department}
                  </span>
                  <span className="badge bg-secondary me-2">
                    Semester {lecture.semester}
                  </span>
                  <span className="badge bg-info">{lecture.courseCode}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    By: {lecture.uploadedBy?.name}
                  </small>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-eye text-primary me-1"></i>
                    <span>{lecture.views || 0}</span>
                  </div>
                </div>
                {!lecture.isYouTube && (
                  <div className="mt-3">
                    <a
                      href={`/uploads/${lecture.videoFile}`}
                      className="btn btn-outline-success w-100"
                      download
                    >
                      <i className="bi bi-download me-2"></i>Download Video
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {lectures.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <h4 className="mt-3">No lectures found</h4>
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
                <h5 className="modal-title">Upload Lecture</h5>
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
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isYouTube"
                      checked={uploadData.isYouTube}
                      onChange={(e) =>
                        setUploadData({
                          ...uploadData,
                          isYouTube: e.target.checked,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="isYouTube">
                      Upload as YouTube Link
                    </label>
                  </div>
                  {uploadData.isYouTube ? (
                    <div className="mb-3">
                      <label className="form-label">YouTube URL</label>
                      <input
                        type="url"
                        className="form-control"
                        required
                        value={uploadData.videoUrl}
                        onChange={(e) =>
                          setUploadData({
                            ...uploadData,
                            videoUrl: e.target.value,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="mb-3">
                      <label className="form-label">Video File</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="video/*"
                        required
                        onChange={(e) =>
                          setUploadData({
                            ...uploadData,
                            videoFile: e.target.files[0],
                          })
                        }
                      />
                    </div>
                  )}
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

export default Lectures;
