import CreateStudyPlan from "./CreateStudyPlan";
import StudyPlanTable from "./StudyPlanTable";

function StudyPlan(props) {
    return (
        <>
            {
                props.courses.lenght > 0 ?
                    <StudyPlanTable courses={props.courses} mode={'view'} /> :
                    <CreateStudyPlan />
            }
        </>
    );
}

export default StudyPlan;