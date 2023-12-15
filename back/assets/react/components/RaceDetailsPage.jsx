import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Header from './NavBar';
import Footer from './Footer';
import SecondaryNavBar from './SecondaryNavBar';
import RaceDetails from './RaceDetails';

export default function RaceDetailsPage() {
    return (<>
            <Header />
            <SecondaryNavBar title="Détails de la course"/>
            <RaceDetails />
            <Footer />
            </>
            );
}