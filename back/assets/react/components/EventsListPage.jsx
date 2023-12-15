import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Header from './NavBar';
import Footer from './Footer';
import EventsList from './EventsList';
import SecondaryNavBar from './SecondaryNavBar';


export default function EventsListPage() {
    return (<>
            <Header />
            <SecondaryNavBar title="Liste des évènements"/>
            <EventsList />
            <Footer />
            </>
            );
}
