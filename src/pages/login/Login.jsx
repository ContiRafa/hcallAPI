// Importação dos hooks e bibliotecas necessárias
import React, { useState } from "react"; // React e hook de estado
import { FaUser, FaLock } from "react-icons/fa"; // Ícones de usuário e cadeado
import { useNavigate } from "react-router-dom"; // Hook para navegação entre rotas
import "./login.css"; // Estilos CSS específicos do login
import { api_login } from "../../api/auth"; // Importação correta da função de login
import axios from "axios";

// Componente funcional de formulário de login
const LoginForm = () => {
    const navigate = useNavigate(); // Hook para redirecionar o usuário
    const [formData, setFormData] = useState({
        email: "",        // Campo de e-mail
        password: "",     // Campo de senha
        remember: false   // Checkbox para lembrar login
    });

    const [error, setError] = useState("");     // Mensagem de erro
    const [loading, setLoading] = useState(false); // Estado de carregamento (usado ao enviar o formulário)

    // Função para lidar com mudanças nos inputs do formulário
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value // Atualiza o estado dependendo do tipo do campo
        }));
    };

    // Função para envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault(); // Impede o comportamento padrão do formulário (recarregar a página)
        setError("");       // Limpa qualquer erro anterior
        setLoading(true);   // Ativa o estado de carregamento

        try {
            // Chamada real à API para autenticação
            const result = await api_login(formData.email, formData.password);

            if (result.success) {
                navigate('/dashboard'); // Redireciona para o dashboard se login for bem-sucedido
            } else {
                setError(result.error || 'Erro ao fazer login'); // Mostra erro retornado pela API
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor'); // Mensagem genérica de erro
        } finally {
            setLoading(false); // Desativa o estado de carregamento
        }
    };

    // JSX retornado pelo componente
    return (
        <div className="container">
            <div className="login-container">
                {/* Lado esquerdo com logo e saudação */}
                <div className="left-side">
                    <img src="/imgs/cps-logo.png" alt="CPS Logo" className="logo" />
                    <h1 className="title-up">Bem-vindo de volta!</h1>
                    <p className="subtitle-up">Sistema de Gerenciamento de Chamados</p>
                </div>

                {/* Lado direito com o formulário de login */}
                <div className="right-side">
                    <h1 className="title">Acesso restrito!</h1>
                    <p className="subtitle">Entre com suas credenciais para continuar.</p>

                    {/* Exibe mensagem de erro se houver */}
                    {error && <p className="error-message">{error}</p>}

                    {/* Formulário de login */}
                    <form onSubmit={handleSubmit}>
                        {/* Campo de email */}
                        <div className="input-group">
                            <div className="icon"><FaUser /></div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading} // Desabilita o campo durante carregamento
                            />
                        </div>

                        {/* Campo de senha */}
                        <div className="input-group">
                            <div className="icon"><FaLock /></div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Senha"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        {/* Botão de envio */}
                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? 'Entrando...' : 'Entrar'} {/* Texto muda conforme estado de carregamento */}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm; // Exporta o componente
