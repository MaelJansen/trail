import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Button, Form, Grid, Segment } from "semantic-ui-react";

const LoginForm = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [data, setData] = useState({});
  const [message, setMessage] = useState(false);

  if (localStorage.getItem("userId")) {
    navigate("/");
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    getToken();
  };

  useEffect(() => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      navigate("/");
    } else {
      return;
    }
  }, [data]);

  function getToken() {
    let serverQuery = `http://localhost:8000/api/login`;
    axios
      .post(serverQuery, inputs)
      .then((response) => {
        setMessage(false);
        setData(response.data);
      })
      .catch((error) => {
        setMessage(true);
        setData({
          error: error.response.status,
        });
      });
  }

  return (
    <Grid textAlign="center" style={{ height: "90vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              type="email"
              name="email"
              id="email"
              value={inputs.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <Form.Input
              type="password"
              name="password"
              id="password"
              value={inputs.password}
              onChange={handleChange}
              placeholder="Mot de passe"
              required
            />
            <Button color="yellow" fluid size="large" type="submit">
              Login
            </Button>
          </Segment>
        </Form>
        {message && (
          <p style={{ color: "red" }}>
            Mauvais nom d'utilisateur ou mauvais mot de passse
          </p>
        )}
        <a href="Register">Pas encore de compte ?</a>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
