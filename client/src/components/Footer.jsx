import { Navbar, Container } from 'react-bootstrap';

function Footer() {
  return (
    <Navbar
      style={{
        backgroundColor: "#1A2A3A",
        minHeight: '56px',
        
      }}
    >
      <Container
        fluid
        className="d-flex justify-content-center align-items-center text-center"
      >
        <span
          style={{
            color: '#edb742',
            fontWeight: '500',
            fontSize: '0.9rem'
          }}
        >
          Leonardo Superno Falco s338685 &nbsp;|&nbsp; Politecnico di Torino
          &nbsp;|&nbsp; Web Applications I 2026 &nbsp;|&nbsp; Last Race
        </span>
      </Container>
    </Navbar>
  );
}

export default Footer;