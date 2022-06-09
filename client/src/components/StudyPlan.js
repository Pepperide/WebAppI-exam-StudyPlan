import CreateStudyPlan from "./CreateStudyPlan";
import StudyPlanTable from "./StudyPlanTable";

function StudyPlan(props) {
    console.log(props.courses)
    return (
        <>
            {
                props.courses.length > 0 ?
                    <StudyPlanTable courses={props.courses} mode={'lite'} /> :
                    <CreateStudyPlan />
            }
        </>
    );
}

export default StudyPlan;