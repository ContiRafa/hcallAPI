import React, { useEffect, useState } from 'react';
import { countTickets } from '../../api/tickets';
// import styles from '../grafico/styles';
import styles from './styles.module.css'; // Importando o CSS do componente

const Grafico = () => {
  // Estado inicial com estrutura correta e valores padrão
  const [chartData, setChartData] = useState([
    { status: 'Total', value: 0, color: '#4e73df' },
    { status: 'Em andamento', value: 0, color: '#1cc88a' },
    { status: 'Pendentes', value: 0, color: '#f6c23e' },
    { status: 'Concluídos', value: 0, color: '#e74a3b' }
  ]);
  
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  // Efeito para buscar os dados ao montar o componente
  useEffect(() => {
    fetchData();
  }, []); // Array de dependências vazio para rodar apenas uma vez

  // Função assíncrona para buscar os dados da API
  const fetchData = async (filterParams = {}) => {
    setLoading(true); // Ativa o estado de carregamento
    try {
      const result = await countTickets(filterParams);
      console.log('Dados recebidos da API:', result); // Log do objeto completo retornado pela API

      // Atualiza o estado do gráfico com os dados da API
      // Acessamos 'result.data' pois a API retorna os contadores aninhados
      setChartData([
        { 
          status: 'Total', 
          value: result.data?.total || 0, // Garante que o valor é 0 se for null/undefined
          color: '#4e73df' 
        },
        { 
          status: 'Em andamento', 
          value: result.data?.doing || 0,
          color: '#1cc88a' 
        },
        { 
          status: 'Pendentes', 
          value: result.data?.pending || 0,
          color: '#f6c23e' 
        },
        { 
          status: 'Concluídos', 
          value: result.data?.conclued || 0,
          color: '#e74a3b' 
        }
      ]);
      
    } catch (error) {
      console.error("Erro ao buscar dados:", error); // Log de erros na requisição
    } finally {
      setLoading(false); // Desativa o estado de carregamento, independentemente do sucesso/erro
    }
  };

  // Lida com a mudança nos campos de filtro
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Aplica os filtros ao enviar o formulário
  const applyFilters = (e) => {
    e.preventDefault(); // Previne o recarregamento da página
    fetchData(filters); // Chama a API com os filtros atuais
  };

  // Reseta os filtros e recarrega os dados sem filtros
  const resetFilters = () => {
    setFilters({ startDate: '', endDate: '' }); // Limpa os campos de filtro
    fetchData(); // Recarrega os dados sem filtros
  };

  // Calcula o valor máximo entre todos os tickets para escalonar as barras. Garante que é no mínimo 1.
  const maxValue = Math.max(...chartData.map(item => item.value), 1);

  return (
    <div className={styles.graficoContainer}>
      <h2 className={styles.graficoTitle}>GRÁFICO DE TICKETS</h2>
      {/* Exibição condicional de carregamento ou gráfico */}
      {loading ? (
        <div className={styles.loading}>Carregando dados...</div>
      ) : (
        <div className={styles.chartWrapper}>
          <div className={styles.chartBars}>
            {chartData.map((item, index) => (
              <div key={index} className={styles.barGroup}>
                <div 
                  className={styles.bar} 
                  style={{ 
                    height: `${(item.value / maxValue) * 100}%`, // Altura da barra baseada no valor
                    backgroundColor: item.color // Cor da barra
                  }}
                >
                  <span className={styles.barValue}>{item.value}</span> {/* Valor numérico acima da barra */}
                </div>
                <div className={styles.barLabel}>{item.status}</div> {/* Rótulo da barra */}
              </div>
            ))}
          </div>
          <div className={styles.chartLegend}>
            {chartData.map((item, index) => (
              <div key={index} className={styles.legendItem}>
                <span 
                  className={styles.legendColor} 
                  style={{ backgroundColor: item.color }} // Cor da legenda
                />
                <span>{item.status}</span> {/* Texto da legenda */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  // Formulário de filtros
  
  );
};

//-------------------------------------------------filtros--------------------------------------------------------------//

// Container de filtros
//       <div className={styles.filterContainer}>
//         <form onSubmit={applyFilters} className={styles.filterForm}>
//           <div className={styles.filterGroup}>
//             <label htmlFor="startDate">Data Inicial</label>
//             <input
//               type="date"
//               id="startDate"
//               name="startDate"
//               value={filters.startDate}
//               onChange={handleFilterChange}
//               max={filters.endDate || new Date().toISOString().split('T')[0]} // Impede data inicial maior que final
//             />
//           </div>
//           <div className={styles.filterGroup}>
//             <label htmlFor="endDate">Data Final</label>
//             <input
//               type="date"
//               id="endDate"
//               name="endDate"
//               value={filters.endDate}
//               onChange={handleFilterChange}
//               min={filters.startDate} // Impede data final menor que inicial
//               max={new Date().toISOString().split('T')[0]} // Impede data futura
//             />
//           </div>
//           <div className={styles.filterActions}>
//             <button type="submit" className={styles.applyButton}>Aplicar</button>
//             <button type="button" onClick={resetFilters} className={styles.resetButton}>Limpar</button>
//           </div>
//         </form>
//       </div>

//---------------------------------------------------------------------------------------------------------------//

export default Grafico;