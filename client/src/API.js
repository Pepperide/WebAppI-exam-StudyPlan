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

export {
    login,
    logout
}