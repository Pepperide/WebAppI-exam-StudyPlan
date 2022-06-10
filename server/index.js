"use strict"
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const fs = require('fs');

const DAO = require('./dao/DAO')


/* --- START DATABASE --- */
const database = new DAO("courses.sqlite");
(async () => {
    try {
        if (await database.isInitialized() > 0) {
            // Tables have already been created. No initialization is required
            return;
        }

        // init database
        const data_createTables = fs.readFileSync('./dao/queries/createTables.sql').toString();
        const tables = data_createTables.split(';\n');
        for (let query of tables) {
            if (!!query) {
                query += ";";
                await database.runQuery(query);
            }
        }

        const data_triggers = fs.readFileSync('./dao/queries/triggers.sql').toString();
        const triggers = data_triggers.split('END;');
        for (let query of triggers) {
            if (!!query) {
                query += "END;";
                await database.runQuery(query);
            }
        }

        const data_insertRecords = fs.readFileSync('./dao/queries/populateDB.sql').toString();
        const records = data_insertRecords.split(';');
        for (let query of records) {
            if (!!query) {
                query += ";";
                await database.runQuery(query);
            }
        }


    }
    catch (err) {
        console.log(err);
    }
})();


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

/* Session API */
app.post(PATH + '/login', passport.authenticate('local'), (req, res) => {
    return res.status(201).json(req.user);
});

app.delete(PATH + '/logout', (req, res) => {
    req.logout(() => res.end());
});

app.get(PATH + '/userInfo', isLoggedIn, (req, res) => {
    return res.status(201).json(req.user);
});
/* ---------- */

/* Courses API */
app.get(PATH + '/courses', async (req, res) => {
    try {
        const courses = await database.getCourses();
        const incompatibleCourses = await database.getIncompatibleCourses();

        courses.forEach((c) => {
            const inc = incompatibleCourses.filter((i) => i.courseCode === c.code).map((i) => i.incompatibleCode);
            c["incompatibleCourses"] = inc;
        });

        courses.sort((a, b) => { return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1 });
        return res.status(200).json(courses);
    }
    catch (err) {
        console.log(err);
        return res.status(503).json(err);
    }
});

app.get(PATH + '/courses/studyplan', isLoggedIn, async (req, res) => {
    try {
        const courses = await database.getStudyPlanByStudentID(req.user.id);
        courses.sort((a, b) => { return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1 });
        return res.status(200).json(courses);
    }
    catch (err) {
        console.log(err);
        return res.status(503).json(err);
    }
});

app.post(PATH + '/courses/studyplan', isLoggedIn, async (req, res) => {
    try {
        await database.deleteStudyPlan(req.user.id);
        await database.storeStudyPlan(req.body.studyPlan, req.body.workload, req.user.id);

        return res.status(201).end();
    }
    catch (err) {
        console.log(err);
        return res.status(503).json(err);
    }
});

app.delete(PATH + '/courses/studyplan', isLoggedIn, async (req, res) => {
    try {
        await database.deleteStudyPlan(req.user.id);

        return res.status(204).end();
    }
    catch (err) {
        console.log(err);
        return res.status(503).json(err);
    }
});
/*--------------------- */

/* Students API */
app.get(PATH + '/studentInfo', isLoggedIn, async (req, res) => {
    try {
        const student = await database.getStudentByID(req.user.id);

        return res.status(200).json(student);
    }
    catch (err) {
        console.log(err);
        return res.status(503).json(err);
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
