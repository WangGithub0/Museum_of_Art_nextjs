import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Form, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { addToHistory } from '@/lib/userData';
import { isAuthenticated, readToken, removeToken } from '@/lib/authenticate';

export default function MainNav() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();
  const [searchField, setSearchField] = useState('');
  let token = readToken();

  const handleSearchSubmit = async (e) => {
    try {
      setIsExpanded(false);
      e.preventDefault();

      // let queryString = `title=true&q=${searchField}`;
      // setSearchHistory((current) => [...current, queryString]);
      setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
      router.push(`/artwork?title=true&q=${searchField}`);
    } catch (error) {
      console.error('Error occurred while adding history:', error);
    }
  };

  const [activeLink, setActiveLink] = useState('/');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setActiveLink(router.pathname);
  }, [router.pathname]);

  const handleNavLinkClick = () => {
    setIsExpanded(false);
  };

  const logout = () => {
    setIsExpanded(false);
    removeToken();
    router.push('/login');
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
                className="nav-link"
                onClick={handleNavLinkClick}
                active={router.pathname === '/'}
              >
                Home
              </Nav.Link>
              {token && (
                <Nav.Link
                  legacybehavior="true"
                  passhref="true"
                  href="/search"
                  className="nav-link"
                  onClick={handleNavLinkClick}
                  active={router.pathname === '/search'}
                >
                  Advanced Search
                </Nav.Link>
              )}
            </Nav>
            &nbsp;
            {token && (
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
            )}
            &nbsp;
            {token && (
              <Nav>
                <NavDropdown title={token.userName} id="basic-nav-dropdown">
                  <Link
                    legacybehavior="true"
                    passhref="true"
                    href="/favourites"
                    onClick={handleNavLinkClick}
                  >
                    <NavDropdown.Item
                      href="/favourites"
                      active={router.pathname === '/favourites'}
                    >
                      Favourites
                    </NavDropdown.Item>
                  </Link>
                  <Link
                    legacybehavior="true"
                    passhref="true"
                    href="/history"
                    onClick={handleNavLinkClick}
                  >
                    <NavDropdown.Item
                      // href="#action/3.2"
                      href="/history"
                      active={router.pathname === '/history'}
                    >
                      Search History
                    </NavDropdown.Item>
                  </Link>
                  <Link
                    legacybehavior="true"
                    passhref="true"
                    href="/history"
                    onClick={logout}
                  >
                    <NavDropdown.Item
                    // href="#action/3.2"
                    // href="/history"
                    // active={router.pathname === '/history'}
                    >
                      Logout
                    </NavDropdown.Item>
                  </Link>
                </NavDropdown>
              </Nav>
            )}
            <Nav>
              {!token && (
                <Nav.Link
                  legacybehavior="true"
                  passhref="true"
                  href="/register"
                  className="nav-link"
                  onClick={handleNavLinkClick}
                  active={router.pathname === '/register'}
                >
                  Register
                </Nav.Link>
              )}
              {!token && (
                <Nav.Link
                  legacybehavior="true"
                  passhref="true"
                  href="/login"
                  className="nav-link"
                  onClick={handleNavLinkClick}
                  active={router.pathname === '/login'}
                >
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </div>
  );
}
