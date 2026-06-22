
export const buildGraph = (connections) => {

    const graph = {};

    for (const conn of connections) {

        const from = conn.station_from;
        const to = conn.station_to;

        // lists initialization
        if (!graph[from]) graph[from] = [];
        if (!graph[to]) graph[to] = [];

        
        graph[from].push(to);
        graph[to].push(from);
    }

    return graph;
};

export const bfs = (graph, startId) => {

    const queue = [startId];
    const distances = { [startId]: 0 };

    while (queue.length > 0) {
        const current = queue.shift();

        for (const neighbor of graph[current] || []) {
            if (distances[neighbor] === undefined) {
                distances[neighbor] = distances[current] + 1;
                queue.push(neighbor);
            }
        }
    }

    return distances;
};


export const generateGame = (stations, graph) => {

    while (true) {

        // random start
        const start =
            stations[Math.floor(Math.random() * stations.length)];

        // BFS to compute distances
        const distances = bfs(graph, start.id);

        // filter by valid destination
        const validDestinations = stations.filter(s =>
            s.id !== start.id &&
            distances[s.id] >= 3
        );

        if (validDestinations.length === 0) {
            continue; // try another start
        }

        // random destination
        const destination =
            validDestinations[
                Math.floor(Math.random() * validDestinations.length)
            ];

        return { start, destination };
    }
};