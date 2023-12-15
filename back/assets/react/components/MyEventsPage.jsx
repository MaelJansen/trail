import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Header from './NavBar';
import Footer from './Footer';
import SecondaryNavBar from './SecondaryNavBar';
import MyEvents from './MyEvents';


export default function MyEventsPage() {
    return (<>
            <Header />
            <SecondaryNavBar title="Liste de mes évènements"/>
            <MyEvents />
            <Footer />
            </>
            );
}
