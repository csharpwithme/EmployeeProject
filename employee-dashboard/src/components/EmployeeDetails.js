import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: 0,
    name: "",
    email: "",
    department: "",
    salary: ""
  });
  const [error, setError] = useState("");

  const API_URL = "https://localhost:7280/api/Employee";

  // Load employee by ID
  const loadEmployee = async () => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setEmployee(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load employee.");
    }
  };

  useEffect(() => {
    loadEmployee();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "salary" ? Number(value) : value
    });
  };

  // Update employee
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${formData.employeeId}`, formData);
      setEmployee(formData);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update employee.");
    }
  };

  // Delete employee
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${API_URL}/${employee.employeeId}`);
        navigate("/dashboard"); // go back to dashboard after delete
      } catch (err) {
        console.error(err);
        setError("Failed to delete employee.");
      }
    }
  };

  if (!employee) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Employee Details</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <p><strong>Name:</strong> {employee.name}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Department:</strong> {employee.department}</p>
      <p><strong>Salary:</strong> {employee.salary}</p>

      <Button variant="warning" className="me-2" onClick={() => setShowEditModal(true)}>
        Edit
      </Button>
      <Button variant="danger" className="me-2" onClick={handleDelete}>
        Delete
      </Button>
      <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleUpdate}>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Department</label>
              <input
                type="text"
                name="department"
                className="form-control"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Salary</label>
              <input
                type="number"
                name="salary"
                className="form-control"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Update</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default EmployeeDetails;
