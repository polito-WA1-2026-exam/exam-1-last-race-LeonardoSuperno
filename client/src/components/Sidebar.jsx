import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { HouseFill, TrophyFill, InfoCircleFill } from "react-bootstrap-icons";
import { useContext } from "react"
import UserContext from "../contexts/UserContext"

function Sidebar() {
    const navigate = useNavigate();
    const user = useContext(UserContext);

    return (
        <Navbar
            className="d-flex flex-column align-items-center py-3"
            style={{
                width: "70px",
                height: "calc(100vh - 56px)",
                position: "fixed",
                left: 0,
                top: "56px",
                backgroundColor: "#ebc36d"
            }}
        >
            <Nav className="flex-column text-center gap-4">

                <HouseFill
                    size={24}
                    color="#1A2A3A"
                    style={{ cursor: "pointer" }}
                    onClick={() => user.id ? navigate('/home') : navigate('/login')}
                />

                <TrophyFill
                    size={24}
                    color="#1A2A3A"
                    style={{ cursor: "pointer" }}
                    onClick={() => user.id ? navigate('/ranking') : navigate('/login')}
                />

                <InfoCircleFill
                    size={24}
                    color="#1A2A3A"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate('/')}
                />

            </Nav>
        </Navbar>
    );
}


export default Sidebar;