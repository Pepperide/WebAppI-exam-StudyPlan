import { useEffect, useState } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
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
                            <th className="table-header"></th>
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
                            return {
                                key: props.courses.flatMap((c) => c.code).indexOf(c.code),
                                value: c
                            }
                        }).map((c) => {
                            return <TableRow
                                key={c.key}
                                id={c.key}
                                course={c.value}
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
    const toggleCollapsed = () => { setCollapsed((old) => !old) };

    useEffect(() => {
        if (props.studyPlan) {
            const incompatible = props.studyPlan.find((s) => props.course.incompatibleCourses.some((i) => i === s.code));

            !!incompatible ? setDisabled(true) : setDisabled(false);
            !!props.studyPlan.find((s) => s.code === props.course.code) ? setInserted(true) : setInserted(false);
        }

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
                            <HiddenTable key={props.course.code} preparatoryCourse={props.course.preparatoryCourse} incompatibleCourses={props.course.incompatibleCourses} />
                        </div>
                    </td>
                </tr>
            </>}

            {
                props.mode === 'edit' && <>
                    <tr>
                        {
                            disabled ?
                                <>
                                    <td></td>
                                    <td className={collapsed ? "table-row disabled" : "table-row open"}>{props.course.code}</td>
                                    <td className={collapsed ? "table-row disabled" : "table-row open"}>{props.course.name}</td>
                                    <td className={collapsed ? "table-row disabled" : "table-row open"}>{props.course.credits}</td>
                                    <td className={collapsed ? "table-row disabled" : "table-row open"}>{props.course.enrolledStudents}</td>
                                    <td className={collapsed ? "table-row disabled" : "table-row open"}>{props.course.maxStudents}</td>
                                    <td className={collapsed ? "table-row disabled" : "table-row open"}>
                                        <i className="bi bi-caret-down-fill" onClick={toggleCollapsed}></i>
                                    </td>
                                </> :
                                <>
                                    <td className={collapsed ? "table-row disabled" : "table-row open"}>
                                        {inserted ?
                                            <i id="dash-button" className="bi bi-dash-circle-fill" onClick={() => removeCourse()}></i> :
                                            <i id="plus-button" className="bi bi-plus-circle-fill" onClick={() => addCourse()}></i>
                                        }
                                    </td>
                                    <td className={collapsed ? "table-row" : "table-row open"}>{props.course.code}</td>
                                    <td className={collapsed ? "table-row" : "table-row open"}>{props.course.name}</td>
                                    <td className={collapsed ? "table-row" : "table-row open"}>{props.course.credits}</td>
                                    <td className={collapsed ? "table-row" : "table-row open"}>{props.course.enrolledStudents}</td>
                                    <td className={collapsed ? "table-row" : "table-row open"}>{props.course.maxStudents}</td>
                                    <td className={collapsed ? "table-row" : "table-row open"}>
                                        <i className="bi bi-caret-down-fill" onClick={toggleCollapsed}></i>
                                    </td>
                                </>
                        }

                    </tr>
                    {collapsed ? '' : <TableRowExpanded preparatoryCourse={props.course.preparatoryCourse} incompatibleCourses={props.course.incompatibleCourses} />}
                </>
            }
            {
                props.mode === 'lite' && <>
                    <tr onClick={toggleCollapsed}>
                        <td className="table-row" style={{ color: "green" }}>{props.course.code}</td>
                        <td className="table-row" style={{ color: "green" }}>{props.course.name}</td>
                        <td className="table-row" style={{ color: "green" }}>{props.course.credits}</td>
                    </tr>
                </>
            }
        </>
    );
}

function TableRowExpanded(props) {
    return (
        <tr>
            <td className="border-none hidden-table" colSpan={7}>
                <Row>
                    <Col>
                        <Table className="hidden-table" size="sm">
                            <thead>
                                <tr>
                                    <th className="table-header">Mandatory course</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="table-row">{props.preparatoryCourse}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <table className='table table-borderless' size="sm">
                            <thead>
                                <tr>
                                    <th>Incompatible courses</th>
                                </tr>
                            </thead>
                            <tbody>

                                {props.incompatibleCourses.map((inc) => {
                                    return (<tr>
                                        <td className="table-row">{inc}</td>
                                    </tr>);
                                })}

                            </tbody>
                        </table>
                    </Col>
                </Row>
            </td>
        </tr>
    );
}

function HiddenTable(props) {
    return (
        <>
            <Row>
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

                            {props.incompatibleCourses.map((c) => {
                                return {
                                    key: props.incompatibleCourses.flatMap((c) => c.code).indexOf(c.code),
                                    value: c
                                }
                            }).map((inc) => {
                                return (<tr className="table-row">
                                    <td key={inc.key} className="table-col">{inc.value}</td>
                                </tr>);
                            })}

                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}
export default StudyPlanTable;