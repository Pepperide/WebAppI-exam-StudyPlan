import { Form, Button, Col, Row, Alert } from 'react-bootstrap'
import './css/Authentication.css'
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
const logo = require('../data/Logo_PoliTo_dal_2021_blu.png')

function LoginRoute(props) {
    const user = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (props.loggedIn) {
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.loggedIn]);

    return (
        <>
            {props.message && <Row>
                <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
            </Row>}
            <div className='d-flex loginView'>
                <Row className="align-self-center mainContent">
                    <Col>
                        <img id="loginLogoPolito" src={logo} alt='' />
                    </Col>
                    <Col className="d-flex justify-content-center">
                        <LoginForm userLoginCallback={props.userLoginCallback} loggedIn={props.loggedIn} />
                    </Col>
                </Row>
            </div>
        </>
    );
}
function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    }

    const doLogin = (event) => {
        event.preventDefault();
        //TODO validate form
        const credentials = { username, password };
        props.userLoginCallback(credentials);
    }

    return (
        <>
            <Form className="loginForm d-flex" onSubmit={doLogin}>

                <div className="align-self-center" style={{ height: "80%" }}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label id="email" className="label" >Email address</Form.Label>
                        <div className="d-flex justify-content-center">
                            <Form.Control className="inputBar" type="email" placeholder="Enter email" value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
                        </div>

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className="label">Password</Form.Label>
                        <div className="d-flex justify-content-center">
                            <Form.Control className="inputBar" type="password" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} required={true} />
                        </div>
                    </Form.Group>

                    <div className="d-flex justify-content-around">
                        <Button style={{ backgroundColor: "#161f56" }} variant="primary" type="submit">Submit</Button>
                        <Button style={{ backgroundColor: "#161f56" }} variant="primary" onClick={() => { handleNavigation("/") }}>Cancel</Button>
                    </div>
                </div>
            </Form>
        </>
    );
}

export { LoginForm, LoginRoute };