import { useState } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import './css/StudyPlanTable.css'

function StudyPlanTable(props) {
    return (
        <>
            <Table className="main-table" hover size="sm">
                <thead>
                    <tr>
                        <th className="table-header">Code</th>
                        <th className="table-header">Name</th>
                        <th className="table-header">Credits</th>
                        <th className="table-header">Enrolled students</th>
                        <th className="table-header">Max students</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.courses.map((c) => {
                            return {
                                key: props.courses.flatMap((c) => c.code).indexOf(c.code),
                                value: c
                            }
                        }).map((c) => {
                            return <TableRow key={c.key} course={c.value} />
                        })
                    }
                </tbody>
            </Table>

        </>
    );
}

function TableRow(props) {
    const [collapsed, setCollapsed] = useState(true);
    const toggleCollapsed = () => { setCollapsed((old) => !old) };

    return (
        <>
            <tr onClick={toggleCollapsed}>
                <td className={collapsed ? "table-row" : "table-row open"}>{props.course.code}</td>
                <td className={collapsed ? "table-row" : "table-row open"}>{props.course.name}</td>
                <td className={collapsed ? "table-row" : "table-row open"}>{props.course.credits}</td>
                <td className={collapsed ? "table-row" : "table-row open"}>{props.course.enrolledStudents}</td>
                <td className={collapsed ? "table-row" : "table-row open"}>{props.course.maxStudents}</td>
            </tr>
            {collapsed ? '' : <TableRowExpanded preparatoryCourse={props.course.preparatoryCourse} incompatibleCourses={props.course.incompatibleCourses} />}
        </>
    );
}

function TableRowExpanded(props) {
    return (
        <tr>
            <td className="border-none hidden-table" colSpan={5}>
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

function IncompatibleRow(props) {
    return (<></>);
}
export default StudyPlanTable;