import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Accordion, Container, List, Grid, Menu, Label, Header, Button, Modal, Segment, Form } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModalNewRace from './ModalNewRace';
import ModalNewEvent from './ModalNewEvent';




export default function SecondaryNavBar(props) {

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
                    <Grid.Column textAlign='center'>
                        <ModalNewRace />
                        <Button icon='linkify' content='Link' style={{ backgroundColor: 'white', color: 'black' }}></Button>
                        <ModalNewEvent />

                    </Grid.Column>
                </Grid>
            </Segment>
    );
}


