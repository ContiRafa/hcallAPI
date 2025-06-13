import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { MdFormatListBulleted, MdOutlineNewReleases, MdPendingActions, MdTaskAlt } from 'react-icons/md'
import './Home.css'
import Tickets from '../tickets/Tickets';
import { getTickets, countTickets } from '../../api/tickets';
// import Grafico from '../grafico/grafico';


const Home = () => {
    const navigate = useNavigate()
    const [showTickets, setShowTickets] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [ticketCounts, setTicketCounts] = useState({
        all: 0,
        new: 0,
        pending: 0,
        completed: 0
    });

    useEffect(() => {
        const fetchTicketCounts = async () => {
            try {
                const response = await countTickets();
                setTicketCounts({
                    all: response.data.total || 0,
                    new: response.data.doing || 0, // 'doing' no backend corresponde a 'new' no front
                    pending: response.data.pending || 0,
                    completed: response.data.conclued || 0, // 'conclued' no backend corresponde a 'completed' no front
                });
            } catch (error) {
                console.error('Erro ao buscar contagem de tickets:', error);
            }
        };

        fetchTicketCounts();
    }, []);

    const handleTicketClick = (status) => {
        setSelectedFilter(status);
        setShowTickets(true);
    };

    const handleBackToHome = () => {
        setShowTickets(false);
        setSelectedFilter(null);
    };

    const getNomeUsuario = () => {
        // 1️⃣ Busca os dados do usuário no localStorage
        const userData = localStorage.getItem('@authData'); // ou a chave que você usou para salvar
        
        // 2️⃣ Se existir, converte de string para objeto
        if (userData) {
            try {
                const parsedData = JSON.parse(userData);
                
                // 3️⃣ Retorna o username (se existir) ou um valor padrão
                return parsedData.user?.username || 'Usuário';
            } catch (error) {
                console.error("Erro ao analisar dados do localStorage:", error);
                return 'Usuário';
            }
        }
        
        // 4️⃣ Caso não encontre nada, retorna padrão
        return 'Usuário';
    };

    if (showTickets) {
        return (
            <div>
                <button className="back-button" onClick={handleBackToHome}>
                    ← Voltar para Dashboard
                </button>
                <Tickets initialFilter={selectedFilter} />
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="name-title">
                <h2>Bem-vindo {getNomeUsuario()}</h2>
            </div>
            <div className="dashboard-buttons">
                <button
                    className="dashboard-button all"
                    onClick={() => handleTicketClick(null)}
                >
                    <MdFormatListBulleted className="button-icon" />
                    <div className="button-content">
                        <span className="button-title">Todos os Chamados</span>
                        <span className="button-count">{ticketCounts.all}</span>
                    </div>
                </button>

                <button
                    className="dashboard-button new"
                    onClick={() => handleTicketClick('doing')} // Usando 'doing' que é o nome no backend
                >
                    <MdOutlineNewReleases className="button-icon" />
                    <div className="button-content">
                        <span className="button-title">Novos Chamados</span>
                        <span className="button-count">{ticketCounts.new}</span>
                    </div>
                </button>

                <button
                    className="dashboard-button pending"
                    onClick={() => handleTicketClick('pending')}
                >
                    <MdPendingActions className="button-icon" />
                    <div className="button-content">
                        <span className="button-title">Chamados Pendentes</span>
                        <span className="button-count">{ticketCounts.pending}</span>
                    </div>
                </button>

                <button
                    className="dashboard-button completed"
                    onClick={() => handleTicketClick('conclued')} // Usando 'conclued' que é o nome no backend
                >
                    <MdTaskAlt className="button-icon" />
                    <div className="button-content">
                        <span className="button-title">Chamados Concluídos</span>
                        <span className="button-count">{ticketCounts.completed}</span>
                    </div>
                </button>
            </div>

            {/* <div className="grafico">
                <Grafico />
            </div> */}
        </div>
        
    )
}

export default Home