# Exam #1: "Last Race"
## Student: s338685 SUPERNO FALCO LEONARDO

## React Client Application Routes

- Route `/`: Information of the game, available also for unauthenticated users.
- Route `/home`: Network map visualization showing all stations and connections.
- Route `/login`: Login form for the authentication.
- Route `/logout`: Clears the authenticated user's session information.
- Route `/game`: Network map visualization showing only the stations. Displays game information, including the starting station, destination station, and timer. Allows path selection through the available connections.
- Route `/results`: Displays the final score and the extracted events if the selected path is valid.
- Route `/error`: Dedicated page to handle unexpected errors

## API Server

- POST `/api/sessions`
  - request body:
  ```json
  {
    "username": "fulvio.corno@email.it",
    "password": "password"
  }
  ```
  - response body:
  ```json
  {
    "id": 2,
    "username": "fulvio.corno@email.it",
    "name": "Fulvio Corno"
  }
  ```
- GET `/api/sessions/current`
  - request body: none
  - response body:
  ```json
  {
    "id": 2,
    "username": "fulvio.corno@email.it",
    "name": "Fulvio Corno"
  }
  ```
  - status codes: 200 OK, 401 Unauthorized, 500 Internal Server Error
- DELETE `/api/sessions/current`


- GET `/api/stations`
  - request parameters and body: none
  - response body
  ```json
  [
    {
      "id": 1,
      "name": "Cleopatra",
      "x": 0,
      "y": 3
    }
  ]
  ```
  - status codes: 200 OK, 500 Internal Server Error
- GET `/api/connections`
  - request parameters and body: none
  - response body
  ```json
  [
    {
      "id": 1,
      "station_from": 1,
      "station_to": 4,
      "line_color": "#800080",
      "name_station_from": "Cleopatra",
      "name_station_to": "Ramses"
    }
  ]
  ```
  - status codes: 200 OK, 500 Internal Server Error
- GET `/api/events`
  - request parameters and body: none
  - response body
  ```json
  [
    {
    "id": 1,
    "description": "Sandstorm Collapse",
    "effect": -4
    }
  ]
  ```
  - status codes: 200 OK, 500 Internal Server Error

- POST `/api/new_game`
  - auth: user identified via passport session
  - request body: none
  - response body 
  ```json
  {
    "game_id": 1,
    "starting_station": {
      "id": 12,
      "name": "Giza",
      "x": 3,
      "y": 0
    },
    "destination_station": {
      "id": 7,
      "name": "Osiris",
      "x": 0,
      "y": 1
    }
  }
  ```
  - status codes: 200 OK, 401 Unauthorized, 500 Internal Server Error

- POST `/api/end_game`
  - auth: user identified via passport session
  - request body
  ```json
  {
    "game_id": 1,
    "selected_connections" : [1, 6, 11] 
  }
  ```
  - response body
  ```json
  {
    "final_score": 16,
    "events": [
      {
        "id": 1,
        "description": "Sandstorm Collapse",
        "effect": -4
      }
    ]
  }
  ```
  - status codes: 200 OK, 401 Unauthorized, 500 Internal Server Error

- GET `/api/games/:game_id`:
  - request parameter: game_id
  - response body
  ```json
  {
    "id": 1,
    "user_id": 1,
    "start_station_id": 6,
    "destination_station_id": 10,
    "final_score": 22,
    "creation_time": "2026-05-31 17:35:47",
    "status": "COMPLETED"
  }
  ```
  - status codes: 200 OK, 404 Not Found, 500 Internal Server Error

- GET `/api/ranking`
  - auth: user identified via passport session
  - request body: none
  - response body 
  ```json
  [
    {
      "name": "Fulvio Corno",
      "best_score": 28
    }
  ]
  ```
  - status codes: 200 OK, 401 Unauthorized, 500 Internal Server Error

## Database Tables

- Table `lines` - id, name, color
- Table `stations` - id, name, x, y
- Table `connections` - id, station_from, station_to, line_id
- Table `events` - id, description, effect
- Table `games` - id, user_id, start_station_id, destination_station_id, final_score, creation_time, status
- Table `users` - id, name, email, password, salt

## Main React Components

- `InfoDisplay` (in `InfoDisplay.jsx`): Displays the information related to the map, the path selection and the scoring system.
- `NetworkDisplay` (in `NetworkDisplay.jsx`): Renders the railway network map, is possible to provide just the stations or also the connections.
- `GameDisplay` (in `GameDisplay.jsx`): Manages the active game session, displaying the start and destination stations, timer, available connections, and user path selection.
- `ResultsDisplay` (in `ResultsDisplay.jsx`): Shows the final score, extracted events, and outcome of the completed game.
- `RankingDisplay` (in `RankingDisplay.jsx`): Displays the leaderboard containing the best scores achieved by registered users.

(only _main_ components, minor ones may be skipped)

## Screenshot

![Ranking](.\client\src\images\ranking.png)
![Game](.\client\src\images\game.png)

## Users Credentials

- leonardo.superno@gmail.com, password
- fulvio.corno@email.it, password
- francesca.russo@email.it, password
- stefano.corgnati@email.it, password

## Use of AI Tools
I used ChatGPT for clarifications and  code generation in particular for UI design improvements. I also used GitHub Copilot for simple inline code suggestions.