function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getStations() {
    try {
        await delay(500) // simulate network delay
        const response = await fetch('http://localhost:3001/api/stations')

        if (response.ok) {
            const list_of_stations = await response.json()
            return list_of_stations
        } else {
            // 4xx or 5xx status code
            throw new Error('HTTP error in getStations, code=' + response.status)
        }
    } catch (ex) {
        // handle network errors + parsing errors
        throw new Error("Network error", { cause: ex })
    }
}

async function getConnections() {
    try {
        await delay(500) // simulate network delay
        const response = await fetch('http://localhost:3001/api/connections')

        if (response.ok) {
            const list_of_connections = await response.json()
            return list_of_connections
        } else {
            // 4xx or 5xx status code
            throw new Error('HTTP error in getConnections, code=' + response.status)
        }
    } catch (ex) {
        // handle network errors + parsing errors
        throw new Error("Network error", { cause: ex })
    }
}

async function newGame() {
    try {
        await delay(500) // simulate network delay
        const response = await fetch('http://localhost:3001/api/new_game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
    
        if (response.ok) {
            const gameData = await response.json()
            return gameData
        } else {
            // 4xx or 5xx status code
            throw new Error('HTTP error in newGame, code=' + response.status)
        }
    } catch (ex) {
        // handle network errors + parsing errors
        throw new Error("Network error", { cause: ex })
    }
}

async function endGame(requestBody) {
    try {
        await delay(500) // simulate network delay
        const response = await fetch('http://localhost:3001/api/end_game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            credentials: 'include'
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw new Error('HTTP error in endGame, code=' + response.status);
        }
    } catch (ex) {
        throw new Error("Network error", { cause: ex });
    }
}

async function getRanking() {
    try {
        await delay(500) // simulate network delay
        const response = await fetch('http://localhost:3001/api/ranking', {
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw new Error('HTTP error in getRanking, code=' + response.status);
        }
    } catch (ex) {
        throw new Error("Network error", { cause: ex });
    }
}

export { getStations, getConnections, newGame, endGame, getRanking };