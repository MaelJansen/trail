import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Accordion, Container, List, Header, Segment, Grid, Label, Statistic, Icon, Placeholder, Loader } from 'semantic-ui-react';

export default function RaceDetails(props) {
    const { raceId } = useParams();
    const [race, setRace] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/race/${raceId}`)
            .then((response) => {
                setRace(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    if (!race) {
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
                    <Segment>
                        <Grid columns={2}>
                            <Grid.Column>
                                <Grid.Row>
                                    <List.Header as='h1'>{race.Name}</List.Header>
                                </Grid.Row>
                                <Grid.Row >
                                    <Label.Group>
                                        <Label>2020</Label>
                                        <Label>{race.Address}</Label>
                                    </Label.Group>
                                    <Statistic margin='1em 0' size='mini' label='Distance' value={`${race.Distance} km`} />
                                    <Statistic size='mini' label='Dénivelé Positif' value={`${race.PositiveDifference} m`} />
                                    <Statistic size='mini' label='Dénivelé Négatif' value={`${race.NegativeDifference} m`} />
                                </Grid.Row>
                            </Grid.Column>
                            <Grid.Column textAlign='center'>
                                <Placeholder fluid>
                                    <Placeholder.Image />
                                </Placeholder>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Accordion>
            </div>
        </Container>
    );
}
