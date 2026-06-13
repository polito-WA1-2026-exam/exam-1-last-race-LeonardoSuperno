import { Navbar, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router";
import {
    House,
    HouseFill,
    Trophy,
    TrophyFill,
    InfoCircle,
    InfoCircleFill,
    List
} from "react-bootstrap-icons";
import { useContext, useState } from "react";
import UserContext from "../contexts/UserContext";

function Sidebar({ expanded, setExpanded }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useContext(UserContext);

    

    const menuItems = [
        {
            label: "Home",
            path: "/home",
            icon: <House size={24} />,
            activeIcon: <HouseFill size={24} />,
            onClick: () =>
                user.id ? navigate("/home") : navigate("/login")
        },
        {
            label: "Ranking",
            path: "/ranking",
            icon: <Trophy size={24} />,
            activeIcon: <TrophyFill size={24} />,
            onClick: () =>
                user.id ? navigate("/ranking") : navigate("/login")
        },
        {
            label: "Info",
            path: "/",
            icon: <InfoCircle size={24} />,
            activeIcon: <InfoCircleFill size={24} />,
            onClick: () => navigate("/")
        }
    ];

    return (
        <Navbar
            className="d-flex flex-column py-3"
            style={{
                width: expanded ? "200px" : "56px",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: "56px",
                backgroundColor: "#edb742",
                transition: "width 0.3s ease"
            }}
        >
            <Nav className="flex-column w-100 px-2">

                <div
                    onClick={() => setExpanded(!expanded)}
                    className="d-flex align-items-center mb-2"
                    style={{
                        cursor: "pointer",
                        color: "#1A2A3A",
                        padding: "8px"
                    }}
                >
                    <List size={24} />
                    {expanded && (
                        <span className="ms-3 fw-bold">
                            Menu
                        </span>
                    )}
                </div>

                {menuItems.map((item) => {
                    const active = location.pathname === item.path;

                    return (
                        <OverlayTrigger
                            key={item.label}
                            placement="right"
                            overlay={<Tooltip>{item.label}</Tooltip>}
                        >
                            <div
                                onClick={item.onClick}
                                className="d-flex align-items-center mb-2"
                                style={{
                                    cursor: "pointer",
                                    color: "#1A2A3A",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    backgroundColor: active
                                        ? "rgba(26,42,58,0.15)"
                                        : "transparent",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                {active
                                    ? item.activeIcon
                                    : item.icon}

                                {expanded && (
                                    <span className="ms-3">
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        </OverlayTrigger>
                    );
                })}
            </Nav>
        </Navbar>
    );
}

export default Sidebar;