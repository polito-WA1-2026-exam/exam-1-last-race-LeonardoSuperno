import { useState, useEffect } from "react"
import { doLoginAPI, doLogoutAPI } from "../api/auth.js"
import { useNavigate } from "react-router"
import { Form, Button, Container, Card } from "react-bootstrap"
import { PersonCircle } from "react-bootstrap-icons"

function LoginForm(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errormsg, setErrormsg] = useState('')

  const validate = () => {
    if (!username || !password) {
      return "Email and password are required"
    }


    return null
  }

  const doSubmit = async (ev) => {
    ev.preventDefault()
    setErrormsg('')

    const error = validate()
    if (error) {
      setErrormsg(error)
      setTimeout(() => setErrormsg(''), 3000)
      return
    }

    try {
      const user = await doLoginAPI(username, password)
      props.doLogin(user)
    } catch (ex) {
      setErrormsg(ex.message)
      setTimeout(() => setErrormsg(''), 3000)
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      
    >
      <Container className="d-flex justify-content-center">
        <Card
          className="p-4 shadow-lg border-0"
          style={{
            width: "360px",
            backgroundColor: "#edb742" ,
            borderBottom: "5px solid #1A2A3A"
          }}
        >
            <h2 className="text-center mb-4" style={{ color: "#1A2A3A" }}>
                <PersonCircle size={70} />
            </h2>

          <Form onSubmit={doSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="Enter email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" className="w-100" type="submit" style={{ backgroundColor: "#1A2A3A", borderColor: "#1A2A3A" }}>
               
              Log in
            </Button>

            {errormsg && (
              <div className="text-danger text-center mt-3">
                {errormsg}
              </div>
            )}
          </Form>
        </Card>
      </Container>
    </div>
  )
}


function Logout(props) {
  const navigate = useNavigate()

  useEffect(() => {
    doLogoutAPI().then(() => {
      props.doLogin({ id: undefined, email: undefined, name: undefined })
      navigate('/')
    })
  }, [])

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      Logging out...
    </Container>
  )
}

export { LoginForm, Logout }