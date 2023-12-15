import React from 'react';
import { Link } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import { Button, Header, Icon } from 'semantic-ui-react';
import { useNavigate } from "react-router-dom";
import LoginPage from './LoginPage';
import { Menu, Container, Image, Dropdown } from 'semantic-ui-react'


export default function NavBar() {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }
    return (
        <Menu fixed='top' color='orange'>
            <Container textAlign='left'>
                <Menu.Item color='orange'>MounTrail</Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item><Link to="/events" style={{ textDecoration: 'none', color: 'black' }}>Accueil</Link></Menu.Item>
                    <Menu.Item>
                        {localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined' ?
                            <Button basic onClick={logout}>Logout</Button>
                            :
                            <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>Connexion</Link>
                        }
                        <Icon name='user' style={{marginLeft: '0.5em'}}/>
                    </Menu.Item>
                    <Menu.Item>

                        <Dropdown trigger={<Icon name='bars' />} icon={null}>
                            <Dropdown.Menu>
                                <Dropdown.Item><Link to="/events" style={{ textDecoration: 'none', color: 'black' }}>Accueil</Link></Dropdown.Item>
                                <Dropdown.Item>
                                    {localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined' ?
                                        <Button basic onClick={logout}>Logout</Button>
                                        :
                                        <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>Connexion <Icon name='user' style={{marginLeft: '1em'}}/></Link>
                                    }</Dropdown.Item>

                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </Menu.Menu>
            </Container>
        </Menu>

    )
}
