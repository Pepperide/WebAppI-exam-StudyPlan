import { useEffect, useState } from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import './css/StudyPlanTable.css'

function StudyPlanTable(props) {
    return (
        <>
            <Table className={props.mode !== 'edit' ? "table-hover main-table" : "main-table"} size="sm">
                <thead>
                    {props.mode === 'lite' &&
                        <tr>
                            <th className="table-header">Code</th>
                            <th className="table-header">Name</th>
                            <th className="table-header">Credits</th>
                        </tr>}
                    {props.mode === 'edit' &&
                        <tr>
                            <th className="table-header"></th>
                            <th className="table-header">Code</th>
                            <th className="table-header">Name</th>
                            <th className="table-header">Credits</th>
                            <th className="table-header">Enrolled students</th>
                            <th className="table-header">Max students</th>
                        </tr>
                    }
                    {props.mode === "view" &&
                        <tr>
                            <th className="table-header">Code</th>
                            <th className="table-header">Name</th>
                            <th className="table-header">Credits</th>
                            <th className="table-header">Enrolled students</th>
                            <th className="table-header">Max students</th>
                        </tr>}
                </thead>
                <tbody>
                    {
                        props.courses.map((c) => {
                            return <TableRow
                                key={c.code}
                                course={c}
                                studyPlan={props.studyPlan}
                                mode={props.mode}
                                addCourseToStudyPlan={props.addCourseToStudyPlan}
                                removeCourseFromStudyPlan={props.removeCourseFromStudyPlan}
                                addCredits={props.addCredits}
                                removeCredits={props.removeCredits} />
                        })
                    }
                </tbody>
            </Table>

        </>
    );
}

