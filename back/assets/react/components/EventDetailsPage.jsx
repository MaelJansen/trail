import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Header from './NavBar';
import Footer from './Footer';
import SecondaryNavBar from './SecondaryNavBar';
import EventDetails from './EventDetails';


export default function EventsListPage() {
    return (<>
            <Header />
            <SecondaryNavBar />
            <EventDetails />
            <Footer />
            </>
            );
}
