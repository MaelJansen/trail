import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Accordion, Container, List, Header, Segment, Grid, Label, Statistic, Icon, Placeholder } from 'semantic-ui-react';



export default function EventDetails(props) {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/event/${eventId}`)
            .then((response) => {
                setEvent(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    if (!event) {
        return <div>Loading...</div>;
    }

    return (
        <Container style={{ marginTop: '5em', marginBottom: '5em' }}>
            <div>
                <Accordion styled fluid style={{ marginBottom: '2em' }}>
                    <Accordion.Title
                        active={true}
                        index={0}
                    >
                        <Grid columns={2}>
                            <Grid.Column>
                                <h1>{event.Name}</h1>
                                <Label.Group size='large'>
                                    <Label>{event.StartDate}</Label>
                                    <Label>{event.EndDate}</Label>
                                    <Label>{event.Address}</Label>
                                </Label.Group>
                            </Grid.Column>
                            <Grid.Column>
                                <Placeholder fluid>
                                    <Placeholder.Image />
                                </Placeholder>
                            </Grid.Column>
                        </Grid>
                    </Accordion.Title>
                    <Accordion.Content active={true}>
                        <List>
                            {Array.isArray(event.Race) && event.Race.map((race, raceIndex) => (
                                <Segment>
                                    <List.Item key={raceIndex}>
                                        <Grid columns={2} divided>
                                            <Grid.Column>
                                                <Grid.Row>
                                                    <List.Header as='h3'>{race.Name}</List.Header>
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Label.Group>
                                                        <Label>2020</Label>
                                                        <Label>{race.Address}</Label>
                                                    </Label.Group>
                                                </Grid.Row>
                                            </Grid.Column>
                                            <Grid.Column verticalAlign='middle' textAlign='center'>
                                                <Grid.Row>
                                                    <Statistic size='mini'>
                                                        <Statistic.Value>{race.Distance} km</Statistic.Value>
                                                        <Statistic.Label >Distance</Statistic.Label>
                                                    </Statistic>
                                                    <Statistic size='mini' label='Dénivelé Positif' value={`${race.PositiveDifference} m`} />
                                                    <Statistic size='mini' label='Dénivelé Négatif' value={`${race.NegativeDifference} m`} />
                                                </Grid.Row>
                                            </Grid.Column>
                                        </Grid>
                                    </List.Item>
                                </Segment>
                            ))}
                        </List>
                    </Accordion.Content>
                </Accordion>
            </div>
        </Container>
    );
}
