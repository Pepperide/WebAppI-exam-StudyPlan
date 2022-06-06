"use strict"
const express = require('express');
const cors = require('cors');
const DAO = require('./dao/DAO')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session')

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


/* --- API ---*/
app.post(PATH + '/login', passport.authenticate('local'), (req, res) => {
    return res.status(201).json(req.user);
});

app.delete(PATH + '/logout', (req, res) => {
    req.logout(() => res.end());
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));