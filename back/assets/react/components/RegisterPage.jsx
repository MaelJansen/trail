import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Register from './Register';
import Header from './NavBar';
import Footer from './Footer';


export default function HomePage() {
    return (<>
            <Header />
            <Register />
            <Footer />
            </>
            );
}