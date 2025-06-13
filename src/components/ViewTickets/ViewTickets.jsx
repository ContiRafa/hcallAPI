import React, { useState, useEffect } from 'react';
import './ViewTickets.css';
import { getTicketDetails, addAnotacao, handleConcluirTicket } from '../../api/tickets';
import { handleIniciarTicket } from '../../api/tickets';
// import { baixarAnexo } from '../../api/tickets';
// import { Download } from 'lucide-react';

const ViewTickets = ({ ticketId, onClose }) => {
    const [ticket, setTicket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updates, setUpdates] = useState([]);
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        const fetchTicketData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const ticketData = await getTicketDetails(ticketId.id);
                console.log("Dados completos do ticket:", ticketData.data.ticket);
                setTicket(ticketData.data.ticket);

                // ATUALIZAÇÃO AQUI - Agora pegamos as anotações de history
                if (ticketData.data.ticket.history) {
                    setUpdates(ticketData.data.ticket.history.map(item => ({
                        date: item.date,
                        text: item.return  // Note que o campo é 'return' no JSON
                    })));
                }
            } catch (err) {
                console.error('Erro ao buscar detalhes do ticket:', err);
                setError('Falha ao carregar os detalhes do ticket');
            } finally {
                setIsLoading(false);
            }
        };

        if (ticketId) {
            fetchTicketData();
        } else {
            setIsLoading(false);
        }
    }, [ticketId]);

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

    const handleAddNote = async () => {
        try {
            const novaAnotacao = await addAnotacao(ticket.id, noteText);

            // Atualiza o estado com a nova anotação
            setUpdates(prev => [...prev, {
                date: novaAnotacao.data,
                text: novaAnotacao.texto
            }]);

            setNoteText('')

            // Limpa o campo de texto
        } catch (err) {
            console.error('Erro ao adicionar anotação:', err);
            setError('Erro ao adicionar anotação');
        }
    };

    
    //-----------------------------------------------------------------------------------//

    const handleClickIniciar = async () => {
        try {
            if (!ticket || ticket.tickt_status !== 'pending') {
                throw new Error('Só é possível iniciar tickets com status "pending"');
            }

            const updatedTicket = await handleIniciarTicket(ticket);

            if (updatedTicket) {
                // Atualiza o estado local mantendo todos os dados existentes
                setTicket({
                    ...ticket,
                    tickt_status: 'doing' // Atualiza apenas o status
                });
                alert('Ticket iniciado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao iniciar ticket:', error);
            alert(error.message || 'Erro ao iniciar ticket');
        }
    };

    const handleClickConcluir = async () => {
        try {
            if (!ticket || ticket.tickt_status !== 'doing') {
                throw new Error('Só é possível concluir tickets com status "doing"');
            }

            const updatedTicket = await handleConcluirTicket(ticket);

            if (updatedTicket) {
                // Atualiza o estado local mantendo todos os dados existentes
                setTicket({
                    ...ticket,
                    tickt_status: 'completed' // Garantindo o status correto
                });
                alert('Ticket concluído com sucesso!');

                // Opcional: fecha o modal após conclusão
                // onClose();
            }
        } catch (error) {
            console.error('Erro ao concluir ticket:', error);
            alert(error.message || 'Erro ao concluir ticket');
        }
    };


    //----------------------------------------------------------------------------------//


    if (!ticketId) {
        return <div className="view-ticket-content">Nenhum ticket selecionado</div>;
    }

    if (isLoading) {
        return (
            <div className="view-ticket-content loading">
                <div className="loading-spinner"></div>
                <p>Carregando detalhes do ticket...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-ticket-content error">
                <p>{error}</p>
                <button onClick={onClose} className="close-btn">
                    Fechar
                </button>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="view-ticket-content">
                <p>Não foi possível carregar os dados do ticket</p>
                <button onClick={onClose} className="close-btn">
                    Fechar
                </button>
            </div>
        );
    }

    return (
        <div className="view-ticket-content">
            <div className="ticket-header">
                <div className="textHeader">
                    <h1>Descrição do Problema</h1>
                </div>
                <div className="descricaoChamado">
                    <p className='description-text'>
                        {ticket.explain}
                    </p>
                </div>
            </div>

            <div className="ticket-info-grid">
                <div className="info-column">
                    <div className="info-block">
                        <div className="info-item">
                            <span className="label">ID Chamado</span>
                            <span className="value">#{ticket.id}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Cliente</span>
                            <span className="value">{ticket.clientName || ticket.name}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Equipamento</span>
                            <span className="value">{ticket.item}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Referência do Equipamento</span>
                            <span className="value">{ticket.reference}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Local</span>
                            <span className="value">{ticket.department}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Tempo</span>
                            <span className="value">{formatarData(ticket.date)}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Status</span>
                            <span className="status-badge">{ticket.tickt_status}</span>
                        </div>
                    </div>

                    {/* <div className="images-block">
                        <div className="containerDownload">
                            <div className="btn-baixar">
                                <button onClick={baixarAnexo}>
                                    Baixar

                                </button>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

            <div className="anotacoesChamado">
                <div className="description-container">
                    <div className="description-block">
                        <h3>Anotações do chamado:</h3>
                        <div className="description-text-container">
                            <textarea
                                className="campoAnotacao"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Digite sua anotação aqui..."
                            />
                        </div>
                        <div className="buttons-container">
                            <button onClick={handleAddNote} className='action-button adicionar'>Adicionar Anotação</button>
                        </div>
                    </div>
                </div>
                <div className="updates-block">
                    <h3>Últimas alterações</h3>
                    <div className="update-list">
                        {updates.map((update, index) => (
                            <div className="update-item" key={index}>
                                <span className="update-date">
                                    {formatarData(update.date)}
                                </span>
                                <span className="update-text">
                                    {update.text}
                                </span>
                            </div>
                        ))}
                        {updates.length === 0 && (
                            <p className="no-updates">Nenhuma anotação ainda</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="ticket-actions">
                {/* Botão "Iniciar Chamado" - aparece apenas quando status é 'pending' */}
                {ticket.tickt_status === 'pending' && (
                    <button
                        className="action-button iniciar"
                        onClick={handleClickIniciar}
                        disabled={!ticket}
                    >
                        Iniciar Chamado
                    </button>
                )}

                {/* Botão "Finalizar Chamado" - aparece apenas quando status é 'doing' */}
                {ticket.tickt_status === 'doing' && (
                    <button
                        className="action-button concluir"
                        onClick={handleClickConcluir}
                        disabled={!ticket}
                    >
                        Finalizar Chamado
                    </button>
                )}

                {/* Mensagem quando ticket já está concluído */}
                {ticket.tickt_status === 'completed' && (
                    <div className="ticket-completed-message">
                        Chamado já foi concluído
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewTickets;