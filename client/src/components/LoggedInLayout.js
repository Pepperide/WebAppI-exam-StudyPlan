import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import './css/Layout.css'
import NavBar from "./Navbar";
function LoggedInLayout(props) {
    return (
        <>
            <Container fluid className="main">
                <NavBar loggedIn={props.loggedIn} handleLogout={props.handleLogout} studyPlan={props.studyPlan} />
                <Outlet />
            </Container>
        </>
    );
}

export default LoggedInLayout;