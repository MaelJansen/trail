import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Accordion, Container, List, Header, Segment, Grid, Label, Statistic } from 'semantic-ui-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function EventsList() {

    const [events, setEvents] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const searchEvents = async () => {
        // Placeholder data
        const placeholderData = [
            { 
                id: 1, 
                name: 'Event 1', 
                startingDate: '2021-01-01', 
                endingDate: '2021-01-02', 
                localisation : 'Paris',
                races: [
                    { name: 'Race 1', place: 'Place 1', date: '2021-01-01', positiveHeightDiff: 100, negativeHeightDiff: 50, distance:16.5 },
                    { name: 'Race 2', place: 'Place 2', date: '2021-01-02', positiveHeightDiff: 200, negativeHeightDiff: 100, distance:22.9 },
                ]
            },
            { 
                id: 2, 
                name: 'Event 2', 
                startingDate: '2021-02-01', 
                endingDate: '2021-02-02', 
                localisation : 'Lyon',
                races: [
                    { name: 'Race 3', place: 'Place 3', date: '2021-02-01', positiveHeightDiff: 150, negativeHeightDiff: 75, distance:11.2 },
                    { name: 'Race 4', place: 'Place 4', date: '2021-02-02', positiveHeightDiff: 180, negativeHeightDiff: 90, distance:14 },
                ]
            },
            // Add more events with races as needed
        ];

        setEvents(placeholderData);
    }

    useEffect(() => {
        searchEvents();
    }, []);    

    const handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
    
        setActiveIndex(newIndex);
    }

    return (
        <Container style={{ marginTop: '5em', marginBottom: '5em' }}>
            <Accordion styled fluid>
                {events.map((event, index) => (
                    <div key={index}>
                        <Accordion.Title
                            active={activeIndex === index}
                            index={index}
                            onClick={handleClick}
                        >
                            <h1>{event.name}</h1>
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === index}>
                            <p>{event.description}</p>
                            
                            <Accordion.Content active={activeIndex === index}>
                                <List>
                                    {event.races.map((race, raceIndex) => (
                                        <Segment>
                                            <List.Item key={raceIndex}>
                                                <Grid columns={2} divided>  
                                                    <Grid.Column>
                                                        <Grid.Row>
                                                            <List.Header as='h3'>{race.name}</List.Header>
                                                        </Grid.Row>
                                                        <Grid.Row >
                                                            <Label.Group>
                                                                <Label>{race.date}</Label>
                                                                <Label>{race.place}</Label>
                                                            </Label.Group>
                                                        </Grid.Row>
                                                    </Grid.Column>
                                                    <Grid.Column verticalAlign='middle' textAlign='center'>
                                                        <Grid.Row>   
                                                            <Statistic size='mini'>
                                                                <Statistic.Value>{race.distance} km</Statistic.Value>
                                                                <Statistic.Label >Distance</Statistic.Label>
                                                            </Statistic>
                                                            <Statistic size='mini' label='Dénivelé Positif' value={`${race.positiveHeightDiff} m`} />
                                                            <Statistic size='mini' label='Dénivelé Négatif' value={`${race.negativeHeightDiff} m`} />
                                                        </Grid.Row>
                                                    </Grid.Column>
                                                </Grid>
                                            </List.Item>
                                        </Segment>
                                    ))}
                                </List>
                            </Accordion.Content>
                        </Accordion.Content>
                    </div>
                ))}
            </Accordion>
        </Container>
    );
}
