const crypto = require('crypto');
class DAO {
    sqlite = require('sqlite3');
    fs = require('fs');
    constructor(dbname) {
        this.db = new this.sqlite.Database(dbname, (err) => {
            if (err) throw err;
        });
    }

    setTriggers() {
        return new Promise((resolve, reject) => {
            const data_triggers = this.fs.readFileSync('./dao/triggers.sql').toString();
            const triggers = data_triggers.split('END;');

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

    createDB() {
        return new Promise((resolve, reject) => {
            const data_tables = this.fs.readFileSync('./dao/createTables.sql').toString();
            const data_triggers = this.fs.readFileSync('./dao/triggers.sql').toString();
            const tables = data_tables.split(';');
            const triggers = data_triggers.split('END;');

            this.db.serialize(() => {
                this.db.run("PRAGMA foreign_keys=OFF;");
                this.db.run("BEGIN TRANSACTION;");
                this.db.run('DROP TABLE COURSE', (err) => { if (err) reject(err) });
                this.db.run('DROP TABLE ENROLLED_STUDENTS', (err) => { if (err) reject(err) });
                this.db.run('DROP TABLE INCOMPATIBLE_COURSES', (err) => { if (err) reject(err) });
                this.db.run('DROP TABLE STUDENT', (err) => { if (err) reject(err) });
                this.db.run('DROP TABLE USER', (err) => { if (err) reject(err) });
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

    populateDB() {
        return new Promise((resolve, reject) => {
            const data = this.fs.readFileSync('./dao/populateDB.sql').toString();
            const queries = data.split(';');

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
}
module.exports = DAO;