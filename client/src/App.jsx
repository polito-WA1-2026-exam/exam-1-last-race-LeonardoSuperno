import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import Header from './components/Header.jsx';
import { LoginForm, Logout } from './components/LoginForm.jsx';
import NetworkDisplay  from './components/Network.jsx';
import PathSelection from './components/Path.jsx';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';
import { getStations, getConnections } from "./api/api.js";

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

  return (
    <UserContext.Provider value={user}>
      <Container>
        <Routes>
          <Route path='/' element={<MainLayout doLogin={doLogin} />}>
            <Route index element={<LoginView />} />
            <Route path='home' element={<HomeLayout stations={stations} connections={connections} />} />
            <Route path='login' element={<LoginForm doLogin={doLogin} />} />
            <Route path='logout' element={<Logout doLogin={doLogin} />} />
            <Route path='game' element={<GameLayout stations={stations} connections={connections} />} />
            <Route path='error' element={<h1>"Something is Wrong"</h1>} />
          </Route>
        </Routes>
      </Container>
    </UserContext.Provider>
  )

}

function MainLayout(props) {
  return <>
    <Header doLogin={props.doLogin}></Header>
    <Outlet />
  </>
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
    <PathSelection stations={props.stations} connections={props.connections}/>
    

  </>
}

function NewGameButton(props) {
  const navigate = useNavigate()

  return <Button onClick={() => navigate('/game')}>Play Game</Button>
}

function LoginView(props) {

  // if user.id is not undefined, navigate to /home
  const user = useContext(UserContext)
  if (user.id)
    return <Navigate to='/home' />

  return "Login View : main welcome page for anonymous users"
}

export default App