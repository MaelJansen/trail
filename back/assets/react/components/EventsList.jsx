import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Accordion, Container, List, Header, Segment, Grid, Label, Statistic, Icon } from 'semantic-ui-react';
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
            console.log(response.data)
            setEvents(response.data)
            for (let i = 0; i < response.data.length; i++) {
              console.log(response.data[i])
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }, [])
    

    return (
        <Event events={events} />
    );
}
