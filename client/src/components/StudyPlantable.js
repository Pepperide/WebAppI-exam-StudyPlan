import { useState } from 'react';
import { Table, Container } from 'react-bootstrap';


function StudyPlanTable(props) {
    return (
        <>

            <Table striped bordered hover size="sm">
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
                    <TableRow key={0} />
                    <TableRow key={1} />
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
                <td>XXXXXXX</td>
                <td>XXXXXXX</td>
                <td>XXXXXXX</td>
                <td>XXXXXXX</td>
                <td>XXXXXXX</td>
            </tr>
            {collapsed ? '' :
                <tr>
                    <td colSpan={5}>
                        <table className='table table-borderless' size="sm">
                            <thead>
                                <tr>
                                    <th>Incompatible courses</th>
                                    <th>Mandatory courses</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td> YYYYYYY</td>
                                    <td> ZZZZZZZ</td>
                                </tr>
                            </tbody>


                        </table>
                    </td>
                </tr>
            }



        </>
    );
}
export default StudyPlanTable;