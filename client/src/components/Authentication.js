import { Form, Button, Col, Row, Container } from 'react-bootstrap'
import './css/Authentication.css'
import { useNavigate } from 'react-router-dom';
const logo = require('../data/Logo_PoliTo_dal_2021_blu.png')

function LoginRoute(props) {
    return (
        <>
            <div className='d-flex loginView'>
                <Row className="align-self-center mainContent">
                    <Col>
                        <img id="loginLogoPolito" src={logo} />
                    </Col>
                    <Col className="d-flex justify-content-center">
                        <LoginForm />
                    </Col>
                </Row>
            </div>
        </>
    );
}
function LoginForm(props) {
    const navigate = useNavigate();
    const handleNavigation = (path) => {
        navigate(path);
    }

    return (
        <>
            <Form className="loginForm d-flex">

                <div className="align-self-center" style={{ height: "80%" }}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label id="email" className="label" >Email address</Form.Label>
                        <div className="d-flex justify-content-center">
                            <Form.Control className="inputBar" type="email" placeholder="Enter email" />
                        </div>

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className="label">Password</Form.Label>
                        <div className="d-flex justify-content-center">
                            <Form.Control className="inputBar" type="password" placeholder="Password" />
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