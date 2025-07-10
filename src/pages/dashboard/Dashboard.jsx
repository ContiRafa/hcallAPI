import React from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Render from '../Render'
import Sidebar from '../../components/layout/Sidebar'
import Titlebar from '../../components/layout/Titlebar'
import './Dashboard.css'

function Dashboard() {
    const navigate = useNavigate()
    const [currentComponent, setCurrentComponent] = useState('home')
    const [selectedUserId, setSelectedUserId] = useState(null)

    const handleMenuClick = (componentId) => {
        setCurrentComponent(componentId)
        setSelectedUserId(null) // Reset do usuário selecionado ao mudar de componente
    }

    const handleEditUser = (componentId, userId) => {
        console.log('Dashboard - Mudando para componente:', componentId, 'com userId:', userId)
        setSelectedUserId(userId)
        setCurrentComponent(componentId)
    }

    const getNomeUsuario = () => {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuario')); // Converte a string JSON para objeto
        const nomePadrao = 'Usuário';

        if (usuarioLogado) {
            console.log('Usuário logado:', usuarioLogado);
            return usuarioLogado.nome || usuarioLogado.name || nomePadrao;
        }

        console.log('Nenhum usuário logado');
        return nomePadrao;
    };

    return (
        <div className="dashboard-page">
            <Titlebar userName={getNomeUsuario()} />
            <div className="dashboard-content">
                <Sidebar
                    activeItem={currentComponent}
                    onItemClick={handleMenuClick}
                />
                <main className="main-content">
                    <Render
                        component={currentComponent}
                        onEditUser={handleEditUser}
                        userId={selectedUserId}
                    />
                </main>
            </div>
        </div>
    )
}

//mostrar o token
console.log(localStorage.getItem('@token'))

export default Dashboard 