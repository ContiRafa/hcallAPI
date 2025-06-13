import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Titlebar.css';

const Titlebar = ({ userName }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <header className="titlebar">
            <div className="header-items">
                <img src="/imgs/cps-logo.png" alt="Logo" className="logo-img" />
            </div>
            <div className="header-logout">
                <p>Usuário: {userName}</p>
                <button onClick={handleLogout}>Sair</button>
            </div>
        </header>
    );
};

export default Titlebar; 