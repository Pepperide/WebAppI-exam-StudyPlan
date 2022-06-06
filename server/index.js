"use strict"
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const DAO = require('./dao/DAO')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session')

/* --- START DATABASE --- */
const database = new DAO("courses.sqlite");
async function initDB() {
    try {
        const data_createTables = fs.readFileSync('./dao/queries/createTables.sql').toString();
        const data_deleteTables = fs.readFileSync('./dao/queries/deleteTables.sql').toString();
        const data_insertRecords = fs.readFileSync('./dao/queries/populateDB.sql').toString();
        const data_triggers = fs.readFileSync('./dao/queries/triggers.sql').toString();

        const triggers = data_triggers.split('END;');
        const insertQueries = data_insertRecords.split(';');
        const createQueries = data_createTables.split(';');
        const dropQueries = data_deleteTables.split(';');

        await database.dropTables(dropQueries);
        await database.createTables(createQueries);
        await database.setTriggers(triggers);
        await database.populateDB(insertQueries);
    }
    catch (err) {
        console.log(err);
    }
}
initDB();


/* --- SETUP SERVER --- */
const PORT = 3001;
const PATH = '/api/v1';
const app = new express();
app.use(express.json());

// set up cors
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));

// set up passport
passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await database.getUserByCredentials(username, password);
    if (!user) {
        return callback(null, false, { message: 'Incorrect username of password.' });
    }
    return callback(null, user);
}));

// set up session
app.use(session({
    secret: "web app I exam",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

passport.serializeUser(function (user, callback) {
    callback(null, user);
})

passport.deserializeUser(function (user, callback) {
    return callback(null, user);
})

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Not authorized' });
}

/* --- API ---*/
app.post(PATH + '/login', passport.authenticate('local'), (req, res) => {
    return res.status(201).json(req.user);
});

app.delete(PATH + '/logout', (req, res) => {
    req.logout(() => res.end());
})

app.get(PATH + '/userInfo', isLoggedIn, (req, res) => {
    return res.status(201).json(req.user);
})

app.get(PATH + '/courses', async (req, res) => {
    try {
        const courses = await database.getCourses();
        const incompatibleCourses = await database.getIncompatibleCourses();
        // TODO enrolled_students
        courses.forEach((c) => {
            const inc = incompatibleCourses.filter((i) => i.courseCode === c.code).map((i) => i.incompatibleCode);
            c["incompatibleCourses"] = inc;
        })

        return res.status(200).json(courses);
    }
    catch (err) {
        return res.status(503).json(err);
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));