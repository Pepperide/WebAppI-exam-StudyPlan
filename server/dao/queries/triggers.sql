CREATE TRIGGER IF NOT EXISTS check_max_enrolled_students
BEFORE INSERT ON ENROLLED_STUDENTS
FOR EACH ROW
BEGIN

    SELECT RAISE (ABORT, 'Max number of enrolled students has already reached.')
    WHERE EXISTS (
        SELECT 1
        FROM COURSE
        WHERE code = NEW.courseID AND maxStudents = (
            SELECT COUNT(*) 
            FROM ENROLLED_STUDENTS
            WHERE courseID = NEW.courseID
            )
        );
END;