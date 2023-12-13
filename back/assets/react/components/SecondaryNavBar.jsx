import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Accordion, Container, List, Grid, Segment, Label, Header, Button } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function SecondaryNavBar() {
    // this is the secondary nav bar that will be displayed just under the header 
    // the header css is as such :
    //.header {
    //    color: black;
    //    display: flex;
    //    width: 100%;
    //    flex-direction: column;
    //}

    //now i wanna write secondary nav bar component with semantic ui
    

    return (
        <div>
            <Segment color='yellow' inverted>
                <Grid columns={3} relaxed='very'>
                    <Grid.Column>
                        <Header as='h2' color='black' inverted textAlign='center'>
                            Events
                        </Header>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <Button.Group>
                            <Button active attached='left' inverted color='orange'>List</Button>
                            <Button attached='right' style={{backgroundColor: 'white', color: 'black'}}>Map</Button>
                        </Button.Group>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <Button icon='plus' color='green' content='Race'></Button>
                        <Button icon='linkify' content='Link' style={{backgroundColor: 'white', color: 'black'}}></Button>
                        <Button icon='plus' color='green' content='Event'></Button>
                    </Grid.Column>
                </Grid>
            </Segment>
        </div>
    );
}


