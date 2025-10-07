import React, { useState } from "react";
import { Navbar, Nav, Offcanvas, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaSignOutAlt } from "react-icons/fa";

function MobileNavBar() {
  const [showCanvas, setShowCanvas] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Navbar */}
      <Navbar bg="primary" variant="dark" expand={false} className="mb-3">
        <Navbar.Brand>MyApp</Navbar.Brand>
        <Button variant="outline-light" onClick={() => setShowCanvas(true)}>
          ☰ Menu
        </Button>
      </Navbar>

      {/* Offcanvas Menu */}
      <Offcanvas show={showCanvas} onHide={() => setShowCanvas(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link onClick={() => { navigate("/dashboard"); setShowCanvas(false); }}>
              <FaTachometerAlt className="me-2" /> Dashboard
            </Nav.Link>
            <Nav.Link onClick={() => { navigate("/profile"); setShowCanvas(false); }}>
              <FaUser className="me-2" /> Profile
            </Nav.Link>
            <Nav.Link onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MobileNavBar;
