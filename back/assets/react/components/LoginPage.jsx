import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Connexion from './Connexion';
import Header from './NavBar';
import Footer from './Footer';


export default function HomePage() {
    return (<>
            <Header />
            <Connexion />
            <Footer />
            </>
            );
}
