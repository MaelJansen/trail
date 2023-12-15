import React, { useState } from "react"
import { redirect, useAsyncError, useNavigate } from "react-router-dom"
import "semantic-ui-css/semantic.min.css"
import { Button, Form, Grid, Header, Image, Segment } from "semantic-ui-react"
import { Redirect } from 'react-router-dom'
import NavBar from "./NavBar"

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [Firstname, setFirstname] = useState("")
  const [Lastname, setLastname] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, Firstname, Lastname })
      });
      window.location.href = `/login`;
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Grid textAlign="center" style={{ height: "90vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="orange" textAlign="center">
          Créer un compte
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Prénom"
              onChange={(event) => setFirstname(event.target.value)}
            />
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Nom"
              onChange={(event) => setLastname(event.target.value)}
            />
            <Form.Input
              fluid
              type="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Mot de passe"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </Segment>
          <Button color="yellow" fluid size="large" type="submit">
          Créer
          </Button>
          <p style={{marginTop:'1em'}}>Déjà un compte?</p>
        <a href="login">Connectez-vous!</a>
        </Form>
      </Grid.Column>
    </Grid>
  )
}

export default LoginForm
