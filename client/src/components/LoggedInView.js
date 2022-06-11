import { Container, Row, Alert } from 'react-bootstrap'
import StudyPlanTable from './StudyPlanTable';

function LoggedInView(props) {
    return (
        <>
            <Container fluid style={{ height: "100%" }}>
                {
                    props.message &&
                    <Row>
                        <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
                    </Row>
                }


                {props.studyPlan.length > 0 && <>
                    <h2 className="title">Your Study Plan</h2>
                    <Container className="table-frame">
                        <StudyPlanTable courses={props.studyPlan} mode={'lite'} />
                    </Container>
                </>}

                <h2 className="title">PoliTo Course list</h2>
                <Container className="table-frame">
                    <StudyPlanTable courses={props.courses} mode={'view'} />
                </Container>

            </Container>
        </>
    );
}

export default LoggedInView;