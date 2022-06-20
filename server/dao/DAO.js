const crypto = require('crypto');
class DAO {
    sqlite = require('sqlite3');
    fs = require('fs');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });
    }

    isInitialized() {
        return new Promise((resolve, reject) => {
            const sql =
                `   SELECT COUNT(*) AS tables
                    FROM sqlite_master 
                    WHERE type='table';`;

            this.db.get(sql, (err, row) => {
                if (err) reject(err);
                resolve(row.tables);
            });
        });
    }

    runQuery(sql) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, (err) => {
                if (err) reject(err);
                resolve(true);
            });
        });
    }

    getUserByCredentials(username, password) {
        return new Promise((resolve, reject) => {
            const sql =
                `   SELECT *
                    FROM USER U, STUDENT S
                    WHERE U.studentID = S.studentID AND email = ?`;
            this.db.get(sql, [username], (err, row) => {
                if (err) { console.log(err); reject(err); }
                else if (row === undefined) { resolve(false); }
                else {
                    const user = { id: row.studentID, username: row.email, name: row.name, surname: row.surname }
                    const salt = row.salt;
                    crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                        if (err) { reject(err) }
                        if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
                            resolve(false);
                        else
                            resolve(user);
                    });
                }
            });
        });
    }

    getStudentByID(id) {
        return new Promise((resolve, reject) => {
            const sql =
                `   SELECT *
                    FROM STUDENT
                    WHERE studentId=?`;
            this.db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            })
        })
    }

    getCourses() {
        return new Promise((resolve, reject) => {
            const sql =
                `   SELECT *
                    FROM COURSE`;

            this.db.all(sql, (err, rows) => {
                if (err)
                    reject(err);
                resolve(rows);
            });
        });

    }

    getIncompatibleCourses() {
        return new Promise((resolve, reject) => {
            const sql =
                `   SELECT *
                    FROM INCOMPATIBLE_COURSES;`

            this.db.all(sql, (err, rows) => {
                if (err)
                    reject(err);
                resolve(rows);
            });
        });
    }

    getStudyPlanByStudentID(studentID) {
        return new Promise((resolve, reject) => {
            const sql =
                `   SELECT C.code
                    FROM COURSE C, ENROLLED_STUDENTS E
                    WHERE C.code=E.courseID AND E.studentID=?`;
            this.db.all(sql, [studentID], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        });
    }

    storeStudyPlan(courses, workload, studentID) {
        return new Promise((resolve, reject) => {
            const sql =
                `   INSERT INTO ENROLLED_STUDENTS(studentID,courseID)
                    VALUES(?,?);`;
            const sql2 =
                `   UPDATE STUDENT
                    SET workload=?
                    WHERE studentID=?;`;


            this.db.serialize(() => {
                this.db.run('BEGIN TRANSACTION;', (err) => { if (err) reject(err) });

                courses.forEach((c) => {

                    this.db.run(sql, [studentID, c.code], (err) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                    });
                });

                this.db.run(sql2, [workload, studentID], (err) => {
                    if (err) reject(err);
                });
                this.db.run('COMMIT;');
            });
            resolve(true);
        })
    }

    deleteStudyPlan(studentID) {
        return new Promise((resolve, reject) => {
            const sql =
                `   DELETE FROM ENROLLED_STUDENTS
                    WHERE studentID=?`;
            const sql2 =
                `   UPDATE STUDENT
                    SET workload=NULL
                    WHERE studentID=?;`;

            this.db.serialize(() => {
                this.db.run('BEGIN TRANSACTION;', (err) => { if (err) reject(err) });

                this.db.run(sql, [studentID], (err) => {
                    if (err) reject(err);
                });
                this.db.run(sql2, [studentID], (err) => {
                    if (err) reject(err);
                })
                this.db.run('COMMIT;');

            });
            resolve(true);
        });
    }

}
module.exports = DAO;