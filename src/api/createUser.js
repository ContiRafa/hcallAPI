const API_URL = import.meta.env.VITE_API_URL;
// const PROXY_URL = "https://cors-anywhere.herokuapp.com";
import axios from "axios";

/**
 * Cria um novo usuário
 * @param {Object} userData - Dados do usuário a ser criado
 * @returns {Promise<Object>} Objeto com resultado da operação
 */
async function createUser(userData) {
    try {
        const token = localStorage.getItem('@token');
        if (!token) {
            throw new Error('Token de autenticação não encontrado');
        }

        const fullUrl = `${API_URL}/user/`;
        console.log('[createUser] URL completa:', fullUrl);

        const dataToSend = {
            ...userData,
            role: userData.role || 'user' // Valor padrão 'user'
        };

        console.log('[createUser] Dados sendo enviados:', dataToSend);

        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(dataToSend)
        });

        // Tratamento específico para status 400 (Bad Request)
        if (response.status === 400) {
            const errorText = await response.text();
            try {
                const errorData = JSON.parse(errorText);
                console.error('[createUser] Erro 400 detalhado:', errorData);
                throw new Error(errorData.message || 'Dados inválidos enviados ao servidor');
            } catch {
                console.error('[createUser] Erro 400 (texto):', errorText);
                throw new Error(errorText || 'Requisição inválida');
            }
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[createUser] Erro HTTP:', response.status, errorText);
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('[createUser] Resposta do servidor:', data);

        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error('[createUser] Erro completo:', error);
        return {
            success: false,
            error: error.message || 'Erro ao criar usuário',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
}

/**
 * Obtém todos os usuários
 * @returns {Promise<Array>} Lista de usuários
 */
async function getUsers() {
    try {
        const token = localStorage.getItem('@token');
        if (!token) {
            throw new Error('Token não encontrado');
        }

        const fullUrl = `${API_URL}/user/all`;
        console.log('[getUsers] URL completa:', fullUrl);

        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('[getUsers] Usuários obtidos:', data.length);
        return data.data.users;
    } catch (error) {
        console.error('[getUsers] Erro detalhado:', error);
        
        if (error.message.includes('401')) {
            localStorage.removeItem('@token');
            window.location.href = '/login';
        }
        
        throw error;
    }
}

/**
 * Deleta um usuário
 * @param {string} userId - ID do usuário a ser deletado
 * @returns {Promise<Object>} Objeto com resultado da operação
 */
async function deleteUser(userId) {
    try {
        // Log do ID do usuário que será deletado
        console.log('ID do usuário a ser deletado:', userId);

        const token = localStorage.getItem('@token');
        if (!token) {
            throw new Error('Token de autenticação não encontrado');
        }

        const response = await axios.delete(`${API_URL}/user/${userId}`, {
            headers: {
                'Authorization': token, // Adicionei 'Bearer' se necessário
                'Content-Type': 'application/json'
            }
        });

        // Verifica se a requisição foi bem-sucedida (status 2xx)
        if (response.status >= 200 && response.status < 300) {
            console.log('Usuário deletado com sucesso!', response.data);

           
            return {
                success: true,
                data: response.data
            };
        } else {
            // Se a API retornar um erro (status 4xx/5xx)
            const errorMessage = response.data?.message || 'Erro ao deletar usuário';
            throw new Error(`Erro ${response.status}: ${errorMessage}`);
        }

    } catch (error) {
        console.error('Erro ao deletar usuário:', error.message);
        
        return {
            success: false,
            error: error.message || 'Erro ao deletar usuário'
        };
    }
}

export { getUsers, createUser, deleteUser };