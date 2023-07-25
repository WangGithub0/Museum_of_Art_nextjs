import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Form, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';

export default function MainNav() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();
  const [searchField, setSearchField] = useState('');

  const handleSearchSubmit = (e) => {
    setIsExpanded(false);
    e.preventDefault();

    let queryString = `title=true&q=${searchField}`;
    setSearchHistory((current) => [...current, queryString]);
    router.push(`/artwork?title=true&q=${searchField}`);
  };

  const [activeLink, setActiveLink] = useState('/');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setActiveLink(router.pathname);
  }, [router.pathname]);

  const handleNavLinkClick = () => {
    setIsExpanded(false);
  };

  return (
    <div>
      <Navbar
        className="navbar navbar-expand-lg bg-primary fixed-top"
        data-bs-theme="dark"
        expanded={isExpanded}
        expand="lg"
      >
        <Container>
          <Navbar.Brand>Yumei Wang</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav
              className="me-auto"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link
                legacybehavior="true"
                passhref="true"
                href="/"
                // className={`nav-link ${activeLink === '/' ? 'active' : ''}`}
                className="nav-link"
                onClick={handleNavLinkClick}
                active={router.pathname === '/'}
              >
                Home
              </Nav.Link>
              <Nav.Link
                legacybehavior="true"
                passhref="true"
                href="/search"
                // className={`nav-link ${
                //   activeLink === '/search' ? 'active' : ''
                // }`}
                className="nav-link"
                onClick={handleNavLinkClick}
                active={router.pathname === '/search'}
              >
                Advanced Search
              </Nav.Link>
            </Nav>
            &nbsp;
            <Form className="d-flex" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="text"
                className="form-control me-sm-2"
                placeholder="Search"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                style={{ backgroundColor: 'white' }}
              />
              <Button variant="success" type="submit">
                Search
              </Button>
            </Form>
            &nbsp;
            {/* dropdown */}
            <Nav>
              <NavDropdown
                title="User Name"
                id="basic-nav-dropdown"
                class="nav-link dropdown-toggle"
              >
                <Link
                  legacybehavior="true"
                  passhref="true"
                  href="/favourites"
                  // className={`nav-link ${
                  //   activeLink === '/favourites' ? 'active' : ''
                  // }`}
                  onClick={handleNavLinkClick}
                  // className="nav-link"
                >
                  <NavDropdown.Item
                    href="#action/3.1"
                    active={router.pathname === '/favourites'}
                  >
                    Favourites
                  </NavDropdown.Item>
                </Link>
                <Link
                  legacybehavior="true"
                  passhref="true"
                  href="/history"
                  // className={`nav-link ${
                  //   activeLink === '/history' ? 'active' : ''
                  // }`}
                  onClick={handleNavLinkClick}
                >
                  <NavDropdown.Item
                    href="#action/3.2"
                    active={router.pathname === '/history'}
                  >
                    Search History
                  </NavDropdown.Item>
                </Link>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </div>
  );
}
