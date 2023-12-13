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
                <Grid columns={3} relaxed='very' divided>
                    <Grid.Column>
                        <Header as='h2' color='black' inverted textAlign='center'>
                            Events
                        </Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Button.Group>
                            <Button>List</Button>
                            <Button>Map</Button>
                        </Button.Group>
                    </Grid.Column>
                    <Grid.Column>
                    </Grid.Column>
                </Grid>
            </Segment>
        </div>
    );
}


