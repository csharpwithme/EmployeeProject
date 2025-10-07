import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Offcanvas, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { House, PersonCircle, BoxArrowRight } from "react-bootstrap-icons";

function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [profile, setProfile] = useState(null); // Profile state
  const [formData, setFormData] = useState({
    employeeId: 0,
    name: "",
    email: "",
    department: "",
    salary: ""
  });
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false); // Add/Edit modal
  const [viewEmployee, setViewEmployee] = useState(null); // Quick View employee
  const [showViewModal, setShowViewModal] = useState(false); // Quick View modal
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSidebar, setShowSidebar] = useState(false);

  const API_URL = "https://localhost:7280/api/Employee";
  const PROFILE_URL = "https://localhost:7280/api/Profile/me";
  const navigate = useNavigate();

  // Load employees
  const loadEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees.");
    }
  };

  // Load profile
  const loadProfile = async () => {
    try {
      const res = await axios.get(PROFILE_URL);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/"); // protect route
    loadEmployees();
    loadProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "salary" ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${API_URL}/${formData.employeeId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      resetForm();
      loadEmployees();
    } catch (err) {
      console.error(err);
      setError("Failed to save employee.");
    }
  };

  const resetForm = () => {
    setFormData({ employeeId: 0, name: "", email: "", department: "", salary: "" });
    setEditMode(false);
    setShowModal(false);
    setError("");
  };

  const handleEdit = (emp) => {
    setFormData(emp);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        loadEmployees();
      } catch (err) {
        console.error(err);
        setError("Failed to delete employee.");
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const name = emp.name?.toLowerCase() || "";
    const dept = emp.department?.toLowerCase() || "";
    return name.includes(search.toLowerCase()) || dept.includes(search.toLowerCase());
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];
    if (typeof fieldA === "string") fieldA = fieldA.toLowerCase();
    if (typeof fieldB === "string") fieldB = fieldB.toLowerCase();
    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container mt-3">

      {/* Sidebar Button */}
      <Button variant="primary" onClick={() => setShowSidebar(true)} className="mb-3">
        ☰ Menu
      </Button>

      {/* Sidebar */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {profile ? (
            <div className="mb-3 text-center">
              <PersonCircle size={60} />
              <p className="mt-2">{profile.name}</p>
              <p className="text-muted">{profile.email}</p>
            </div>
          ) : <p>Loading...</p>}
         <Nav className="flex-column">
  <Nav.Link onClick={() => { setShowSidebar(false); navigate("/profile"); }}>Profile</Nav.Link>
  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
</Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <h2>Employee Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search & Add */}
      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Search by name or department"
          className="form-control me-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
          Add Employee
        </Button>
      </div>

      {/* Employee Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>
              Name {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("email")}>
              Email {sortField === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("department")}>
              Department {sortField === "department" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("salary")}>
              Salary {sortField === "salary" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.length > 0 ? currentEmployees.map(emp => (
            <tr key={emp.employeeId}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.salary}</td>
              <td>
                <Button variant="info" size="sm" className="me-1"
                  onClick={() => { setViewEmployee(emp); setShowViewModal(true); }}>
                  Quick View
                </Button>
                <Button variant="warning" size="sm" className="me-1" onClick={() => handleEdit(emp)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(emp.employeeId)}>
                  Delete
                </Button>
              </td>
            </tr>
          )) : <tr><td colSpan="5" className="text-center">No employees found.</td></tr>}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>Page {currentPage} of {totalPages}</div>
          <div>
            <Button variant="secondary" size="sm" className="me-1"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}>
              Previous
            </Button>
            <Button variant="secondary" size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={resetForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Employee" : "Add Employee"}</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Department</label>
              <input type="text" name="department" className="form-control" value={formData.department} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Salary</label>
              <input type="number" name="salary" className="form-control" value={formData.salary} onChange={handleChange} required />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>Cancel</Button>
            <Button variant="primary" type="submit">{editMode ? "Update" : "Add"}</Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Quick View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewEmployee ? (
            <>
              <p><strong>Name:</strong> {viewEmployee.name}</p>
              <p><strong>Email:</strong> {viewEmployee.email}</p>
              <p><strong>Department:</strong> {viewEmployee.department}</p>
              <p><strong>Salary:</strong> {viewEmployee.salary}</p>
            </>
          ) : <p>Loading...</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EmployeeDashboard;
