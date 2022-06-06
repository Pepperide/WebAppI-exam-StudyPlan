const crypto = require('crypto');
class DAO {
    sqlite = require('sqlite3');
    fs = require('fs');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });
    }

    dropTables(tables) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("PRAGMA foreign_keys=OFF;");
                this.db.run("BEGIN TRANSACTION;");
                tables.forEach((q) => {
                    if (q) {
                        q += ";";
                        this.db.run(q, (err) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                        });
                    }
                });
                this.db.run("COMMIT;");
            });
            resolve(true);
        });
    }

    setTriggers(triggers) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                triggers.forEach((t) => {
                    if (t) {
                        t += "END;";
                        this.db.run(t, (err) => {
                            if (err) {
                                console.log("TRIGGER: " + err);
                                reject(err);
                            }
                        });
                    }
                });
            });

            resolve(true);
        });
    }

    createTables(tables) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("PRAGMA foreign_keys=OFF;");
                this.db.run("BEGIN TRANSACTION;");
                tables.forEach((q) => {
                    if (q) {
                        q += ";";
                        this.db.run(q, (err) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                        });
                    }
                });
                this.db.run("COMMIT;");
            });
            resolve(true);
        });
    }

    populateDB(queries) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("PRAGMA foreign_keys=OFF;");
                this.db.run("BEGIN TRANSACTION;");
                queries.forEach((q) => {
                    if (q) {
                        q += ";";
                        this.db.run(q, (err) => {
                            if (err) {
                                reject(err);
                            }
                        });
                    }
                });
                this.db.run("COMMIT;");
            });
            resolve(true);
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

    getCourses() {
        return new Promise((resolve, reject) => {
            const sql =
                `   SELECT *
                    FROM COURSE C
                    WHERE C.code;`;

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
                    FROM COURSE C, INCOMPATIBLE_COURSES I
                    WHERE C.code=I.courseCode;`

            this.db.all(sql, (err, rows) => {
                if (err)
                    reject(err);
                resolve(rows);
            });
        });
    }
}
module.exports = DAO;