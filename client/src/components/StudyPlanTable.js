import { useState } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import './css/StudyPlanTable.css'

function StudyPlanTable(props) {
    return (
        <>
            <Table className="main-table" striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Credits</th>
                        <th>Enrolled students</th>
                        <th>Max students</th>
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
                <td className={collapsed ? "table-row-main" : "table-row-main open"}>{props.course.code}</td>
                <td className={collapsed ? "table-row-main" : "table-row-main open"}>{props.course.name}</td>
                <td className={collapsed ? "table-row-main" : "table-row-main open"}>{props.course.credits}</td>
                <td className={collapsed ? "table-row-main" : "table-row-main open"}></td>
                <td className={collapsed ? "table-row-main" : "table-row-main open"}>{props.course.maxStudents}</td>
            </tr>
            {collapsed ? '' : <TableRowExpanded preparatoryCourse={props.course.preparatoryCourse} incompatibleCourses={props.course.incompatibleCourses} />}
        </>
    );
}

function TableRowExpanded(props) {
    return (
        <tr>
            <td colSpan={5}>
                <Row>
                    <Col className="hidden-table">
                        <table className='table table-borderless' size="sm">
                            <thead>
                                <tr>
                                    <th>Mandatory course</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{props.preparatoryCourse}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col className="hidden-table">
                        <table className='table table-borderless' size="sm">
                            <thead>
                                <tr>
                                    <th>Incompatible courses</th>
                                </tr>
                            </thead>
                            <tbody>

                                {props.incompatibleCourses.map((inc) => {
                                    return (<tr>
                                        <td>{inc}</td>
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