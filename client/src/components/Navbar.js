import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/Navbar.css';
import UserContext from '../UserContext';
import { useContext } from 'react';
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
    const user = useContext(UserContext);

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
                    <Navbar variant="dark">
                        <Col xs={9}>
                            <Container className='d-flex justify-content-center'>
                                <Nav className="me-auto r">
                                    <Nav.Item as="li">
                                        <Nav.Link className="action-list" onClick={() => { handleNavigation('/') }}>Home</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li">
                                        <Nav.Link className="action-list" onClick={() => { }}>Actions</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li">
                                        <Nav.Link className="action-list" onClick={() => { }}>Contacts</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Container>
                        </Col>
                        <Col xs={3}>
                            <Container className='d-flex justify-content-end'>
                                {props.loggedIn ?
                                    <Nav className="me-auto">
                                        <Nav.Item as="li">
                                            <Nav.Link className="action-list">{user.name} {user.surname}</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item as="li">
                                            <Nav.Link className="action-list" onClick={() => props.handleLogout()}> Logout</Nav.Link>
                                        </Nav.Item>

                                    </Nav>
                                    :
                                    <Nav>
                                        <Nav.Item as="li">
                                            <Nav.Link className="action-list" onClick={() => { handleNavigation('/login') }}>Login</Nav.Link>
                                        </Nav.Item>

                                    </Nav>}
                                <i id="loginLogo" className="bi bi-person-circle d-flex align-self-center"></i>
                            </Container>

                        </Col>
                    </Navbar>
                </Row>
            </Row>

        </>
    );
}

export default NavBar;