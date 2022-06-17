import { useContext, useEffect } from "react";
import { Container } from 'react-bootstrap';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import NavBar from "./Navbar";
import UserContext from "../UserContext";

import './css/Layout.css'


function Layout(props) {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const { userID } = useParams();

    useEffect(() => {
        if (props.loggedIn) {
            navigate('/user/' + user.id);
        }
        else {
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.loggedIn]);

    return (
        <>
            <Container fluid className="main">
                <NavBar loggedIn={props.loggedIn} handleLogout={props.handleLogout} studyPlan={props.studyPlan} loadStudyPlan={props.loadStudyPlan} />
                <Outlet />
            </Container>
        </>
    );
}
export default Layout;