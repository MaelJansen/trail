import React, { useState } from "react";
import { Link } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import {
  Accordion,
  Container,
  List,
  Header,
  Segment,
  Grid,
  Label,
  Statistic,
  Icon,
  Transition,
} from "semantic-ui-react";

export default function Race(props) {
  return (
    <List>
      {Array.isArray(props.races) &&
        props.races.map((race, raceIndex) => (
          <Segment key={raceIndex}>
            <List.Item>
              <Grid columns={2}>
                <Grid.Column>
                  <Grid.Row>
                    <List.Header as="h3">
                      <Link to={`/race/${race.id}`}>{race.Name}</Link>
                    </List.Header>
                  </Grid.Row>
                  <Grid.Row>
                    <Label.Group>
                      <Label>2020</Label>
                      <Label>{race.Address}</Label>
                    </Label.Group>
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column textAlign="center">
                  <Grid.Row verticalAlign="middle">
                    <Statistic
                      margin="1em 0"
                      size="mini"
                      label="Distance"
                      value={`${race.Distance} km`}
                    />
                    <Statistic
                      size="mini"
                      label="Dénivelé Positif"
                      value={`${race.PositiveDifference} m`}
                    />
                    <Statistic
                      size="mini"
                      label="Dénivelé Négatif"
                      value={`${race.NegativeDifference} m`}
                    />
                  </Grid.Row>
                </Grid.Column>
              </Grid>
            </List.Item>
          </Segment>
        ))}
    </List>
  );
}
