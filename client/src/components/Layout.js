import NavBar from "./Navbar";
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import './css/Layout.css'

function Layout(props) {
    return (
        <>
            <Container fluid className="main">
                <NavBar loggedIn={props.loggedIn} handleLogout={props.handleLogout} />
                <Outlet />
            </Container>
        </>
    );
}
export default Layout;