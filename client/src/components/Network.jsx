import { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

function NetworkDisplay(props) {

    const stations = props.stations || [];
    const connections = props.connections || [];
    
    const SCALE_Y = 100;
    const SCALE_X = 200;
    const MARGIN_Y = 50;
    const MARGIN_X = 100;

    const stationsMap = Object.fromEntries(
        stations.map(station => [station.id, station])
    );

    return (
        <Container fluid className="mt-4">
            <Card className="shadow-sm border-0 w-100 h-100">
                <Card.Header
                    style={{
                        backgroundColor: "#fdf7c0",
                        borderBottom: "5px solid #1A2A3A",
                        color: "#1A2A3A"
                    }}
                    >
                    <h4 className="mb-0">Network Map</h4>
                </Card.Header>

                <Card.Body className="d-flex justify-content-center align-items-center p-0">
                    <svg
                        viewBox="0 0 800 400"
                        preserveAspectRatio="xMidYMid meet"
                        style={{
                            width: "75%",
                            height: "75%",
                            backgroundColor: "#f8f9fa"
                        }}
                    >
                        {/* Connessioni */}
                        {connections.map(connection => {
                            const from = stationsMap[connection.station_from];
                            const to = stationsMap[connection.station_to];

                            if (!from || !to) return null;

                            const x1 = from.x * SCALE_X + MARGIN_X;
                            const y1 = from.y * SCALE_Y + MARGIN_Y;
                            const x2 = to.x * SCALE_X + MARGIN_X;
                            const y2 = to.y * SCALE_Y + MARGIN_Y;

                            return (
                                <g key={connection.id}>
                                    {/* Bordo della linea */}
                                    <line
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke="#333"
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                    />

                                    {/* Linea colorata */}
                                    <line
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke={connection.line_color}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                    />
                                </g>
                            );
                        })}

                        {/* Stazioni */}
                        {stations.map(station => {
                            const x = station.x * SCALE_X + MARGIN_X;
                            const y = station.y * SCALE_Y + MARGIN_Y;

                            return (
                                <g key={station.id}>
                                    <rect
                                        x={x - 65}
                                        y={y - 20}
                                        width="130"
                                        height="40"
                                        rx="12"
                                        fill="#fffacd"
                                        stroke="#1A2A3A"
                                        strokeWidth="2"
                                    />

                                    <text
                                        x={x}
                                        y={y + 5}
                                        textAnchor="middle"
                                        fill="1A2A3A"
                                        fontSize="13"
                                        fontWeight="600"
                                    >
                                        {station.name}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </Card.Body>
            </Card>
            

        </Container>
    );
}



export default NetworkDisplay;