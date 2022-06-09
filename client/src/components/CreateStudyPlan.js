import { useContext, useEffect, useState } from 'react';
import { Col, Container, Row, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { getStudentInfo } from '../API';
import UserContext from '../UserContext';
import './css/CreateStudyPlan.css'
import StudyPlanTable from './StudyPlanTable';

function CreateStudyPlan(props) {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    }

    return (
        <Container fluid style={{ width: "60%", height: "100%" }}>
            <Row className="base-layer d-flex justify-content-around">
                <Row>
                    <Col>
                        <h1 className="subtitle">You havn't still defined a study plan</h1>

                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1 className="subtitle">Let's Create it!</h1>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-center">
                        <Button className="study-plan-view-button" onClick={() => handleNavigation('add')}>Define your study plan</Button>
                    </Col>
                </Row>
            </Row>
        </Container>
    );
}



export default CreateStudyPlan;