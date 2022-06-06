import { Container, Row, Col } from 'react-bootstrap'
import StudyPlanTable from './StudyPlanTable';

function NotLoggedInView(props) {
    return (
        <>
            <Container fluid>
                <h1>Polito study plan</h1>
                <StudyPlanTable courses={props.courses} />
            </Container>
        </>
    );
}

export default NotLoggedInView;