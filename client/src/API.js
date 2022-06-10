const APIURL = 'http://localhost:3001/api/v1';

async function login(credentials) {
    const url = APIURL + '/login'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
}

async function logout() {
    const url = APIURL + '/logout';
    const response = await fetch(url, {
        method: "DELETE",
        credentials: 'include',
    });
    if (response.ok) {
        return null;
    }
}

async function getCourses() {
    const url = APIURL + '/courses';
    try {
        const response = await fetch(url, {
            credentials: 'include',
        });

        if (response.ok) {
            const list = await response.json('');
            return list;
        }
        else {
            console.log(response.statusText);
            const text = await response.text();
            throw new TypeError(text);
        }

    }
    catch (err) {
        // network error
        console.log(err);
        throw err;
    }

}

async function getStudyPlan(userID) {
    const url = APIURL + '/courses/studyplan';
    try {
        const response = await fetch(url, {
            credentials: 'include',
        });

        if (response.ok) {
            const list = await response.json('');
            return list;
        }
        else {
            console.log(response.statusText);
            const text = await response.text();
            throw new TypeError(text);
        }

    }
    catch (err) {
        // network error
        console.log(err);
        throw err;
    }

}

async function getStudentInfo() {
    const url = APIURL + '/studentInfo';
    try {
        const response = await fetch(url, {
            credentials: 'include',
        });

        if (response.ok) {
            const list = await response.json('');
            return list;
        }
        else {
            console.log(response.statusText);
            const text = await response.text();
            throw new TypeError(text);
        }
    }
    catch (err) {
        // network error
        console.log(err);
        throw err;
    }
}

async function storeUserStudyPlan(studyPlan) {
    const url = APIURL + '/courses/studyplan'
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(studyPlan),
        });
        if (!response.ok) {
            const errDetails = await response.text();
            throw errDetails;
        }
    }
    catch (err) {
        // network error
        console.log(err);
        throw err;
    }
}

async function deleteUserStudyPlan() {
    const url = APIURL + '/courses/studyplan'
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            const errDetails = await response.text();
            throw errDetails;
        }
    }
    catch (err) {
        // network error
        console.log(err);
        throw err;
    }
}

async function getEnrolledStudents() {
    const url = APIURL + '/courses/enrolledstudents';
    try {
        const response = await fetch(url, {
            credentials: 'include',
        });

        if (response.ok) {
            const list = await response.json('');
            return list;
        }
        else {
            console.log(response.statusText);
            const text = await response.text();
            throw new TypeError(text);
        }
    }
    catch (err) {
        // network error
        console.log(err);
        throw err;
    }
}
export {
    login,
    logout,
    getCourses,
    getStudyPlan,
    getStudentInfo,
    storeUserStudyPlan,
    deleteUserStudyPlan,
    getEnrolledStudents
}