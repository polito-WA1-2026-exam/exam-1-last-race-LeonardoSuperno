# Exam #1: "Last Race"
## Student: s338685 SUPERNO FALCO LEONARDO

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/sessions`
  - request body:
  ```json
  {
    "username": "luigi.derussis@polito.it",
    "password": "password"
  }
  ```
  - response body:
  ```json
  {
    "id": 1,
    "username": "luigi.derussis@polito.it",
    "name": "Luigi De Russis"
  }
  ```
- GET `/api/sessions/current`
  - response body:
  ```json
  {
    "id": 1,
    "email": "luigi.derussis@polito.it",
    "name": "Luigi",
    "surname": "De Russis"
  }
  ```
- DELETE `/api/sessions/current`


- GET `/api/stations`
  - response body
  ```json
  [
    {
      "id": 1,
      "name": "Artemide Woods",
      "x": 1,
      "y": 4
    }
  ]
  ```
- GET `/api/connections`
  - response body
  ```json
  [
    {
      "id": 1,
      "station_from": 1,
      "station_to": 4,
      "line_color": "#1e88e5"
    }
  ]
  ```
- GET `/api/ranking`
  - response body 
  ```json
  [
    {
      "user_id": 1,
      "user_name": "Leo",
      "best_score": 25
    }
  ]
  ```
- POST `/api/new_game`
  - response body 
  ```json
  {
    "game_id": 1,
    "starting_station": {
      "id": 1,
      "name": "Artemide Woods",
      "x": 1,
      "y": 4
    },
    "destination_station": {
      "id": 10,
      "name": "Ares Arena",
      "x": 4,
      "y": 2
    }
  }
  ```
- POST `/api/end_game`
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
    "final_score": 14,
    "events": [
      {
        "id": 1,
        "description": "Train strike",
        "effect": -4
      }
    ]
  }
  ```


## Database Tables

- Table `lines` - id, name, color
- Table `stations` - id, name, x, y
- Table `connections` - id, station_from, station_to, line_id
- Table `events` - id, description, effect
- Table `games` - id, user_id, start_station_id, destination_station_id, final_score, creation_time
- Table `users` - id, name, email, password, salt

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
