import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Accordion, Container, List, Header, Segment, Grid, Label, Statistic, Icon, Dropdown } from 'semantic-ui-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Event from './Event';


export default function EventsList() {

    const [events, setEvents] = useState([]);

    useEffect( () => {
        axios
          .get("http://localhost:8000/api/eventsCond",{
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
      
      const DropdownComponent = ({ onSelect }) => {
        const [selectedValue, setSelectedValue] = useState(null);
      
        const eventList = [];
        events.forEach(element => {
          eventList.push({
            key: element['Name'],
            text: element['Name'],
            value: element['Name'],
          });
        });
      
        const handleDropdownChange = (event, data) => {
          const selectedEvent = data.value;
          setSelectedValue(selectedEvent);
          onSelect(selectedEvent); // Appel de la fonction onSelect de la classe parente
        };
      
        return (
          <Dropdown
            placeholder='Evenements'
            fluid
            selection
            options={eventList}
            onChange={handleDropdownChange}
            value={selectedValue}
          />
        );
      };
      
    /*const eventList = []
    events.forEach(element => {
      eventList.push({
        key: element['Name'],
        text: element['Name'],
        value: element['Name'],
      });
      console.log(eventList);
    });*/

    /*return (
      <Dropdown placeholder='Evenements' fluid selection options={eventList} />
    );*/
}
