import NavBar from "./Navbar";
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

function Layout(props) {
    return (
        <>
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                <NavBar />
                <Outlet />
            </Container>
        </>
    );
}
export default Layout;