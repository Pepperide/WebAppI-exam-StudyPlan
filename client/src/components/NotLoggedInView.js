import { Container } from 'react-bootstrap'
import StudyPlanTable from './StudyPlanTable';

import './css/NotLoggedInView.css'

function NotLoggedInView(props) {
    return (
        <>
            <Container fluid>
                <h2 className="title">PoliTO Study Plan</h2>
                <Container className="table-frame">
                    <StudyPlanTable courses={props.courses} mode={'view'} />
                </Container>
            </Container>
        </>
    );
}

export default NotLoggedInView;