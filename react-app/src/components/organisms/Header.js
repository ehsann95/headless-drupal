import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";

function Header({ username }) {
  const menuLinks = [
    {
      path: "/",
      name: "Home",
    },
    {
      path: "/articles",
      name: "Articles",
    },
    {
      path: "/about",
      name: "About",
    },
    {
      path: "/movies",
      name: "Movies",
    },
  ];
  const loggedInLinks = [
    {
      path: "/user/profile",
      name: "Profile",
    },
    {
      path: "/user/logout",
      name: "Logout",
    },
  ];
  const notLoggedInLinks = [
    {
      path: "/user/register",
      name: "Register",
    },
    {
      path: "/user/login",
      name: "Login",
    },
  ];

  const userLinksDropdown = () => {
    if (username) {
      return (
        <>
          {loggedInLinks.map((link) => (
            <NavDropdown.Item key={link.name}>
              <NavLink className="dropdown-item" to={link.path} key={link.name}>
                {link.name}
              </NavLink>
            </NavDropdown.Item>
          ))}
        </>
      );
    } else {
      return (
        <>
          {notLoggedInLinks.map((link) => (
            <NavDropdown.Item key={link.name}>
              <NavLink className="dropdown-item" to={link.path} key={link.name}>
                {link.name}
              </NavLink>
            </NavDropdown.Item>
          ))}
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
            {menuLinks.map((link) => (
              <Nav.Item key={link.name}>
                <NavLink to={link.path} className="nav-link">
                  {link.name}
                </NavLink>
              </Nav.Item>
            ))}

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
