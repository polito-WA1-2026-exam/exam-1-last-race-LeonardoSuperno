import sqlite from "sqlite3";
import { Station, Connection, Event } from "./undergroundModels.js";
import crypto from "crypto";

const db = new sqlite.Database("underground.sqlite", (err) => {
    if (err) throw err;
});


/* USERS */
export const getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE email = ?";
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = { id: row.id, username: row.email, name: row.name };

                crypto.scrypt(password, row.salt, 16, function (err, hashedPassword) {
                    if (err) reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.password, "hex"), hashedPassword))
                        resolve(false);
                    else
                        resolve(user);
                });
            }
        });
    });
};

// retrieve all the Stations
export const listStations = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM stations";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                const stations = rows.map((s) => new Station(s.id, s.name, s.x, s.y));
                resolve(stations);
            }
        });
    });
}

// retrieve all the Connections
export const listConnections = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                connections.id AS id,
                connections.station_from AS station_from,
                connections.station_to AS station_to,
                connections.line_id AS line_id,
                lines.color AS color,
                lines.name AS name
            FROM connections
            JOIN lines ON connections.line_id = lines.id
        `;
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                const connections = rows.map((c) => new Connection(c.id, c.station_from, c.station_to, c.color));
                resolve(connections);
            }
        });
    });
}

// retrieve all the Events
export const listEvents = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM events";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                const events = rows.map((e) => new Event(e.id, e.description, e.effect));
                resolve(events);
            }
        });
    });
}

// retrieve a game by id
export const getGameById = (gameId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM games WHERE id = ?";
        db.get(sql, [gameId], (err, row) => {
            if (err) reject(err);
            else if (row === undefined) resolve(null);
            else resolve(row);
        });
    });
}


// initialize a new game
export const newGame = (userId, startStationId, destinationStationId) => {
    return new Promise((resolve, reject) => {

        const sql = "INSERT INTO games (user_id, start_station_id, destination_station_id, final_score) VALUES (?, ?, ?, 0)";

        db.run(sql,
            [userId, startStationId, destinationStationId],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};

export const endGame = (gameId, score) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE games SET final_score = ?, status = 'COMPLETED' WHERE id = ?";

        db.run(sql, [score, gameId], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
};
