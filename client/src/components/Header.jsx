import { Navbar, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';
import { useContext } from 'react';
import { BoxArrowRight } from 'react-bootstrap-icons';
import UserContext from '../contexts/UserContext';

function Header(props) {
  const user = useContext(UserContext);

  const destination = user.id ? '/home' : '/'; // Link for the title

  return (
    <Navbar
      style={{
        backgroundColor: "#edb742",
        borderBottom: '2px solid #1A2A3A',
        height: '56px'
      }}
      fixed="top"
    >
      <Container fluid className="d-flex align-items-center position-relative" style={{ height: "56px" }}>
        <Link
          to={destination}
          className="position-absolute start-50 translate-middle-x"
          style={{
            textDecoration: 'none',
            color: '#1A2A3A',
            fontWeight: '700',
            letterSpacing: '1px'
          }}
        >
          <h1 className="m-0 fs-4" style={{ fontFamily: "system-ui, sans-serif" }}>
            Last Race
          </h1>
        </Link>

        {/* Login / User a destra */}
        <div className="ms-auto">
          {user.name ? (
            <UserInfo name={user.name} />
          ) : (
            <LoginButton />
          )}
        </div>

      </Container>
    </Navbar>
  );
}

function LoginButton() {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/login')}
      style={{
        backgroundColor: '#1A2A3A',
        borderColor: '#1A2A3A'
      }}
    >
      Log In
    </Button>
  );
}

function UserInfo({ name }) {
  return (
    <div className="d-flex align-items-center gap-3">
      <span
        style={{
          color: '#1A2A3A',
          fontWeight: '500'
        }}
      >
        {name}
      </span>

      <Link
        to="/logout"
        style={{
          color: '#1A2A3A',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <BoxArrowRight size={22} />
      </Link>
    </div>
  );
}

export default Header;