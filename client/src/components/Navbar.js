import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap'
import './css/Navbar.css'
const politoLogo = require('../data/logo_poli_bianco_260.png')

function Titlebar(props) {
    return (
        <>
            <Col className="d-flex">
                <img id='logoPolito' className="align-self-center" src={politoLogo} />
            </Col>
            <Col>
                <a id='navbarTitle' className="title d-flex justify-content-end"> Portale della Didattica </a>
            </Col>
        </>
    );
}

function NavBar(props) {
    return (
        <>
            <Row className='topbar'>
                <Row className='headerbar'>
                    <Titlebar />
                </Row>
                <Row>
                    <Navbar bg="dark" variant="dark">
                        <Container className='d-flex justify-content-center'>
                            <Nav className="me-auto ">
                                <Nav.Link href="#home">Home</Nav.Link>
                                <Nav.Link href="#features">Features</Nav.Link>
                                <Nav.Link href="#pricing">Pricing</Nav.Link>
                            </Nav>
                        </Container>
                        <i id="loginLogo" className="bi bi-person-circle d-flex justify-content-end"></i>
                    </Navbar>
                </Row>
            </Row>

        </>
    );
}

export default NavBar;