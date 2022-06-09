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
        <>
            <Row className="base-layer d-flex justify-content-around">
                <Row>
                    <Col>
                        <h2 className="subtitle">Create your study plan</h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3 className="subtitle">Set the workload</h3>
                    </Col>
                </Row>
            </Row>
        </>
    );
}



export default CreateStudyPlan;