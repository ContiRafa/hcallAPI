import React, { useState } from 'react';
import './Filters.css'

function Filters({ filtros, onFiltroChange }) {
    return (
        <div className="filtros-section">
            <div className="filtros-container">
                <div className="filtro-item">
                    <label>Chamado:</label>
                    <input
                        type="text"
                        placeholder="Digite o nome do chamado"
                        value={filtros.name}
                        onChange={(e) => onFiltroChange('name', e.target.value)}
                        className="filtro-input"
                    />
                </div>
                <div className="filtro-item">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Digite o email do autor"
                        value={filtros.author}
                        onChange={(e) => onFiltroChange('author', e.target.value)}
                        className="filtro-input"
                    />
                </div>
                <div className="container-filter01">
                    <div className="filtro-item">
                        <label>Data:</label>
                        <input
                            type="date"
                            value={filtros.date}
                            onChange={(e) => onFiltroChange('date', e.target.value)}
                            className="filtro-input"
                        />
                    </div>
                    <div className="filtro-item">
                        <label>Status:</label>
                        <select
                            value={filtros.status}
                            onChange={(e) => onFiltroChange('status', e.target.value)}
                            className="filtro-input"
                        >
                            <option value="">Selecione um status</option>
                            <option value="pending">Pendente</option>
                            <option value="doing">Em Andamento</option>
                            <option value="conclued">Concluído</option>
                        </select>
                    </div>
                </div>
                <div className="filtros-buttons">
                    <button
                        className="filtro-clear-button"
                        onClick={() => onFiltroChange('clear', true)}
                    >
                        Limpar Filtros
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Filters
