import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Accordion, Container, List, Header, Segment, Grid, Label, Statistic, Icon } from 'semantic-ui-react';



export default function Event(props){
    const { events } = props;
    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
    
        setActiveIndex(newIndex);
    }    

    return (
    <Container style={{ marginTop: '5em', marginBottom: '5em' }}>
        {Array.isArray(events) && events.map((event, index) => (
            <div key={index}>
                <Accordion styled fluid style={{ marginBottom: '2em' }}>
                        <Accordion.Title
                            active={activeIndex === index}
                            index={index}
                            onClick={handleClick}
                        >
                            <h1>{event.Name}</h1>
                            <Label.Group size='large'>
                                <Label>{event.StartDate}</Label>
                                <Label>{event.EndDate}</Label>
                                <Label>{event.Address}</Label>
                            </Label.Group>
                            
                        <Icon name='dropdown' />
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === index}>
                            <Accordion.Content active={activeIndex === index}>
                                <List>
                                    {Array.isArray(event.Race) && event.Race.map((race, raceIndex) => (
                                        <Segment>
                                            <List.Item key={raceIndex}>
                                                <Grid columns={2} divided>  
                                                    <Grid.Column>
                                                        <Grid.Row>
                                                            <List.Header as='h3'>{race.Name}</List.Header>
                                                        </Grid.Row>
                                                        <Grid.Row >
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
                        </Accordion.Content>
                </Accordion>
            </div>
        ))}
    </Container>
    )
}