// imports
import express from "express";
import morgan from "morgan"
import cors from "cors"
import { check, validationResult } from "express-validator";
import { getUser, listStations, listConnections, listEvents, getGameById, newGame, endGame } from "./dao.js";
import { generateGame, buildGraph } from "./gameService.js";


import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';


// init express
const app = new express();
const port = 3001;

// middlewares
app.use(express.json());
app.use(morgan("dev"));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200,
  credentials: true
};
app.use(cors(corsOptions))

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  
  if(!user)
    //null -> no error, invalid credetials, message
    return cb(null, false, "Incorrect username or password."); // error message in the WWW-Authenticated header of the response
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});



const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  console.log(req.user)
  return res.status(401).json({error: "Not authorized"});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate("session"));

/* ROUTES */

// POST /api/sessions
app.post("/api/sessions", passport.authenticate("local"), function(req, res) {
  return res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: "Not authenticated"});
});

// DELETE /api/session/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// GET /api/stations
app.get("/api/stations", (request, response) => {
  listStations()
    .then(stations => response.json(stations))
    .catch(() => response.status(500).end());
});

// GET /api/connections
app.get("/api/connections", (request, response) => {
  listConnections()
    .then(connections => response.json(connections))
    .catch(() => response.status(500).end());
});

// GET /api/events
app.get("/api/events", (request, response) => {
  listEvents()
    .then(events => response.json(events))
    .catch(() => response.status(500).end());
});

// GET /api/games/:id
app.get("/api/games/:id", (request, response) => {
  getGameById(request.params.id)
    .then(game => {
      if (!game) {
        return response.status(404).json({ error: "Game not found" });
      }
      response.json(game);
    })
    .catch(() => response.status(500).end());
});

// POST /api/new_game
app.post("/api/new_game", isLoggedIn, async (req, res) => {

    const stations = await listStations();
    const connections = await listConnections();
    const graph = buildGraph(connections);

    const { start, destination } =
        generateGame(stations, graph);

    const game = await newGame(req.user.id, start.id, destination.id);

    res.json({
        game_id: game.id,
        starting_station: start,
        destination_station: destination
    });
});

// POST /api/end_game
app.post("/api/end_game", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user.id;
        const { game_id, selected_connections } = req.body;
        console.log("Selected connections:", selected_connections);

        // 1. GET GAME
        const game = await getGameById(game_id);

        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }

        // 2. CHECK OWNER
        if (game.user_id !== userId) {
            return res.status(403).json({ error: "Not your game" });
        }

        // 3. CHECK STATUS
        if (game.status === "COMPLETED") {
            return res.status(400).json({ error: "Game already finished" });
        }

        // 4. LOAD GRAPH
        const connections = await listConnections();
        
        const graph = buildGraph(connections);



        // 5. VALIDATE PATH (must be continuous)
        let old_station = game.start_station_id;

        for (let i = 0; i < selected_connections.length; i++) {

            const conn = connections.find(c => c.id === selected_connections[i]);

            if (!conn) {
                return res.status(400).json({ error: "Invalid connection id" });
            }

            if (conn.station_to !== old_station && conn.station_from !== old_station) {
                return res.status(400).json({ error: "Invalid path sequence" });
            }
            old_station = (conn.station_from === old_station) ? conn.station_to : conn.station_from;
        }

        if (old_station !== game.destination_station_id) {
            return res.status(400).json({ error: "Path does not reach destination" });
        }

        // 8. BASE SCORE
        let score = 20;

        // 9. APPLY EVENTS (1 random event per connection)
        const events = await listEvents();

        const appliedEvents = [];

        for (const connId of selected_connections) {

            const event = events[Math.floor(Math.random() * events.length)];

            score += event.effect;

            appliedEvents.push({
                connection_id: connId,
                event
            });
        }

        // 10. SCORE NORMALIZATION
        if (score < 0) score = 0;

        // 11. UPDATE GAME
        await endGame(game_id, score);


      
        return res.json({
            final_score: score,
            events: appliedEvents
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
    

   
});



// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});