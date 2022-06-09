import { Container, Row, Col, Alert } from 'react-bootstrap'
import { BrowserRouter as Router, Outlet, Route, Routes } from 'react-router-dom';
import CreateStudyPlanView from './CreateStudyPlan';
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
                    <h2>Your study plan</h2>
                    <StudyPlanTable courses={props.studyPlan} mode={'lite'} />
                </>}

                <h2>Course list</h2>
                <StudyPlanTable courses={props.courses} mode={'view'} />

            </Container>
        </>
    );
}

export default LoggedInView;