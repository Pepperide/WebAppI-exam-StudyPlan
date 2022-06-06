import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    }

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
                                <Nav.Item as="li">
                                    <Nav.Link onClick={() => { handleNavigation('/') }}>Home</Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav.Link onClick={() => { }}>Actions</Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav.Link onClick={() => { }}>Contacts</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Container>
                        <Nav className="me-auto">
                            <Nav.Item as="li">
                                {props.loggedIn ?
                                    <Nav.Link onClick={() => props.handleLogout()}>Logout</Nav.Link> :
                                    <Nav.Link onClick={() => { handleNavigation('/login') }}>Login</Nav.Link>
                                }
                            </Nav.Item>
                        </Nav>
                        <i id="loginLogo" className="bi bi-person-circle d-flex justify-content-end"></i>
                    </Navbar>
                </Row>
            </Row>

        </>
    );
}

export default NavBar;