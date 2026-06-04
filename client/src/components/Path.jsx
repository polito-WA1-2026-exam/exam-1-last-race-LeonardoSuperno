import { useState } from "react";
import { Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { ArrowUp, ArrowDown, Trash } from "react-bootstrap-icons";

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

function PathSelection({ connections = [] }) {
    const [selectedConnections, setSelectedConnections] = useState([]);

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
                </Card>
            </Col>
        </Row>
    );
}

export default PathSelection;