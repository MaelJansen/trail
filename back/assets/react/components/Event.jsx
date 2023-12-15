import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Accordion, Container, List, Header, Segment, Grid, Label, Statistic, Icon, Transition } from 'semantic-ui-react';
import Race from './Race';


export default function Event(props) {
    const { events } = props;
    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;

        setActiveIndex(newIndex);
    }

    return (
        <Container style={{ marginTop: '1em', marginBottom: '1em' }}>
            {Array.isArray(events) && events.map((event, index) => (
                <div key={index}>
                        <Accordion styled fluid style={{ marginBottom: '2em'}}>
                            <Accordion.Title
                                active={activeIndex === index}
                                index={index}
                                onClick={handleClick}
                            >
                                <Header as='h1'><Link to={`/event/${event.id}`}>{event.Name}</Link></Header>
                                <Label as='a' color='orange' icon='users' ribbon='right'></Label>
                                <Label.Group size='large'>
                                    <Label><Icon name='calendar'/>{event.StartDate} - {event.EndDate}</Label>
                                    <Label><Icon name='marker'/>{event.Address}</Label>
                                    
                                </Label.Group>
                                

                                <Icon name='dropdown' />
                            </Accordion.Title>
                            
                            <Transition visible={activeIndex === index} animation='pulse' duration={250}>
                                <Accordion.Content active={activeIndex === index}>
                                    <Accordion.Content active={activeIndex === index}>
                                        <Race races={event.Race} />
                                    </Accordion.Content>    
                                </Accordion.Content>
                            </Transition>
                        </Accordion>
                </div>
            ))}
        </Container>
    )
}