function TableRow(props) {
    const [collapsed, setCollapsed] = useState(true);
    const [inserted, setInserted] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [reason, setReason] = useState([]);
    const toggleCollapsed = () => { setCollapsed((old) => !old) };

    useEffect(() => {
        setReason([]);
        setDisabled(false);
        if (props.studyPlan) {
            const incompatible = props.studyPlan.filter((s) => props.course.incompatibleCourses.some((i) => i === s.code));
            const available = !!props.course.maxStudents ? props.course.enrolledStudents < props.course.maxStudents : true;

            if (incompatible.length > 0) {
                setReason((old)=>[...old,`Course incompatible with ${incompatible.reduce((pre, cur) => pre + cur.code + ", ", '').slice(0, -2)}`]);
                setDisabled(true);
            }
            if (!available) {
                setReason((old)=>[...old,'Maximun number of students has been reached']);
                setDisabled(true);
            }

            !!props.studyPlan.find((s) => s.code === props.course.code) ? setInserted(true) : setInserted(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.studyPlan]);

    const addCourse = () => {
        props.addCourseToStudyPlan(props.course);
    }

    const removeCourse = () => {
        props.removeCourseFromStudyPlan(props.course);
    }

    return (
        <>
            {props.mode === 'view' && <>
                <tr className={"table-row"} onClick={toggleCollapsed}>
                    <td className={collapsed ? "table-col view close" : "table-col view open"}>{props.course.code}</td>
                    <td className={collapsed ? "table-col view close" : "table-col view open"}>{props.course.name}</td>
                    <td className={collapsed ? "table-col view close" : "table-col view open"}>{props.course.credits}</td>
                    <td className={collapsed ? "table-col view close" : "table-col view open"}>{props.course.enrolledStudents}</td>
                    <td className={collapsed ? "table-col view close" : "table-col view open"}>{props.course.maxStudents}</td>
                </tr>
                <tr className={"hidden-row no-hover"}>
                    <td colSpan={5} className={"hidden-col"}>
                        <div className={collapsed ? "hidden-div hidden" : "hidden-div shown"} >
                            <HiddenTable reason={reason} preparatoryCourse={props.course.preparatoryCourse} incompatibleCourses={props.course.incompatibleCourses} />
                        </div>
                    </td>
                </tr>
            </>}

            {props.mode === 'edit' && <>
                <tr className={"table-row"}>
                    {
                        disabled ?
                            <>
                                <td className={collapsed ? "table-col view disabled close" : "table-col disabled open"}></td>
                                <td className={collapsed ? "table-col view disabled close" : "table-col disabled open"} onClick={toggleCollapsed}>{props.course.code}</td>
                                <td className={collapsed ? "table-col view disabled close" : "table-col disabled open"} onClick={toggleCollapsed}>{props.course.name}</td>
                                <td className={collapsed ? "table-col view disabled close" : "table-col disabled open"} onClick={toggleCollapsed}>{props.course.credits}</td>
                                <td className={collapsed ? "table-col view disabled close" : "table-col disabled open"} onClick={toggleCollapsed}>{props.course.enrolledStudents}</td>
                                <td className={collapsed ? "table-col view disabled close" : "table-col disabled open"} onClick={toggleCollapsed}>{props.course.maxStudents}</td>
                            </> :
                            <>
                                <td className={collapsed ? "table-col edit-mode close" : "table-col edit-mode open"}>
                                    {inserted ?
                                        <i id="dash-button" className="bi bi-dash-circle-fill" onClick={() => removeCourse()}></i> :
                                        <i id="plus-button" className="bi bi-plus-circle-fill" onClick={() => addCourse()}></i>
                                    }
                                </td>
                                <td className={collapsed ? "table-col edit-mode close" : "table-col edit-mode open"} onClick={toggleCollapsed}>{props.course.code}</td>
                                <td className={collapsed ? "table-col edit-mode close" : "table-col edit-mode open"} onClick={toggleCollapsed}>{props.course.name}</td>
                                <td className={collapsed ? "table-col edit-mode close" : "table-col edit-mode open"} onClick={toggleCollapsed}>{props.course.credits}</td>
                                <td className={collapsed ? "table-col edit-mode close" : "table-col edit-mode open"} onClick={toggleCollapsed}>{props.course.enrolledStudents}</td>
                                <td className={collapsed ? "table-col edit-mode close" : "table-col edit-mode open"} onClick={toggleCollapsed}>{props.course.maxStudents}</td>
                            </>
                    }

                </tr>
                {disabled ?
                    <tr className={"hidden-row no-hover"}>
                        <td colSpan={6} className={"hidden-col"}>
                            <div className={collapsed ? "hidden-div disabled hidden" : "hidden-div disabled shown"} >
                                <HiddenTable reason={reason} preparatoryCourse={props.course.preparatoryCourse} incompatibleCourses={props.course.incompatibleCourses} />
                            </div>
                        </td>

                    </tr> :
                    <tr className={"hidden-row no-hover"}>
                        <td colSpan={6} className={"hidden-col"}>
                            <div className={collapsed ? "hidden-div hidden" : "hidden-div shown"} >
                                <HiddenTable reason={reason} preparatoryCourse={props.course.preparatoryCourse} incompatibleCourses={props.course.incompatibleCourses} />
                            </div>
                        </td>

                    </tr>
                }
            </>
            }
            {
                props.mode === 'lite' && <>
                    <tr onClick={toggleCollapsed}>
                        <td className="table-col close" style={{ color: "green" }}>{props.course.code}</td>
                        <td className="table-col close" style={{ color: "green" }}>{props.course.name}</td>
                        <td className="table-col close" style={{ color: "green" }}>{props.course.credits}</td>
                    </tr>
                </>
            }
        </>
    );
}


function HiddenTable(props) {
    return (
        <>
            <Row>
                {/* {props.reason && <div style={{ color: "red" }}>{props.reason}</div>} */}
                {props.reason
                    .map((r)=><div key={props.reason.indexOf(r)} style={{ color: "red" }}>{r}</div>)
                }
                <Col>
                    <Table className="hidden-table" size="sm">
                        <thead>
                            <tr>
                                <th className="table-header">Mandatory course</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="table-row">
                                <td key={props.preparatoryCourse ? props.preparatoryCourse.code : ""} className="table-col">{props.preparatoryCourse}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col>
                    <Table className='hidden-table' size="sm">
                        <thead>
                            <tr>
                                <th className="table-header">Incompatible courses</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                props.incompatibleCourses.map((inc) => {
                                    return (<tr key={inc} className="table-row">
                                        <td className="table-col">{inc}</td>
                                    </tr>);
                                })
                            }

                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}
export default StudyPlanTable;