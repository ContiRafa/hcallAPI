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
        // Primeiro obtemos os dados do usuário armazenados
        const usuarioString = localStorage.getItem('u');
        
        // Se existir, convertemos de string para objeto
        if (usuarioString) {
            const usuario = JSON.parse(usuarioString);
            // Retornamos o nome do usuário (ajuste conforme a estrutura do seu objeto)
            console.log('Usuário logado:', usuarioLogado ? JSON.parse(usuarioLogado) : 'Nenhum usuário logado');
            return usuario.nome || usuario.name || 'Usuário';
        }
        
        // Caso não encontre, retorna um valor padrão
        return 'Usuário';
    };

    return (
        <div className="dashboard-page">
            <Titlebar userName= {getNomeUsuario()} />
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