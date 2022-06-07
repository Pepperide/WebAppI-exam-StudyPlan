import { Container, Row, Col, Alert } from 'react-bootstrap'
import StudyPlanTable from './StudyPlanTable';
function LoggedInView(props) {
    return (
        <>
            <Container fluid>
                {props.message && <Row>
                    <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
                </Row>}
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