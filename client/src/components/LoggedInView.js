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
                <h1>Your study plan</h1>
                <StudyPlanTable courses={props.courses} mode={'view'} />

            </Container>
        </>
    );
}

export default LoggedInView;