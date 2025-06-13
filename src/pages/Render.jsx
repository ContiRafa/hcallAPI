import React from 'react';
import Home from '../components/home/Home'
import Users from '../components/users/Users'
import Tickets from '../components/tickets/Tickets'

const Render = ({ component, onEditUser, userId }) => {
    switch (component) {
        case 'home':
            return <Home />
        case 'tickets':
            return <Tickets />
        case 'users':
            return <Users onEditUser={onEditUser} />
        case 'account':
        default:
            return <Home />
    }
}

export default Render
