import React from "react";
import "semantic-ui-css/semantic.min.css";
import {
  Accordion,
  Container,
  List,
  Grid,
  Menu,
  Label,
  Header,
  Button,
  Modal,
  Segment,
  Form,
} from "semantic-ui-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ModalNewRace from "./ModalNewRace";
import ModalNewEvent from "./ModalNewEvent";
import axios from "axios";

export default function SecondaryNavBar() {
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState({ token: localStorage.getItem("token") });
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    let serverQuery = `http://localhost:8000/api/role`;
    axios
      .post(serverQuery, token)

      .then((response) => {
        setRoles(response.data.role);
        checkAuthorization(response.data.role);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkAuthorization = (data) => {
    data.forEach((element) => {
      console.log(element);
      if (element == "ROLE_ADMIN" || element == "ROLE_ORGANIZER") {
        setAuto(true);
      }
    });
  };

  return (
    <Segment color="yellow" inverted style={{ marginTop: "3em" }}>
      <Grid columns={3} relaxed="very">
        <Grid.Column>
          <Header as="h2" color="black" inverted textAlign="center">
            Events
          </Header>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Button.Group>
            <Button active attached="left" inverted color="orange">
              List
            </Button>
            <Button
              attached="right"
              style={{ backgroundColor: "white", color: "black" }}
            >
              Map
            </Button>
          </Button.Group>
        </Grid.Column>
        {auto && (
          <Grid.Column textAlign="center">
            <ModalNewRace />
            <Button
              icon="linkify"
              content="Link"
              style={{ backgroundColor: "white", color: "black" }}
            ></Button>
            <ModalNewEvent />
          </Grid.Column>
        )}
      </Grid>
    </Segment>
  );
}
