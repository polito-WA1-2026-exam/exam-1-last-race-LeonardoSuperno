import { useEffect, useState } from "react";
import { Container, Card, Table, Spinner, Alert } from "react-bootstrap";
import { getRanking } from "../api/api.js";

function RankingDisplay() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadRanking = async () => {
            try {
                const data = await getRanking();
                setRanking(data);
            } catch (err) {
                setError("Unable to load ranking");
            } finally {
                setLoading(false);
            }
        };

        loadRanking();
    }, []);

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card className="shadow">
                <Card.Header>
                    <h3 className="mb-0">Ranking</h3>
                </Card.Header>

                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Player</th>
                                <th>Best Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ranking.map((player, index) => (
                                <tr key={player.name}>
                                    <td>{index + 1}</td>
                                    <td>{player.name}</td>
                                    <td>{player.best_score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default RankingDisplay;