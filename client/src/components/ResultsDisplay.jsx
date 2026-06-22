import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, Button, Alert, Container, ListGroup, Badge, Spinner } from "react-bootstrap";
import { endGame } from "../api/api.js";


function ResultsDisplay({ selectedConnections, gameId }) {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const loadGame = async () => {
            try {
                const connections_id = selectedConnections.map(c => c.id);

                const requestBody = {
                    game_id: gameId,
                    selected_connections: connections_id
                };

                const result = await endGame(requestBody);
                setResult(result);
                }

            catch (err) {
                navigate("/error", {
                    state: {
                        type: "Unable to obtain game results",
                        message: err.message
                    }}
                )
            } finally {
                setLoading(false);
            }
        };

        loadGame();
    }, []);

    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!result) {
        return (
            <Container className="mt-5 text-center">
                <Alert variant="warning">
                    No result found
                </Alert>
                <Button onClick={() => navigate("/home") } style={{ backgroundColor: "#1A2A3A", borderColor: "#1A2A3A" }}>
                    Back to home
                </Button>
            </Container>
        );
    }

    if (result && result.error) {
        return (
            <Container className="d-flex flex-column align-items-center mt-5">
                <Card style={{ width: "30rem" }} className="shadow-lg">
                
                {/* HEADER */}
                <Card.Header className="text-center  text-white" style={{ backgroundColor: "#1A2A3A", borderBottom: "5px solid #edb742" }}>
                    <h3 className="mb-0">Game Result</h3>
                </Card.Header>

                <Card.Body className="text-center">
                    
                    {/* SCORE */}
                    <h1 className="display-4 text-success">
                        {result.final_score}
                    </h1>
                    <p className="text-muted">Final Score</p>

                    <hr />
                </Card.Body>
                </Card>
                <Card className="shadow-lg mt-4" style={{ width: "60rem" }}>
                    <Card.Body>
                        <Alert variant="danger">
                            <p>{result.error}</p>
                        </Alert>

                        <Button onClick={() => navigate("/home") } style={{ backgroundColor: "#1A2A3A", borderColor: "#1A2A3A" }}>
                            Back
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="d-flex justify-content-center mt-3">
            <Card style={{ width: "28rem", fontSize: "0.9rem" }} className="shadow-lg">
                
                {/* HEADER */}
                <Card.Header className="text-center text-white" style={{ backgroundColor: "#1A2A3A", borderBottom: "5px solid #ebc36d" }}>
                    <h3 className="mb-0">Game Result</h3>
                </Card.Header>

                <Card.Body className="text-center">
                    
                    {/* SCORE */}
                    <h1 className="display-4 text-success">
                        {result.final_score}
                    </h1>
                    <p className="text-muted">Final Score</p>

                    <hr />

                    {/* EVENTS */}
                    <h5>Events applied</h5>

                    {result.events && result.events.length > 0 ? (
                        <ListGroup className="mt-3">
                            {result.events.map((e, idx) => (
                                <ListGroup.Item
                                    key={idx}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <div className="text-start">
                                        <strong>{selectedConnections[idx]?.name_station_from} - {selectedConnections[idx]?.name_station_to}</strong>
                                        <br />
                                        <small className="text-muted">
                                            {e.event.description || "Event"}
                                        </small>
                                    </div>
                                    
                                    <Badge
                                        bg={
                                            e.event.effect > 0
                                            ? "success"
                                            : e.event.effect === 0
                                            ? "secondary"
                                            : "danger"
                                        }
                                        >
                                        {e.event.effect > 0 ? `+${e.event.effect}` : e.event.effect}
                                    </Badge>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p className="text-muted">No events</p>
                    )}
                </Card.Body>

                {/* FOOTER */}
                <Card.Footer className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => navigate("/home") } style={{ backgroundColor: "#ebc36d", borderColor: "#ebc36d", color: "#1A2A3A" }}>
                        Quit
                    </Button>

                    <Button variant="success" onClick={() => navigate("/game") } style={{ backgroundColor: "#1A2A3A", borderColor: "#1A2A3A" }}>
                        Play Again
                    </Button>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default ResultsDisplay;