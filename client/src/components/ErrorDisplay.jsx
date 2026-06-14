import { useLocation } from "react-router";
import { Card, Container } from "react-bootstrap";

function ErrorDisplay() {
    const location = useLocation();
    const errorState = location.state;

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
        >
            <Card
                className="shadow"
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    border: "none",
                }}
            >
                <Card.Header
                    style={{
                        backgroundColor: "#1A2A3A",
                        color: "white",
                        fontWeight: "bold",
                    }}
                >
                    Error
                </Card.Header>

                <Card.Body>
                    <Card.Title>An unexpected error occurred</Card.Title>

                    <Card.Text>
                        <strong>Type:</strong>{" "}
                        {errorState?.type || "Unknown Error"}
                    </Card.Text>

                    <Card.Text>
                        <strong>Message:</strong>{" "}
                        {errorState?.message || "No details available"}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ErrorDisplay;