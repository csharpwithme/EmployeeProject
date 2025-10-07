import React from "react";
import { Offcanvas, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Sidebar({ show, handleClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // or your auth logic
    navigate("/login");
  };

  return (
    <Offcanvas show={show} onHide={handleClose} responsive="lg">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Dashboard</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
       <Nav className="flex-column">
  <Nav.Link onClick={() => setShowSidebar(false)}>
    <FaTachometerAlt className="me-2" /> Dashboard
  </Nav.Link>
  <Nav.Link onClick={() => alert("Profile clicked!")}>
    <FaUser className="me-2" /> Profile
  </Nav.Link>
  <Nav.Link onClick={handleLogout}>
    <FaSignOutAlt className="me-2" /> Logout
  </Nav.Link>
</Nav>

      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Sidebar;
