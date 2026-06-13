import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import { LoginForm, Logout } from './components/LoginForm.jsx';
import NetworkDisplay  from './components/Network.jsx';
import GameDashboard from './components/Path.jsx';
import ResultDisplay from './components/Results.jsx';
import RankingDisplay from './components/RankingDisplay.jsx';
import Footer from './components/Footer.jsx';
import InfoDisplay from './components/InfoDisplay.jsx';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';
import { getStations, getConnections, endGame } from "./api/api.js";
import backgroundImage from './background.jpg';

import UserContext from './contexts/UserContext.js';
import { checkSession } from './api/auth.js';

function App() {

  const navigate = useNavigate()

  // Currently logged-in user
  const [user, setUser] = useState({ id: undefined, email: undefined, name: undefined })

  // try to restore the login session
  useEffect(() => {
    checkSession().then(result => {
      if (result) {
        setUser({ id: result.id, email: result.username, name: result.name })
      }
    })
  }, [])

  // Login action handler
  const doLogin = (newUser) => {
    setUser({ id: newUser.id, email: newUser.username, name: newUser.name })
    navigate('/home')
  }

  const [stations, setStations] = useState([]);
  const [connections, setConnections] = useState([]);

    useEffect(() => {
        getStations()
            .then(setStations)
            .catch(console.error);

        getConnections()
            .then(setConnections)
            .catch(console.error);
    }, []);

  const [selectedConnections, setSelectedConnections] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [expandedSidebar, setExpandedSidebar] = useState(false);

    
  


  return (
    <UserContext.Provider value={user}>
        <Routes>
          <Route path='/' element={<MainLayout doLogin={doLogin} expandedSidebar={expandedSidebar} setExpandedSidebar={setExpandedSidebar} />}>
            <Route index element={<InfoDisplay />} />
            <Route path='home' element={<HomeLayout stations={stations} connections={connections} />} />
            <Route path='login' element={<LoginForm doLogin={doLogin} />} />
            <Route path='logout' element={<Logout doLogin={doLogin} />} />
            <Route path='results' element={<ResultDisplay selectedConnections={selectedConnections} gameId={gameId} />} />
            <Route path='ranking' element={<RankingDisplay />} />
            <Route path='error' element={<h1>"Something is Wrong"</h1>} />
          </Route>
          <Route path='/game' element={<GameLayout stations={stations} connections={connections} selectedConnections={selectedConnections} setSelectedConnections={setSelectedConnections} gameId={gameId} setGameId={setGameId} />} />
        </Routes>
    </UserContext.Provider>
  )

}

function MainLayout(props) {
  return (
    <>
    <div
      style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "repeat",
          backgroundSize: "150px"
      }}>
   
      <Header doLogin={props.doLogin} />
      <Sidebar expanded={props.expandedSidebar} setExpanded={props.setExpandedSidebar} />
      <Container>
        <div
          style={{
            paddingTop: "56px", // altezza header
            marginLeft: props.expandedSidebar ? "200px" : "56px", // larghezza sidebar
            minHeight: "100vh",
            paddingBottom: "56px", // altezza footer
          
          }}
        >
          <Outlet />
        </div>
        </Container>
        
      
      <Footer />
   
    </div>
    </>
  );
}

function HomeLayout(props) {
  return <>
    <NetworkDisplay stations={props.stations} connections={props.connections} />
    <NewGameButton />

  </>
}

function GameLayout(props) {
  return (
    <>    
    <Container>
      <div className="mb-3">
        <NetworkDisplay stations={props.stations} />
      </div>

      <GameDashboard
        connections={props.connections}
        selectedConnections={props.selectedConnections}
        setSelectedConnections={props.setSelectedConnections}
        gameId={props.gameId}
        setGameId={props.setGameId}
      />
      
    </Container>

    <div className="mt-3">
      <Footer />
    </div>
    
    </>
  );
}

function NewGameButton(props) {
  const navigate = useNavigate()

  return (
    <div className="d-flex justify-content-center mt-4">
      <Button onClick={() => navigate('/game')}  style={{ backgroundColor: "#1A2A3A", borderColor: "#1A2A3A" }}>Play Game</Button>
    </div>

  ) 
}


function InfoView() {

  
  return "Info about the game, visible also by unlogged users"
}

export default App