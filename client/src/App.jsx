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
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';
import { getStations, getConnections, endGame } from "./api/api.js";

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

    
    const [results, setResults] = useState(null);


  return (
    <UserContext.Provider value={user}>
      <Container>
        <Routes>
          <Route path='/' element={<MainLayout doLogin={doLogin} />}>
            <Route index element={<InfoView />} />
            <Route path='home' element={<HomeLayout stations={stations} connections={connections} />} />
            <Route path='login' element={<LoginForm doLogin={doLogin} />} />
            <Route path='logout' element={<Logout doLogin={doLogin} />} />
            <Route path='results' element={<ResultDisplay results={results} />} />
            <Route path='ranking' element={<RankingDisplay />} />
            <Route path='error' element={<h1>"Something is Wrong"</h1>} />
          </Route>
          <Route path='/game' element={<GameLayout stations={stations} connections={connections} results={results} setResults={setResults} />} />
        </Routes>
      </Container>
    </UserContext.Provider>
  )

}

function MainLayout(props) {
  return (
    <>
      <Header doLogin={props.doLogin} />
      <Sidebar />

      <div
        style={{
          paddingTop: "56px", // altezza header
          marginLeft: "70px", // larghezza sidebar
          minHeight: "100vh"
        }}
      >
        <Outlet />
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
  return <>
    <NetworkDisplay stations={props.stations}/>
    <GameDashboard connections={props.connections}  results={props.results} setResults={props.setResults}/>

  </>
}

function NewGameButton(props) {
  const navigate = useNavigate()

  return <Button onClick={() => navigate('/game')}>Play Game</Button>
}


function InfoView() {

  
  return "Info about the game, visible also by unlogged users"
}

export default App