import { useContext, useEffect, useState } from 'react';
import { Col, Container, Row, Button, Form, Table, Alert } from 'react-bootstrap'
import { Prev } from 'react-bootstrap/esm/PageItem';
import { useNavigate } from 'react-router-dom';
import { getStudentInfo } from '../API';
import UserContext from '../UserContext';
import './css/CreateStudyPlan.css'
import StudyPlanTable from './StudyPlanTable';

function EditStudyPlan(props) {
    const [workload, setWorkload] = useState({});
    const [added, setAdded] = useState(0);
    const [message, setMessage] = useState('');
    const [tempStudyPlan, setTempStudyPlan] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const info = await getStudentInfo();
            if (info.workload !== null) {
                const w = info.workload === 'part-time' ? { value: 'Part-time', min: 20, max: 40 } : { value: "Full-Time", min: 60, max: 80 };
                setWorkload(w);
            }
        })();
        setTempStudyPlan(props.studyPlan);
    }, []);

    useEffect(() => {
        setAdded(tempStudyPlan.reduce((pre, curr) => { return pre + curr.credits }, 0));
    }, [tempStudyPlan]);

    const handleNavigation = (path) => {
        navigate(path);
    }

    const addCourse = (course) => {
        const incompatible = tempStudyPlan.find((s) => course.incompatibleCourses.some((i) => i === s.code));
        const mandatory = tempStudyPlan.find((s) => s.code === course.preparatoryCourse);

        console.log(!!mandatory);
        if (!!incompatible) {
            setMessage(`"${course.name}" is incompatible with "${incompatible.name}"`);
            return;
        }

        if (!!course.preparatoryCourse && !!mandatory === false) {
            setMessage(`"You need to insert "${course.preparatoryCourse}" before "${course.name}"`);
            return;
        }
        setTempStudyPlan((old) => [...old, course]);
    }

    const removeCourse = (course) => {
        const mandatory = tempStudyPlan.find((s) => s.preparatoryCourse === course.code);

        if (!!mandatory) {
            setMessage(`"You cannot delete "${course.name}" because is mandatory for "${mandatory.name}"`);
            return;
        }
        const plan = tempStudyPlan.filter((s) => s.code !== course.code);
        setTempStudyPlan(plan);
    }

    const handleSubmit = () => {
        console.log("Sono quis")
        if (added - workload.min > 0 && workload.max - added > 0) {
            props.setStudyPlan(tempStudyPlan);
            props.storeStudyPlan(workload.value.toLowerCase());
            handleNavigation('../');
        }
        else {
            setMessage(`Workload error. You have to chose at least ${workload.min} and at most ${workload.max} credits`);
        }
    }

    const handleDeleteStudyPlan = () => {
        setTempStudyPlan([]);
        setWorkload({});
        setAdded(0);
        props.deleteStudyPlan();
        handleNavigation('../');
    }

    return (
        <>
            <Container fluid style={{ width: "80%", height: "100%" }}>
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
                    {workload.value === undefined ?
                        <Row>
                            <SetWorkload setWorkload={setWorkload} />
                        </Row> :
                        <>
                            <Row>
                                <Col>
                                    <i className="workload-text">{workload.value} workload: </i>
                                    <i id="counter"
                                        className={(added - workload.min < 0 || workload.max - added < 0) ? "workload-text invalid" : "workload-text valid"}>{added}</i>
                                    <i className="workload-text">/{workload.max} </i>
                                    <i>&#123;min:{workload.min}, max:{workload.max}&#125;</i>
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button variant="danger" className="align-self-center" onClick={() => handleDeleteStudyPlan()}>Delete</Button>
                                    <Button className="align-self-center" onClick={() => handleNavigation('../')}>Cancel</Button>
                                    <Button variant="secondary" className="align-self-center" onClick={() => handleSubmit()}>Submit study plan</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="align-self-center">
                                    {!!message && <Alert variant={'danger'} onClose={() => setMessage('')} dismissible>{message}</Alert>}
                                </Col>
                            </Row>
                            <Row>
                                <StudyPlanTable courses={tempStudyPlan} mode={'lite'} />
                            </Row>
                            <Row>
                                <StudyPlanTable
                                    courses={props.courses}
                                    studyPlan={tempStudyPlan}
                                    mode={'edit'}
                                    addCourseToStudyPlan={addCourse}
                                    removeCourseFromStudyPlan={removeCourse} />
                            </Row>
                        </>

                    }
                </Row>
            </Container>
        </>
    );
}

function SetWorkload(props) {
    const [checked, setChecked] = useState('');
    const user = useContext(UserContext);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    }

    const goOn = () => {
        if (checked !== '') {
            const workload = checked === 'part-time' ? { value: 'Part-time', min: 20, max: 40 } : { value: "Full-Time", min: 60, max: 80 }
            props.setWorkload(workload);
        }

    }
    return (
        <>
            <Form >
                <Row className="mb-3">
                    <Col className="d-flex justify-content-center">
                        <Form.Check
                            type="radio"
                            id="full-time"
                            label="Full-time"
                            name="workload"
                            onChange={() => { setChecked('full-time') }}
                        />
                    </Col>
                    <Col className="d-flex justify-content-center">
                        <Form.Check
                            type="radio"
                            id="part-time"
                            label="Part-time"
                            name="workload"
                            onChange={() => { setChecked('part-time') }}
                        />
                    </Col>
                </Row>
            </Form>
            <Row className="d-flex justify-content-around">
                <Col className="d-flex justify-content-center">
                    <Button className="study-plan-view-button" onClick={() => handleNavigation('/user/' + user.id + '/studyplan')}>Cancel</Button>
                </Col>
                <Col className="d-flex justify-content-center">
                    <Button className="study-plan-view-button" onClick={() => goOn()}>Next</Button>
                </Col>
            </Row>
        </>
    )
}


export default EditStudyPlan;