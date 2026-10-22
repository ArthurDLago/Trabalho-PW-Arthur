import { useEffect, useState } from 'react';
import { api, getMensagemErro } from './api';

const formVazio = { nomeCompleto: '', cpf: '', celular: '', email: '' };

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [form, setForm] = useState(formVazio);
    const [codEditando, setCodEditando] = useState(null);
    const [erro, setErro] = useState('');

    const carregarClientes = async () => {
        try {
            const { data } = await api.get('/cliente');
            setClientes(data);
        } catch (err) {
            setErro(getMensagemErro(err));
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { carregarClientes(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleCancelar = () => {
        setForm(formVazio);
        setCodEditando(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        const cliente = {
            nomeCompleto: form.nomeCompleto,
            cpf: form.cpf,
            celular: form.celular || null,
            email: form.email || null,
        };
        try {
            if (codEditando) await api.put('/cliente', { codCliente: codEditando, ...cliente });
            else await api.post('/cliente', cliente);
            handleCancelar();
            carregarClientes();
        } catch (err) {
            setErro(getMensagemErro(err));
        }
    };

    const handleEditar = (cliente) => {
        setCodEditando(cliente.codCliente);
        setForm({
            nomeCompleto: cliente.nomeCompleto,
            cpf: cliente.cpf,
            celular: cliente.celular ?? '',
            email: cliente.email ?? '',
        });
    };

    const handleExcluir = async (cliente) => {
        if (!window.confirm(`Excluir o cliente ${cliente.nomeCompleto}?`)) return;
        try {
            await api.delete(`/cliente/${cliente.codCliente}`);
            carregarClientes();
        } catch (err) {
            setErro(getMensagemErro(err));
        }
    };

    return (
        <>
            <h1 className="h3 mb-3">Clientes</h1>

            {erro && <div className="alert alert-danger">{erro}</div>}

            <form onSubmit={handleSubmit} className="card card-body mb-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Nome completo</label>
                        <input className="form-control" name="nomeCompleto" value={form.nomeCompleto}
                            onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">CPF</label>
                        <input className="form-control" name="cpf" value={form.cpf}
                            onChange={handleChange} pattern="\d{11}" maxLength={11}
                            title="O CPF deve ter 11 números, sem pontos e traço" placeholder="Somente números" required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Celular</label>
                        <input className="form-control" name="celular" value={form.celular}
                            onChange={handleChange} pattern="\d{10,11}" maxLength={11}
                            title="O celular deve ter 10 ou 11 números (DDD + número), sem espaços ou traço" placeholder="DDD + número, somente números" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">E-mail</label>
                        <input className="form-control" name="email" type="email" value={form.email}
                            onChange={handleChange} />
                    </div>
                </div>
                <div className="mt-3">
                    <button className="btn btn-dark me-2" type="submit">
                        {codEditando ? 'Atualizar' : 'Cadastrar'}
                    </button>
                    {codEditando && (
                        <button className="btn btn-outline-secondary" type="button" onClick={handleCancelar}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Celular</th>
                        <th>Veículos</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.codCliente}>
                            <td>{cliente.nomeCompleto}</td>
                            <td>{cliente.cpf}</td>
                            <td>{cliente.celular}</td>
                            <td>{cliente.qtdVeiculos}</td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-outline-primary me-1"
                                    onClick={() => handleEditar(cliente)}>Editar</button>
                                <button className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleExcluir(cliente)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Clientes;
