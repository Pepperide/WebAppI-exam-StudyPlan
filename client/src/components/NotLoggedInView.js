import { Container, Row, Col } from 'react-bootstrap'
import StudyPlanTable from './StudyPlantable';

function NotLoggedInView(props) {
    return (
        <>
            <Container fluid>
                <h1>Polito study plan</h1>
                <StudyPlanTable />
            </Container>
        </>
    );
}

export default NotLoggedInView;