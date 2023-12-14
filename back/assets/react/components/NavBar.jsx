import React from 'react';
import {Link}  from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import { Button, Header } from 'semantic-ui-react';
import { useNavigate } from "react-router-dom";
import LoginPage from './LoginPage';
 


export default function NavBar() {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/connexion');
    }
    return (<div class="header">
                <div class="top">
                    <div class="logo">
                        <Header as='h1' color='orange'>MounTrail</Header>
                    </div>
                    <div class="menu">
                        <ul>
                            <li><Link to="/events">Accueil</Link></li>
                            {localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined' ?
                                <li><Button basic onClick={logout}>Logout</Button></li>
                                :
                                <li><Link to="/connexion">Connexion</Link></li>
                            }
                        </ul>
                    </div>
                </div>
            </div>);
}
