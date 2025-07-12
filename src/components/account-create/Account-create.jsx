import React, { useState, useRef } from "react";
import './Account-create.css';
import { createUser } from '../../api/createUser';

const USER_ROLES = {
    user: 'Usuário Comum',
    admin: 'Administrador'
};

const AccountCreate = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'admin' // O valor default é "user"
    });

    const [apiError, setApiError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const passwordInputRef = useRef(null);
    const showPasswordRef = useRef(null);

    const handleShowPassword = () => {
        if (passwordInputRef.current && showPasswordRef.current) {
            passwordInputRef.current.type = showPasswordRef.current.checked ? 'text' : 'password';
        }
    };

    const formatPhone = (phone) => {
        const digits = phone.replace(/\D/g, '');
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'phone' ? formatPhone(value) : value
        }));
        // Log específico para mudança de role
        if (name === 'role') {
            console.log(`Input alterado (radio button):`);
            console.log(`→ NAME: ${name}`);
            console.log(`→ Novo valor selecionado: ${value}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
            setApiError('Preencha todos os campos obrigatórios');
            return;
        }

        if (formData.password.length < 6) {
            setApiError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setApiError(null);
        setIsLoading(true);

        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                phone: formData.phone.replace(/\D/g, ''),
                role: formData.role
            };
            const result = await createUser(payload);

            if (result.success) {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    role: 'admin' // Reseta para o valor padrão
                });
                setSuccessMessage('Usuário criado com sucesso!');
                setTimeout(() => setSuccessMessage(null), 5000);
            }
        } catch (error) {
            let errorMessage = error.message;

            if (errorMessage.includes('Failed to fetch')) {
                errorMessage = (
                    <>
                        Erro de conexão. Verifique:
                        <ol className="error-list">
                            <li>Sua conexão com a internet</li>
                            <li>Se o proxy CORS está ativado</li>
                        </ol>
                    </>
                );
            }

            setApiError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            role: 'admin'
        });
        setApiError(null);
    };

    return (
        <div className="account-create-container">
            <div className="account-create-form">
                <h1>Criar Novo Usuário</h1>

                {apiError && (
                    <div className="error-message">
                        {apiError}
                        {typeof apiError === 'string' && apiError.includes('proxy') && (
                            <button
                                className="proxy-button"
                                onClick={() => window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank')}
                            >
                                Ativar Proxy Agora
                            </button>
                        )}
                    </div>
                )}

                {successMessage && <div className="success-message">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="account-form">
                    {/* Campo Nome */}
                    <div className="form-group">
                        <label htmlFor="name">Nome completo *</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Digite o nome completo"
                            autoComplete="name"
                        />
                    </div>

                    {/* Campo Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="exemplo@email.com"
                            autoComplete="email"
                        />
                    </div>

                    {/* Campo Telefone */}
                    <div className="form-group">
                        <label htmlFor="phone">Telefone</label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            maxLength="15"
                            placeholder="(00) 00000-0000"
                            autoComplete="tel"
                        />
                    </div>

                    {/* Campo Senha */}
                    <div className="form-group">
                        <label htmlFor="password-input">Senha *</label>
                        <div className="password-group">
                            <input
                                id="password-input"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                minLength="6"
                                placeholder="Mínimo 6 caracteres"
                                autoComplete="new-password"
                                ref={passwordInputRef}
                            />
                            <div className="show-password-checkbox">
                                <input
                                    type="checkbox"
                                    id="show-password"
                                    onChange={handleShowPassword}
                                    ref={showPasswordRef}
                                />
                                <label htmlFor="show-password">Mostrar senha</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Tipo de Usuário</label>
                        <div className="group-input">
                            <label htmlFor="admin">
                                <input
                                    type="radio"
                                    name="role"
                                    id="admin"
                                    value="admin"
                                    checked={formData.role === 'admin'}
                                    onChange={handleInputChange}
                                />
                                Administrador
                            </label>
                            <label htmlFor="user" style={{ marginLeft: '10px' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    id="user"
                                    value="user"
                                    checked={formData.role === 'user'}
                                    onChange={handleInputChange}
                                />
                                Usuário
                            </label>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="form-actions">
                        <button
                            type="submit"
                            className="save-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Criando...
                                </>
                            ) : 'Criar Usuário'}
                        </button>
                        <button
                            type="button"
                            className="delete-button"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountCreate;
