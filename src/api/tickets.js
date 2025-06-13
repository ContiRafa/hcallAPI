import axios from 'axios';

// URL base da API obtida das variáveis de ambiente
const API_URL = import.meta.env.VITE_API_URL;
// const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

// Cria uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    // 'Authorization': localStorage.getItem('@token'),
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('@token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Função para buscar todos os tickets do usuário
 * @returns {Promise<Array>} - Lista de tickets do usuário
 * @throws {Error} - Erro caso o token não seja encontrado ou a requisição falhe
 */
async function getTickets() {
  try {
    const response = await api.get('/ticket/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar tickets');
  }
  
}

/**
 * Função para obter a contagem de tickets
 * @returns {Promise<Object>} - Contagem de tickets
 * @throws {Error} - Erro caso a requisição falhe
 */
async function countTickets() {
  try {
    const response = await api.get('/ticket/count');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao contar tickets');
  }
}

/**
 * Função para buscar os detalhes de um ticket
 * @param {string} ticketId - ID do ticket que você deseja buscar os detalhes
 * @returns {Promise<Object>} - Detalhes do ticket
 * @throws {Error} - Erro caso o ID seja inválido ou a requisição falhe
 */
async function getTicketDetails(ticketId) {
  if (!ticketId) {
    throw new Error('ID do ticket não fornecido');
  }

  try {
    const response = await api.get('/ticket/details', {
      params: { id: ticketId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar detalhes do ticket');
  }
}

// Função para formatar a data e hora no estilo brasileiro
function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
}

/**
 * Função para adicionar uma anotação ao ticket
 * @param {string} ticketId - O ID do ticket ao qual a anotação será adicionada
 * @param {string} texto - O texto da anotação
 * @returns {Promise<Object>} - Retorna a nova anotação criada
 * @throws {Error} - Se o ID do ticket ou texto forem inválidos ou ocorrer um erro na requisição
 */
async function addAnotacao(ticketId, texto) {
  if (!ticketId) {
    throw new Error("ID do ticket não fornecido");
  }

  if (!texto || texto.trim() === "") {
    throw new Error("Texto da anotação não fornecido");
  }

  try {
    const response = await api.put('/ticket/protected/', {
      id: ticketId,
      return: texto,
      data: new Date().toISOString()
    }, {
      params: { id: ticketId }
    });

    return {
      data: new Date().toISOString(),
      texto: texto.trim()
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao adicionar anotação');
  }
}


/**
 * Função para marcar um ticket como "em andamento" (doing)
 * @param {Object} ticket - Objeto do ticket a ser marcado como em andamento
 * @returns {Promise<Object>} - Retorna o ticket atualizado
 * @throws {Error} - Se o ticket for inválido ou ocorrer um erro na requisição
 */
const handleIniciarTicket = async (ticket) => {
  if (!ticket?.id) {
    throw new Error('Ticket inválido');
  }

  try {
    const response = await api.patch('/ticket/protected/', {
      Authorization: localStorage.getItem('@token'),
      id: ticket.id,
      status: "doing"
    });

    return {
      id: ticket.id,
      status: "doing"
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao iniciar ticket');
  }
};

/**
 * Função para concluir um ticket (status completed)
 * @param {Object} ticket - Objeto do ticket a ser concluído
 * @returns {Promise<Object>} - Retorna o ticket concluído
 * @throws {Error} - Se o ticket for inválido ou ocorrer um erro na requisição
 */
const handleConcluirTicket = async (ticket) => {
  if (!ticket?.id) {
    throw new Error('Ticket inválido');
  }

  try {
    const response = await api.patch('/ticket/protected/', {
      id: ticket.id,
      status: "conclued"
    });

    return {
      id: ticket.id,
      status: "conclued"
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao concluir ticket');
  }
};

// async function baixarAnexo(id_Anexo) {
//   try {
//     const response = await api.get(`/ticket/attatchmens/${id_Anexo}/download`);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Erro ao fazer download');
//   }
  
// }

// Exporta as funções para uso em outros arquivos
export {
  getTickets,
  countTickets,
  getTicketDetails,
  formatarData,
  addAnotacao,
  handleConcluirTicket,
  handleIniciarTicket
  // baixarAnexo // <-- Adicionando a nova função às exportações
};