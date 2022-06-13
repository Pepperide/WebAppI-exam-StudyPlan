import { useContext, useEffect, useState } from 'react';
import { Col, Container, Row, Button, Form, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { getStudentInfo } from '../API';
import UserContext from '../UserContext';
import './css/CreateStudyPlan.css'
import StudyPlanTable from './StudyPlanTable';

function EditStudyPlan(props) {
    const [workload, setWorkload] = useState({});
    const [added, setAdded] = useState(0);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const info = await getStudentInfo();
            if (info.workload !== null) {
                const w = info.workload === 'part-time' ? { value: 'Part-time', min: 20, max: 40 } : { value: "Full-Time", min: 60, max: 80 };
                setWorkload(w);
            }
        })();
    }, []);

    useEffect(() => {
        setAdded(props.studyPlan.reduce((pre, curr) => { return pre + curr.credits }, 0));
    }, [props.studyPlan]);

    const handleNavigation = (path) => {
        navigate(path);
    }

    const addCourse = (course) => {
        const incompatible = props.studyPlan.find((s) => course.incompatibleCourses.some((i) => i === s.code));
        const mandatory = props.studyPlan.find((s) => s.code === course.preparatoryCourse);

        if (!!incompatible) {
            setMessage({ header: "Incompatible courses", msg: `"${course.name}" is incompatible with "${incompatible.name}"` });
            return;
        }

        if (!!course.preparatoryCourse && !!mandatory === false) {
            setMessage({ header: "Preparatory course constraint", msg: `You need to insert "${course.preparatoryCourse}" before "${course.name}"` });
            return;
        }
        props.addCourseToStudyPlan(course);
    }

    const removeCourse = (course) => {
        const mandatory = props.studyPlan.find((s) => s.preparatoryCourse === course.code);

        if (!!mandatory) {
            setMessage({ header: "Preparatory course constraint", msg: `You cannot delete "${course.name}" because is mandatory for "${mandatory.name}"` });
            return;
        }
        props.removeCourseFromStudyPlan(course);
    }

    const handleSubmit = async () => {
        // Max enrolled students check
        const coursesToBeCheck = props.studyPlan.filter((c) => props.oldStudyPlan.map((p) => p.code).indexOf(c.code) === -1);
        const errorCourses = coursesToBeCheck
            .filter((course) =>
                props.courses.some((e) => (
                    course.maxStudents && e.code === course.code && e.enrolledStudents >= course.maxStudents
                )));

        if (errorCourses.length > 0) {
            setMessage({ header: "Generic error", msg: `Following courses have reached the maximum number of students:\n${errorCourses.map((c) => { return c.code + '\n' })}` });
            return;
        }

        if (added - workload.min > 0 && workload.max - added > 0) {
            props.storeStudyPlan(workload.value.toLowerCase());
            handleNavigation('../');
        }
        else {
            setMessage({ header: "Workload error", msg: `You have to chose at least ${workload.min} and at most ${workload.max} credits` });
        }
    }

    const handleDeleteStudyPlan = () => {
        setWorkload({});
        setAdded(0);
        props.deleteStudyPlan();
        handleNavigation('../');
    }

    const cancelOperations = () => {
        props.loadStudyPlan();
        handleNavigation('../');
    }

    return (
        <>
            <Container fluid style={{ width: "80%", height: "100%" }}>
                <Row className="base-layer d-flex justify-content-around">
                    {workload.value === undefined ?
                        <SetWorkload setWorkload={setWorkload} />
                        : <>
                            <Row>
                                <Col>
                                    <i className="workload-text">{workload.value} workload: </i>
                                    <i id="counter"
                                        className={(added - workload.min < 0 || workload.max - added < 0) ? "workload-text invalid" : "workload-text valid"}>{added}</i>
                                    <i className="workload-text">/{workload.max} </i>
                                    <i>&#123;min:{workload.min}, max:{workload.max}&#125;</i>
                                </Col>

                            </Row>
                            <Row>
                                <Col className="align-self-center">
                                    {!!message &&
                                        <Alert variant={'danger'} onClose={() => setMessage('')} dismissible>
                                            <Alert.Heading>{message.header}</Alert.Heading>
                                            <p>{message.msg}</p>
                                        </Alert>}
                                </Col>
                            </Row>
                            <Row>
                                <StudyPlanTable courses={props.studyPlan} mode={'lite'} />
                            </Row>
                            <Row>
                                <Col className="d-flex justify-content-end">
                                    <Button id="delete" variant="danger" className="align-self-center" onClick={() => handleDeleteStudyPlan()}>Delete</Button>
                                    <Button id="cancel" variant="secondary" className="align-self-center" onClick={() => cancelOperations()}>Cancel</Button>
                                    <Button id="submit" variant="primary" className="align-self-center" onClick={() => handleSubmit()}>Submit study plan</Button>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "15px" }}>
                                <StudyPlanTable
                                    courses={props.courses}
                                    studyPlan={props.studyPlan}
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
            <Row>
                <Col>
                    <h2 className="subtitle black">Create your study plan</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3 className="subtitle black">Set the workload</h3>
                </Col>
            </Row>
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
                    <Button className="study-plan-view-button" onClick={() => handleNavigation('/user/' + user.id)}>Cancel</Button>
                </Col>
                <Col className="d-flex justify-content-center">
                    <Button className="study-plan-view-button" onClick={() => goOn()}>Next</Button>
                </Col>
            </Row>
        </>
    )
}


export default EditStudyPlan;