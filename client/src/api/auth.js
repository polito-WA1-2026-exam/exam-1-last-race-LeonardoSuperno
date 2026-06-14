async function doLoginAPI(username, password) {
    const response = await fetch('http://localhost:3001/api/sessions', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    if (response.ok) {
        const user = await response.json()
        return user
    } else {
        let message = "Login failed";

        if (response.status === 401) {
            message = "Wrong username or password";
        }

        throw new Error(message);
    }
    
}

async function doLogoutAPI() {
    const response = await fetch('http://localhost:3001/api/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    })

    if (response.ok) {
        return true
    } else {
        throw new Error("Logout failed")
    }
}


export { doLoginAPI, doLogoutAPI }