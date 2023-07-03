import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";

function Header({ username }) {
  const userLinksDropdown = () => {
    const loggedIn = localStorage.getItem("auth");
    if (loggedIn) {
      return (
        <>
          <NavDropdown.Item>
            <NavLink className="dropdown-item" to="/user/profile">
              Profile
            </NavLink>
          </NavDropdown.Item>
          <NavDropdown.Item>
            <NavLink className="dropdown-item" to="/user/logout">
              Logout
            </NavLink>
          </NavDropdown.Item>
        </>
      );
    } else {
      return (
        <>
          <NavDropdown.Item>
            <NavLink className="dropdown-item" to="/user/register">
              Register
            </NavLink>
          </NavDropdown.Item>

          <NavDropdown.Item>
            <NavLink className="dropdown-item" to="/user/login">
              Login
            </NavLink>
          </NavDropdown.Item>
        </>
      );
    }
  };
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Decoupled Training</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Item>
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink to="/articles" className="nav-link">
                Articles
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
            </Nav.Item>

            <NavDropdown
              title={username ? username : "anonymous"}
              id="basic-nav-dropdown"
            >
              {userLinksDropdown()}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
