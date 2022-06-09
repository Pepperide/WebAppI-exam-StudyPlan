import NavBar from "./Navbar";
import { Container } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';
import './css/Layout.css'
import { useContext, useEffect } from "react";
import UserContext from "../UserContext";

function Layout(props) {
    const user = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!props.loggedIn) {
            navigate('/');
        }
        else {
            navigate('/user/' + user.id);
        }
    }, [props.loggedIn]);

    return (
        <>
            <Container fluid className="main">
                <NavBar loggedIn={props.loggedIn} handleLogout={props.handleLogout} studyPlan={props.studyPlan} />
                <Outlet />
            </Container>
        </>
    );
}
export default Layout;