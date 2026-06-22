import { useEffect, useState } from "react";
import { Row, Col, Card, ListGroup, Button,Spinner, Alert, Stack } from "react-bootstrap";
import { ArrowUp, ArrowDown, Trash } from "react-bootstrap-icons";
import { useNavigate } from 'react-router';
import { newGame } from "../api/api.js";



function GameDisplay({ connections = [],  selectedConnections, setSelectedConnections, gameId, setGameId }) {
    const [gameInfo, setGameInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(90);
    const [expired, setExpired] = useState(false);

    const navigate = useNavigate(); 
    

    useEffect(() => {
        const loadGame = async () => {
            try {
                const game = await newGame();

                setGameInfo(game);
                setGameId(game.game_id);
                setSelectedConnections([]);

            } catch (err) {
                navigate("/error", {
                    state: {
                        type: "unable to start the game",
                        message: err.message
                    }}
                )
            } finally {
                setLoading(false);
            }
        };

        loadGame();
    }, []);

    // Countdown timer
    useEffect(() => {
        if (loading || !gameInfo) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, gameInfo]);

    // Automatically submit path when time expires
    useEffect(() => {
        if (!expired) return;
        
        const timeout = setTimeout(() => {
            navigate("/results", { replace: true }); // avoid to go back to the game page
        }, 3000);

        return () => clearTimeout(timeout);
    }, [expired]);

    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-start align-items-center vh-100 pt-3">
            <Spinner animation="border" />
            <div className="mt-2">Loading the game</div>
            </div>
        );
    }


    
    if (expired) {
        return (
            <Alert variant="danger" className="text-center">
                Time's up! Submitting your path...
            </Alert>
        );
    }
    return (
        <>
            <Card className="mb-4">
                <Card.Header
                    style={{
                        backgroundColor: "#fffacd",
                        borderBottom: "5px solid #1A2A3A",
                        color: "#1A2A3A"
                    }}
                    >
                    <h4 className="mb-0">Game Information</h4>
                </Card.Header>

                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <h5>Starting Station</h5>
                            <p>
                                <strong>{gameInfo.starting_station.name}</strong>
                                
                            </p>
                        </Col>

                        <Col md={4}>
                            <h5>Destination Station</h5>
                            <p>
                                <strong>{gameInfo.destination_station.name}</strong>
                                
                            </p>
                        </Col>
                        <Col md={4}>
                            <Alert variant={timeLeft <= 10 ? "danger" : "primary"} className="text-center">
                                 Time left: {timeLeft}s
                            </Alert>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <PathSelection connections={connections} selectedConnections={selectedConnections} setSelectedConnections={setSelectedConnections} />
        </>
    );
}

function ConnectionItem({ connection, selected, index, total, mode, onSelect, onRemove, onMoveUp, onMoveDown }) {
    return (
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>
                {mode === "selected" && `${index + 1}. `}
                {connection.name_station_from} - {connection.name_station_to}
            </span>

            {mode === "available" ? (
                <Button
                    size="sm"
                    variant="primary"
                    disabled={selected}
                    onClick={() => onSelect(connection)}
                    style={{ backgroundColor: "#1A2A3A", borderColor: "#1A2A3A" }}
                >
                    Select
                </Button>
            ) : (
                <div className="d-flex gap-1">
                    <Button
                        size="sm"
                        variant="outline-secondary"
                        disabled={index === 0}
                        onClick={() => onMoveUp(index)}
                    >
                        <ArrowUp />
                    </Button>

                    <Button
                        size="sm"
                        variant="outline-secondary"
                        disabled={index === total - 1}
                        onClick={() => onMoveDown(index)}
                    >
                        <ArrowDown />
                    </Button>

                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onRemove(connection.id)}
                    >
                        <Trash />
                    </Button>
                </div>
            )}
        </ListGroup.Item>
    );
}

function PathSelection({ connections = [], selectedConnections, setSelectedConnections}) {

    const navigate = useNavigate();

    const handleSubmit = async () => {
        navigate("/results", { replace: true }); // avoid to go back to the game page
};

    const addConnection = (connection) => {
        if (selectedConnections.some(c => c.id === connection.id)) {
            return;
        }

        setSelectedConnections(prev => [...prev, connection]);
    };

    const removeConnection = (connectionId) => {
        setSelectedConnections(prev =>
            prev.filter(c => c.id !== connectionId)
        );
    };

    const moveUp = (index) => {
        if (index === 0) return;

        const updated = [...selectedConnections];

        [updated[index - 1], updated[index]] =
            [updated[index], updated[index - 1]];

        setSelectedConnections(updated);
    };

    const moveDown = (index) => {
        if (index === selectedConnections.length - 1) return;

        const updated = [...selectedConnections];

        [updated[index], updated[index + 1]] =
            [updated[index + 1], updated[index]];

        setSelectedConnections(updated);
    };

    return (
        <Row>
            <Col md={6}>
                <Card>
                    <Card.Header
                    style={{
                        backgroundColor: "#fffacd",
                        borderBottom: "5px solid #1A2A3A",
                        color: "#1A2A3A"
                    }}
                    >
                    <h4 className="mb-0">Segments</h4>
                </Card.Header>

                    <ListGroup variant="flush">
                        {connections.map(connection => (
                            <ConnectionItem
                                key={connection.id}
                                connection={connection}
                                mode="available"
                                selected={selectedConnections.some(
                                    c => c.id === connection.id
                                )}
                                onSelect={addConnection}
                            />
                        ))}
                    </ListGroup>
                </Card>
            </Col>

            <Col md={6}>
            <Card>
                <Card.Header
                    style={{
                        backgroundColor: "#fffacd",
                        borderBottom: "5px solid #1A2A3A",
                        color: "#1A2A3A"
                    }}
                    >
                    <h4 className="mb-0">Selected Segments</h4>
                </Card.Header>

                <ListGroup variant="flush">
                    {selectedConnections.length === 0 && (
                        <ListGroup.Item>
                            No segments selected.
                        </ListGroup.Item>
                    )}

                    {selectedConnections.map((connection, index) => (
                        <ConnectionItem
                            key={connection.id}
                            connection={connection}
                            mode="selected"
                            index={index}
                            total={selectedConnections.length}
                            onRemove={removeConnection}
                            onMoveUp={moveUp}
                            onMoveDown={moveDown}
                        />
                    ))}
                </ListGroup>

                <Card.Body className="d-flex justify-content-end" style={{ backgroundColor: "#fffacd", borderTop: "5px solid #1A2A3A", }}>
                    <Button variant="success" onClick={handleSubmit} style={{ backgroundColor: "#1A2A3A", borderColor: "#1A2A3A" }}>
                        Submit
                    </Button>
                </Card.Body>
            </Card>
        </Col>
        </Row>
    );
}



export default GameDisplay;