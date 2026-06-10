import { useEffect, useState } from "react";
import { Row, Col, Card, ListGroup, Button,Spinner, Alert, Stack } from "react-bootstrap";
import { ArrowUp, ArrowDown, Trash } from "react-bootstrap-icons";
import { useNavigate } from 'react-router';
import { newGame, endGame } from "../api/api.js";


function GameDashboard({ connections = [],  results, setResults }) {
    const [gameInfo, setGameInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedConnections, setSelectedConnections] = useState([]);
    const [timeLeft, setTimeLeft] = useState(90);
    const [expired, setExpired] = useState(false);

    const navigate = useNavigate();    

    
    const handleAutoSubmit = async () => {
        const connections_id = selectedConnections.map(c => c.id);
       

        const requestBody = {
            game_id: gameInfo.game_id,
            selected_connections: connections_id
        };

        const result = await endGame(requestBody);
        setResults(result);

        
    };

    useEffect(() => {
        const loadGame = async () => {
            try {
                const game = await newGame();

                setGameInfo(game);
            } catch (err) {
                setError("Unable to start a new game.");
            } finally {
                setLoading(false);
            }
        };

        loadGame();
    }, []);

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

    useEffect(() => {
        if (!expired) return;
        
        handleAutoSubmit();
        const timeout = setTimeout(() => {
            navigate("/results", { replace: true });
        }, 5000);

        return () => clearTimeout(timeout);
    }, [expired]);

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }


    
    if (expired) {
        return (
            <Alert variant="danger" className="text-center">
                ⏱ Time's up! Submitting your path...
            </Alert>
        );
    }
    return (
        <>
            <Card className="mb-4">
                <Card.Header>Game Information</Card.Header>

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
                                ⏱ Time left: {timeLeft}s
                            </Alert>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <PathSelection connections={connections} selectedConnections={selectedConnections} setSelectedConnections={setSelectedConnections} gameId={gameInfo.game_id} setResults={setResults} />
        </>
    );
}




function ConnectionItem({
    connection,
    selected,
    index,
    total,
    mode,
    onSelect,
    onRemove,
    onMoveUp,
    onMoveDown
}) {
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

function PathSelection({ connections = [], selectedConnections, setSelectedConnections, gameId, setResults }) {

    const navigate = useNavigate();

    const handleSubmit = async (setResults) => {
    try {
        const connections_id = selectedConnections.map(c => c.id);

        const requestBody = {
            game_id: gameId,
            selected_connections: connections_id
        };

        const result = await endGame(requestBody);

        setResults(result);

        navigate("/results", { replace: true });

    } catch (err) {
        console.error("Error during endGame:", err);
    }
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
                    <Card.Header>
                        Segments
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
                <Card.Header>
                    Selected Path
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

                <Card.Body>
                    <Stack direction="horizontal" gap={2}>
                        <Button variant="success"
                                onClick={() => handleSubmit(setResults)}>
                            Submit
                        </Button>

                        <Button variant="danger">
                            Quit
                        </Button>
                    </Stack>
                </Card.Body>
            </Card>
        </Col>
        </Row>
    );
}



export default GameDashboard;