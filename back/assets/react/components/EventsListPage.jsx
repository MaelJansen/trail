import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Header from './Header';
import Footer from './Footer';
import EventsList from './EventsList';


export default function EventsListPage() {
    return (<>
            <Header />
            <EventsList />
            <Footer />
            </>
            );
}
