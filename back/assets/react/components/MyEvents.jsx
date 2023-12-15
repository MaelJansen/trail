import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Accordion, Container, List, Header, Segment, Grid, Label, Statistic, Icon, Loader, Pagination } from 'semantic-ui-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Event from './Event';


export default function MyEvents() {
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/myEvents", {
        method: 'GET',
        params: {
          page: activePage,
          token: localStorage.getItem('token')
        }
      })

      .then((response) => {
        setMyEvents(response.data.events)
        setTotalPages(Math.ceil(response.data.nbPages))
      })
      .catch((error) => {
        console.log(error)
      })
  }, [activePage]);

  if (myEvents.length === 0) {
    return (<div>
      <Header textAlign='center'><div>
      <Pagination
        pointing
        secondary
        activePage={activePage}
        totalPages={totalPages}
        onPageChange={(e, activePage) => setActivePage(activePage.activePage)}
      /></div>
    </Header>
      <Container style={{ marginTop: '1em', marginBottom: '1em' }}>
        <Accordion styled fluid style={{ padding: '2em' }}>
          <Loader active inline='centered' />
        </Accordion>
      </Container>
      <Header textAlign='center' style={{ marginBottom: '1em' }}><div>
      <Pagination
        pointing
        secondary
        activePage={activePage}
        totalPages={totalPages}
        onPageChange={(e, activePage) => setActivePage(activePage.activePage)}
      /></div>
    </Header>
      </div>
    )
  }
  
  return (<div>
    <Header textAlign='center'><div>
      <Pagination
        pointing
        secondary
        activePage={activePage}
        totalPages={totalPages}
        onPageChange={(e, activePage) => setActivePage(activePage.activePage)}
      /></div>
    </Header>
    <Event events={myEvents} />
    <Header textAlign='center' style={{ marginBottom: '1em' }}><div>
      <Pagination
        pointing
        secondary
        activePage={activePage}
        totalPages={totalPages}
        onPageChange={(e, activePage) => setActivePage(activePage.activePage)}
      /></div>
    </Header></div>
  );
}
