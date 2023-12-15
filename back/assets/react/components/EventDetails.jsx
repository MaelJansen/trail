import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Accordion, Container, List, Header, Segment, Grid, Label, Statistic, Icon, Placeholder, Loader } from 'semantic-ui-react';
import Race from './Race';


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
        return <Container style={{ marginTop: '5em', marginBottom: '5em' }}>
                    <Accordion styled fluid style={{ padding: '2em' }}>
                        <Loader active inline='centered' />
                    </Accordion>
                </Container>
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
                        <Race races={event.Race} />
                    </Accordion.Content>
                </Accordion>
            </div>
        </Container>
    );
}
