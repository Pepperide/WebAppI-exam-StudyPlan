CREATE TABLE IF NOT EXISTS
COURSE(
    code VARCHAR(7) NOT NULL,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    enrolledStudents INTEGER,
    maxStudents INTEGER,
    preparatoryCourse VARCHAR(7),
    PRIMARY KEY(code)
);

CREATE TABLE IF NOT EXISTS
INCOMPATIBLE_COURSES(
    courseCode VARCHAR(7) NOT NULL,
    incompatibleCode VARCHAR(7) NOT NULL,
    PRIMARY KEY(courseCode, incompatibleCode)
);

CREATE TABLE IF NOT EXISTS
STUDENT(
    studentID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    workload TEXT
);

CREATE TABLE IF NOT EXISTS
USER(
    email TEXT NOT NULL,
    hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    studentID INTEGER NOT NULL,
    PRIMARY KEY(email),
    FOREIGN KEY(studentID) REFERENCES STUDENT(studentID)
);

CREATE TABLE IF NOT EXISTS
ENROLLED_STUDENTS(
    studentID INTEGER NOT NULL,
    courseID VARCHAR(7) NOT NULL,
    PRIMARY KEY(studentID,courseID)
);