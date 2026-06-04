async function getStations() {
    try {
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

export { getStations, getConnections }