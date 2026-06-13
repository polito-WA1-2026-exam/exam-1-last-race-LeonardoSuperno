import React, { useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

// React Bootstrap Icons
import { Map, Compass, Coin } from "react-bootstrap-icons";

const InfoDisplay = () => {
  const [section, setSection] = useState("map");

  const sections = {
    map: {
      title: "Map",
      icon: <Map size={22} />,
      content: (
        <p>
          The game takes place on a fictional underground network.
          The map is composed of interconnected stations linked by bidirectional segments.
          The system includes 12 stations, representing the most important Ancient Egyptian locations, connected through 4 distinct lines.
          Among these, there are 6 interchangeable interchange stations, allowing players to switch routes and explore multiple strategic paths across the underground network.
        </p>
      ),
    },
    path: {
      title: "Path Selection",
      icon: <Compass size={22} />,
      content: (
        <p>
          At the beginning of each game, the player is assigned a starting station and a destination station. The objective is to build a valid route connecting the two by selecting segments between connected stations within the underground network.
          Players move step by step through the network, choosing connected stations along the way. Each segment is bidirectional but can only be used once, requiring careful planning and strategic decisions.
          The player has 90 seconds to complete their route. When the timer runs out, the currently selected path is automatically submitted, even if it is incomplete.
        </p>
      ),
    },
    score: {
      title: "Score",
      icon: <Coin size={22} />,
      content: (
        <p>
          The player starts with 20 coins. During the journey, random events may affect the total score, increasing or decreasing it by a value between -4 and +4 coins depending on the outcome of each event.
          If the selected path is not valid, the player receives 0 coins, regardless of the route progress or events encountered.
        </p>
      ),
    },
  };

  return (
    <Container className="my-4">
      <Card
        style={{
          backgroundColor: "#1A2A3A",
          color: "#fff",
          border: "none",
        }}
        className="shadow-lg"
      >
        <Card.Body>
          <h2
            className="text-center mb-4"
            style={{ color: "#edb742", fontWeight: "bold" }}
          >
            Find Your Way Through the Hidden Egyptian Underground
          </h2>

          {/* Navigation */}
          <Row className="mb-4 text-center">
            {Object.entries(sections).map(([key, sec]) => (
              <Col key={key}>
                <Button
                  onClick={() => setSection(key)}
                  style={{
                    width: "100%",
                    border: "2px solid #edb742",
                    backgroundColor:
                      section === key ? "#edb742" : "transparent",
                    color: section === key ? "#1A2A3A" : "#edb742",
                    fontWeight: "bold",
                    padding: "10px",
                  }}
                >
                  <div>{sec.icon}</div>
                  {sec.title}
                </Button>
              </Col>
            ))}
          </Row>

          {/* Content */}
          <Card
            style={{
              backgroundColor: "#243447",
              border: "1px solid #edb742",
            }}
          >
            <Card.Body style={{ color: "#fff" }}>
              <h4 style={{ color: "#edb742" }}>
                {sections[section].icon} {sections[section].title}
              </h4>
              {sections[section].content}
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InfoDisplay;