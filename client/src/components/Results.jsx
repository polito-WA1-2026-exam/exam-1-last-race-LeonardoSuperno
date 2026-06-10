import React from "react";
import { useNavigate } from "react-router";
import { Card, Button, Alert, Container, ListGroup, Badge } from "react-bootstrap";

function ResultsPage({ results }) {
    const navigate = useNavigate();
    const result = results;

    if (!result) {
        return (
            <Container className="mt-5 text-center">
                <Alert variant="warning">
                    No result found
                </Alert>
                <Button onClick={() => navigate("/")}>
                    Back to home
                </Button>
            </Container>
        );
    }

    if (result.error) {
        return (
            <Container className="d-flex flex-column align-items-center mt-5">
                <Card style={{ width: "30rem" }} className="shadow-lg">
                
                {/* HEADER */}
                <Card.Header className="text-center bg-dark text-white">
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
                            <h4>Error</h4>
                            <p>{result.error}</p>
                        </Alert>

                        <Button onClick={() => navigate("/")}>
                            Back
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: "30rem" }} className="shadow-lg">
                
                {/* HEADER */}
                <Card.Header className="text-center bg-dark text-white">
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
                                        <strong>Connection {e.connection_id}</strong>
                                        <br />
                                        <small className="text-muted">
                                            {e.event.description || "Event"}
                                        </small>
                                    </div>

                                    <Badge bg="primary">
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
                    <Button variant="secondary" onClick={() => navigate("/")}>
                        Quit
                    </Button>

                    <Button variant="success" onClick={() => navigate("/game")}>
                        Play Again
                    </Button>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default ResultsPage;