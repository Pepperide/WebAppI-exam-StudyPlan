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
                this.db.run('DELETE FROM COURSE', (err) => { if (err) reject(err) });
                this.db.run('DELETE FROM ENROLLED_STUDENTS', (err) => { if (err) reject(err) });
                this.db.run('DELETE FROM INCOMPATIBLE_COURSES', (err) => { if (err) reject(err) });
                this.db.run('DELETE FROM STUDENT', (err) => { if (err) reject(err) });
                this.db.run('DELETE FROM USER', (err) => { if (err) reject(err) });
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
}
module.exports = DAO;