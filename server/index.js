"use strict"
const express = require('express');
const cors = require('cors');
const DAO = require('./dao/DAO')


/* --- SETUP SERVER --- */
const PORT = 3001;
const PATH = '/api/v1/';
const app = new express();
app.use(express.json());
app.use(cors());

/* --- START DATABASE --- */
const database = new DAO("courses.sqlite");

async function initDB() {
    try {
        await database.createDB();
        await database.setTriggers();
        await database.populateDB();
    }
    catch (err) {
        console.log(err);
    }
}
initDB();



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));