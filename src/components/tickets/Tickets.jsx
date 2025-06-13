import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Filters from '../filters/Filters';
import ViewTickets from '../ViewTickets/ViewTickets';
import { getTickets } from '../../api/tickets';
import './Tickets.css';

const Tickets = ({ initialFilter }) => {
    const navigate = useNavigate();
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtros, setFiltros] = useState({
        name: '',
        author: '',
        date: '',
        status: initialFilter || ''
    });

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const response = await getTickets();

                if (response.data && response.data.tickets) {
                    setChamados(response.data.tickets);
                } else {
                    setChamados([]);
                }
                setError(null);
            } catch (err) {
                setError('Erro ao carregar tickets');
                setChamados([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const handleFiltroChange = (filterType, value) => {
        if (filterType === 'clear') {
            setFiltros({
                name: '',
                author: '',
                date: '',
                status: ''
            });
        } else if (filterType === 'apply') {
            // Aplica os filtros existentes (já estão no estado)
        } else {
            setFiltros(prev => ({
                ...prev,
                [filterType]: value
            }));
        }
    };

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
    };

    const handleBackToList = () => {
        setSelectedTicket(null);
    };

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const chamadosFiltrados = chamados.filter(chamado => {
        // Filtro por nome do chamado
        if (filtros.name && !chamado.name?.toLowerCase().includes(filtros.name.toLowerCase())) {
            return false;
        }
        
        // Filtro por autor/email
        if (filtros.author && !chamado.author?.toLowerCase().includes(filtros.author.toLowerCase())) {
            return false;
        }
        
        // Filtro por status
        if (filtros.status && chamado.status?.toLowerCase() !== filtros.status.toLowerCase()) {
            return false;
        }
        
        // Filtro por data (implementação básica)
        if (filtros.date) {
            const chamadoDate = new Date(chamado.date).toISOString().split('T')[0];
            if (chamadoDate !== filtros.date) {
                return false;
            }
        }
        
        return true;
    });

    if (selectedTicket) {
        return (
            <div className="tickets-container">
                <button className="back-button" onClick={handleBackToList}>
                    ← Voltar para lista
                </button>
                <ViewTickets ticketId={selectedTicket} onClose={handleBackToList} />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="tickets-container">
                <div className="loading">Carregando tickets...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tickets-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="tickets-container">
            <h2>Lista de Chamados</h2>
            
            {/* Adicionando o componente Filters */}
            <Filters 
                filtros={filtros} 
                onFiltroChange={handleFiltroChange} 
            />

            <div className="tickets-list">
                {chamadosFiltrados.length === 0 ? (
                    <div className="no-tickets">Nenhum chamado encontrado</div>
                ) : (
                    chamadosFiltrados.map((chamado) => (
                        <div
                            key={chamado.id}
                            className="ticket-item"
                            onClick={() => handleViewTicket(chamado)}
                        >
                            <div className="ticket-header">
                                <span className="ticket-id">#{chamado.id}</span>
                                <span className={`ticket-status ${chamado.status}`}>
                                    {chamado.status}
                                </span>
                            </div>
                            <div className="ticket-title"><strong>Equipamento: </strong>{chamado.item}</div>
                            <div className="ticket-title"><strong>Local: </strong>{chamado.department}</div>
                            <div className="ticket-info">
                                <span className="ticket-author">
                                    <strong>Autor:</strong> {chamado.author}
                                </span>
                                <span className="ticket-date">
                                    <strong>Data:</strong> {formatarData(chamado.date)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Tickets;