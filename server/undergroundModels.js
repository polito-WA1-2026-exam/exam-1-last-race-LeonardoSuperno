function Station(id, name, x, y) {
  this.id = id;
  this.name = name;
  this.x = x;
  this.y = y;
}

function Connection(id, station_from, station_to, line_color, name_station_from, name_station_to) {
    this.id = id,
    this.station_from = station_from,
    this.station_to = station_to,
    this.line_color = line_color,
    this.name_station_from = name_station_from,
    this.name_station_to = name_station_to
}

function Event(id, description, effect) {
    this.id = id,
    this.description = description,
    this.effect = effect
}

export { Station, Connection, Event };