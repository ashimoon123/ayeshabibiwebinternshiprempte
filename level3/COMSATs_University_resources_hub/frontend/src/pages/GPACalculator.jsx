import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  calculateGPA,
  saveGPARecord,
  getGPARecords,
  getGradeConversion,
  reset,
} from '../features/gpa/gpaSlice';
import Spinner from '../components/Spinner';

const GPACalculator = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { gpaRecords, calculatedGPA, gradeConversion, isLoading, isError, message } = useSelector(
    (state) => state.gpa
  );

  const [semester, setSemester] = useState('');
  const [courses, setCourses] = useState([
    { name: '', code: '', creditHours: '', grade: '' },
  ]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getGradeConversion());
    if (user) {
      dispatch(getGPARecords());
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message, user]);

  const addCourse = () => {
    setCourses([...courses, { name: '', code: '', creditHours: '', grade: '' }]);
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  const updateCourse = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const handleCalculate = () => {
    const validCourses = courses.filter(
      (c) => c.name && c.creditHours && c.grade
    );
    if (validCourses.length === 0) {
      toast.error('Please add at least one course');
      return;
    }
    const formattedCourses = validCourses.map((c) => ({
      ...c,
      creditHours: Number(c.creditHours),
    }));
    dispatch(calculateGPA(formattedCourses));
  };

  const handleSave = () => {
    if (!calculatedGPA) {
      toast.error('Please calculate GPA first');
      return;
    }
    if (!semester) {
      toast.error('Please enter semester number');
      return;
    }
    dispatch(
      saveGPARecord({
        semester: Number(semester),
        courses: calculatedGPA.courses,
        sgpa: calculatedGPA.sgpa,
      })
    );
    toast.success('GPA record saved!');
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="container py-5">
      <h2 className="mb-4">
        <i className="bi bi-calculator me-2"></i>GPA Calculator
      </h2>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Calculate Your GPA</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Semester Number</label>
                <input
                  type="number"
                  className="form-control"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g., 5"
                />
              </div>

              <h6 className="mb-3">Courses</h6>
              {courses.map((course, index) => (
                <div key={index} className="row g-3 mb-3">
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Course Name"
                      value={course.name}
                      onChange={(e) => updateCourse(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Code"
                      value={course.code}
                      onChange={(e) => updateCourse(index, 'code', e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Credits"
                      value={course.creditHours}
                      onChange={(e) => updateCourse(index, 'creditHours', e.target.value)}
                      min="1"
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={course.grade}
                      onChange={(e) => updateCourse(index, 'grade', e.target.value)}
                    >
                      <option value="">Select Grade</option>
                      {Object.keys(gradeConversion).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    {courses.length > 1 && (
                      <button
                        className="btn btn-danger w-100"
                        onClick={() => removeCourse(index)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                className="btn btn-outline-primary mb-3"
                onClick={addCourse}
              >
                <i className="bi bi-plus-lg me-2"></i>Add Course
              </button>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleCalculate}
                >
                  Calculate GPA
                </button>
                {calculatedGPA && user && (
                  <button
                    className="btn btn-success"
                    onClick={handleSave}
                  >
                    Save GPA Record
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Result */}
          {calculatedGPA && (
            <div className="card mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Result</h5>
              </div>
              <div className="card-body text-center">
                <h2 className="display-4 fw-bold text-success">
                  {calculatedGPA.sgpa.toFixed(2)}
                </h2>
                <p className="lead mb-0">Semester GPA</p>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          {/* Grade Conversion Table */}
          <div className="card mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Grade Conversion</h5>
            </div>
            <div className="card-body">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Grade</th>
                    <th>Grade Point</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(gradeConversion).map(([grade, point]) => (
                    <tr key={grade}>
                      <td>{grade}</td>
                      <td>{point}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Saved Records */}
          {user && gpaRecords.length > 0 && (
            <div className="card">
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">Saved Records</h5>
              </div>
              <div className="card-body">
                <div className="list-group">
                  {gpaRecords.map((record) => (
                    <div key={record._id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">Semester {record.semester}</h6>
                          <small className="text-muted">
                            SGPA: {record.sgpa.toFixed(2)} | CGPA: {record.cgpa.toFixed(2)}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPACalculator;
