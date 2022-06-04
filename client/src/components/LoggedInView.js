import { Container, Row, Col } from 'react-bootstrap'
import StudyPlanTable from './StudyPlantable';
function LoggedInView(props) {
    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <h1>Polito study plan</h1>
                    </Col>
                    <Col>
                        <h2>Create your study plan</h2>
                    </Col>
                </Row>

                <StudyPlanTable />
            </Container>
        </>
    );
}

export default LoggedInView;