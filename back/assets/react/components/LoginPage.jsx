import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Login from './Login';
import Header from './NavBar';
import Footer from './Footer';


export default function HomePage() {
    return (<>
            <Header />
            <Login />
            <Footer />
            </>
            );
}
