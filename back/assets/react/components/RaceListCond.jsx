import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Accordion, Container, List, Header, Segment, Grid, Label, Statistic, Icon, Dropdown } from 'semantic-ui-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Event from './Event';


export default function RaceList() {

    const [races, setEvents] = useState([]);

    useEffect( () => {
        axios
          .get("http://localhost:8000/api/raceCond",{
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
      
    const raceList = []
    races.forEach(element => {
      raceList.push({
        key: element['Name'],
        text: element['Name'],
        value: element['Name'],
      });
    });

    return (
      <Dropdown placeholder='Courses' fluid selection options={raceList} />
    );
}
