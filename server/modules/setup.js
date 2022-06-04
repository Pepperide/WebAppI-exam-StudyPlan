async function createDB(database) {
    const data = this.fs.readFileSync('./dao/createTables.sql').toString();
    const queries = data.split(';').map((q) => q + ";");
    for (q of queries) {
        await database.runQuery(q);
    }
}

module.exports = {
    createDB
}