import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Grid,  Header, Button, Segment} from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import ModalNewRace from './ModalNewRace';
import ModalNewEvent from './ModalNewEvent';
import ModalLinkRaceEvent from './ModalLinkRaceEvent';
import axios from 'axios';

export default function SecondaryNavBar(props) {

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

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState({ token: localStorage.getItem("token") });
    const [auto, setAuto] = useState(false);
  
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
  
    return (
        <Segment color='yellow' inverted style={{marginTop: '3em'}}>
                <Grid columns={3} relaxed='very'>
                    <Grid.Column>
                        <Header style={{margin: '0'}} as='h2' color='black' inverted textAlign='center'>
                             {props.title}
                        </Header>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <Button.Group>
                            <Button icon='list' href='/events' active inverted color='orange'>Liste</Button>
                            <Button icon='map outline' style={{ backgroundColor: 'white', color: 'black' }}>Carte</Button>
                        </Button.Group>
                    </Grid.Column>
                        {auto && (

                            <Grid.Column textAlign='center'>
                                <ModalNewRace />
                                <ModalLinkRaceEvent />
                                <ModalNewEvent />
                            </Grid.Column>
                            
                        )}
                </Grid>
            </Segment>
    );

}
