import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "semantic-ui-css/semantic.min.css"
import { Button, Form, Grid, Header, Image, Segment } from "semantic-ui-react"

const LoginForm = () => {
  const navigate = useNavigate();
  
  const [inputs, setInputs] = useState({username: "", password: ""});
  const [data, setData] = useState({});

  if(localStorage.getItem("userId")){
    navigate("/");
  }
  
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    getToken();
  }

  useEffect(() =>{
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      navigate('/');
    } else {
      return;
    } 
  }, [data])

  function getToken() {
    let serverQuery = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/login`;
    axios
    .post(serverQuery, inputs)
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      setData({
        "error": error.response.status
      })
    })
  }

  return (
    <Grid textAlign="center" style={{ height: "90vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2"  color="yellow" textAlign="center">
          Log-in to your account
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="User name"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button color="yellow" fluid size="large" type="submit">
              Login
            </Button>
          </Segment>
        </Form>
        <a href="Register">Pas encore de compte ?</a>
      </Grid.Column>
    </Grid>
  )
}

export default LoginForm
