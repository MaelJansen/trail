import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { Accordion, Container, Grid, Label, Placeholder, Loader, List, Icon, Button } from 'semantic-ui-react';
import Race from './Race';
import ModalLinkRaceEvent from './ModalLinkRaceEvent';
import ModalDeleteEvent from './ModalDeleteEvent';
import ModalModifyEvent from "./ModalModifyEvent";
import ModalAddRaceToEvent from "./ModalAddRaceToEvent";



export default function EventDetails() {
    const { eventId } = useParams();
    const [roles, setRoles] = useState([]);
    const [event, setEvent] = useState(null);
    const [auto, setAuto] = useState(false);
    const [token] = useState({ token: localStorage.getItem("token") });

    const fetchData = () => {
        let serverQuery = `http://localhost:8000/api/role`;
        axios
          .post(serverQuery, token)
    
          .then((response) => {
            setRoles(response.data.role);
            checkAuthorization(response.data.role);
          })
          .catch((error) => {
            console.log(error);
          });
      };

    useEffect(() => {
        axios.get(`http://localhost:8000/api/event/${eventId}`)
            .then((response) => {
                setEvent(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
  
    useEffect(() => {
      fetchData();
    }, []);
  
  
    const checkAuthorization = (data) => {
      data.forEach((element) => {
        console.log(element);
        if (element == "ROLE_ADMIN" || element == "ROLE_ORGANIZER") {
          setAuto(true);
        }
      });
    };


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
                                {auto && (
                                <div>
                                    <ModalModifyEvent eventId={eventId}  eventName={event.Name} eventStartingDate={event.StartDate} eventEndDate={event.EndDate} eventAddress={event.Address}  />
                                    <ModalDeleteEvent eventId={eventId} />
                                </div>
                                
                                )}
                                <List>
                                    <List.Item>
                                        <Label><Icon name='calendar'/>{event.StartDate}</Label>
                                    </List.Item>
                                    <List.Item>
                                        <Label><Icon name='calendar'/>{event.EndDate}</Label>
                                    </List.Item>
                                    <List.Item>
                                        <Label><Icon name='marker'/>{event.Address}</Label>
                                    </List.Item>
                                </List>
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
                        {auto && (<ModalAddRaceToEvent eventId={eventId} eventName={event.Name}/>)}
                    </Accordion.Content>
                </Accordion>
            </div>
        </Container>
    );
}
