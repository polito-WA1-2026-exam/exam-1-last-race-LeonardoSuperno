import { useEffect, useState } from "react";
import { Container, Card, Table, Spinner, Alert, Badge } from "react-bootstrap";
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

                <Card.Header
                    style={{
                        backgroundColor: "#fffacd",
                        borderBottom: "5px solid #1A2A3A",
                        color: "#1A2A3A"
                    }}
                >
                    <h4 className="mb-0">Ranking</h4>
                </Card.Header>

                <Card.Body className="p-0">

                    <Table hover responsive className="mb-0 align-middle">
                        <thead
                            style={{
                                backgroundColor: "#1A2A3A",
                                color: "#fffacd"
                            }}
                        >
                            <tr>
                                <th style={{ width: "80px", textAlign: "center" }}>#</th>
                                <th>Player</th>
                                <th style={{ textAlign: "right", paddingRight: "20px" }}>
                                    Best Score
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {ranking.map((player, index) => {
                                const rank = index + 1;

                                return (
                                    <tr
                                        key={player.name}
                                    >
                                        <td style={{ textAlign: "center" }}>
                                            {rank}
                                        </td>

                                        <td style={{ fontWeight: "500" }}>
                                            {player.name}
                                        </td>

                                        <td style={{ textAlign: "right", paddingRight: "20px" }}>
                                            <Badge  bg="success" style={{ fontSize: "1rem", padding: "0.5em 0.75em" }}
                                            >
                                                {player.best_score}
                                            </Badge>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>

                </Card.Body>
            </Card>
        </Container>
    );
}

export default RankingDisplay;