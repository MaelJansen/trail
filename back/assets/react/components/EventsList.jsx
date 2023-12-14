import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Accordion, Container, List, Header, Segment, Grid, Label, Statistic, Icon, Loader } from 'semantic-ui-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Event from './Event';


export default function EventsList() {

    const [events, setEvents] = useState([]);

    useEffect( () => {
        axios
          .get("http://localhost:8000/api/events",{
            method: 'GET'
          })
    
          .then((response) => {
            setEvents(response.data)
          })
          .catch((error) => {
            console.log(error)
          })
      }, [])

      if (events.length === 0) {
        return (
        <Container style={{ marginTop: '5em', marginBottom: '5em' }}>
          <Accordion styled fluid style={{ padding: '2em' }}>
            <Loader active inline='centered' />
          </Accordion>
        </Container>
        )
    }
    return (
        <Event events={events} />
    );
}
