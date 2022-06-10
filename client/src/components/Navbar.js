import { useContext } from 'react';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import UserContext from '../UserContext';

import './css/Navbar.css';

const politoLogo = require('../data/logo_poli_bianco_260.png')

function NavBar(props) {
    const navigate = useNavigate();
    const user = useContext(UserContext);

    const handleNavigation = (path) => {
        navigate(path);
    }

    const logout = () => {
        props.handleLogout();
        navigate('/');
    }

    return (
        <>
            <Titlebar />

            <Row className="actionBar d-flex justify-content-center">
                <Navbar>
                    <Col >
                        <Row>
                            <Col md={{ span: 4, offset: 4 }} className="action-list d-flex justify-content-center">
                                <Nav className="me-auto">
                                    {props.loggedIn ?
                                        <Nav.Item as="li">
                                            <Nav.Link className="action-item" onClick={() => { handleNavigation('/user/' + user.id) }}>Home</Nav.Link>
                                        </Nav.Item> :
                                        <Nav.Item as="li">
                                            <Nav.Link className="action-item" onClick={() => { handleNavigation('/') }}>Home</Nav.Link>
                                        </Nav.Item>
                                    }


                                    {props.loggedIn ?
                                        (props.studyPlan.length > 0 ?
                                            <Nav.Item as="li">
                                                <Nav.Link className="action-item" onClick={() => { handleNavigation('/user/' + user.id + '/studyplan/edit') }}>Edit Study Plan</Nav.Link>
                                            </Nav.Item> :
                                            <Nav.Item as="li">
                                                <Nav.Link className="action-item" onClick={() => { handleNavigation('/user/' + user.id + '/studyplan/add') }}>Create Study Plan</Nav.Link>
                                            </Nav.Item>
                                        ) :
                                        <Nav.Item as="li">
                                            <Nav.Link className="action-item" onClick={() => { }}>Actions</Nav.Link>
                                        </Nav.Item>
                                    }

                                    <Nav.Item as="li">
                                        <Nav.Link className="action-item" onClick={() => { }}>Contacts</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col md={{ span: 4 }} className="action-list d-flex justify-content-end">
                                {props.loggedIn ?
                                    <Nav className="me-auto">
                                        <Nav.Item as="li">
                                            <Nav.Link>{user.name} {user.surname}</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item as="li">
                                            <Nav.Link className="action-item" onClick={() => logout()}> Logout</Nav.Link>
                                        </Nav.Item>

                                    </Nav>
                                    :
                                    <Nav>
                                        <Nav.Item as="li">
                                            <Nav.Link className="action-item" onClick={() => { handleNavigation('/login') }}>Login</Nav.Link>
                                        </Nav.Item>

                                    </Nav>}
                                <i id="loginLogo" className="bi bi-person-circle d-flex align-self-center"></i>
                            </Col>
                        </Row>
                    </Col>
                </Navbar >

            </Row >
        </>
    );
}

function Titlebar(props) {
    return (
        <>
            <Row className='headerbar'>
                <Col className="d-flex">
                    <img id='logoPolito' src={politoLogo} />
                </Col>
                <Col>
                    <a id='navbarTitle' className="title d-flex justify-content-end"> Portale della Didattica </a>
                </Col>
            </Row>
        </>
    );
}
export default NavBar;