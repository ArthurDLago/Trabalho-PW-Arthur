import { useEffect, useState } from 'react';
import { api, getMensagemErro } from './api';

const formVazio = { placa: '', modelo: '', anoFabricacao: '', codCliente: '' };

const Veiculos = () => {
    const [veiculos, setVeiculos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [form, setForm] = useState(formVazio);
    const [codEditando, setCodEditando] = useState(null);
    const [erro, setErro] = useState('');

    const carregar = async () => {
        try {
            const resVeiculos = await api.get('/veiculo');
            const resClientes = await api.get('/cliente');
            setVeiculos(resVeiculos.data);
            setClientes(resClientes.data);
        } catch (err) {
            setErro(getMensagemErro(err));
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { carregar(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleCancelar = () => {
        setForm(formVazio);
        setCodEditando(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        const veiculo = {
            placa: form.placa,
            modelo: form.modelo,
            anoFabricacao: form.anoFabricacao ? Number(form.anoFabricacao) : null,
            codCliente: Number(form.codCliente),
        };
        try {
            if (codEditando) await api.put('/veiculo', { codVeiculo: codEditando, ...veiculo });
            else await api.post('/veiculo', veiculo);
            handleCancelar();
            carregar();
        } catch (err) {
            setErro(getMensagemErro(err));
        }
    };

    const handleEditar = (veiculo) => {
        setCodEditando(veiculo.codVeiculo);
        setForm({
            placa: veiculo.placa,
            modelo: veiculo.modelo,
            anoFabricacao: veiculo.anoFabricacao ?? '',
            codCliente: veiculo.codCliente,
        });
    };

    const handleExcluir = async (veiculo) => {
        if (!window.confirm(`Excluir o veículo ${veiculo.placa}?`)) return;
        try {
            await api.delete(`/veiculo/${veiculo.codVeiculo}`);
            carregar();
        } catch (err) {
            setErro(getMensagemErro(err));
        }
    };

    return (
        <>
            <h1 className="h3 mb-3">Veículos</h1>

            {erro && <div className="alert alert-danger">{erro}</div>}

            <form onSubmit={handleSubmit} className="card card-body mb-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Placa</label>
                        <input className="form-control" name="placa" value={form.placa}
                            onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Modelo</label>
                        <input className="form-control" name="modelo" value={form.modelo}
                            onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Ano de fabricação</label>
                        <input className="form-control" name="anoFabricacao" type="number" value={form.anoFabricacao}
                            onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Cliente</label>
                        <select className="form-select" name="codCliente" value={form.codCliente}
                            onChange={handleChange} required>
                            <option value="">Selecione...</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.codCliente} value={cliente.codCliente}>
                                    {cliente.nomeCompleto}
                                </option>
                            ))}
                        </select>
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
                        <th>Placa</th>
                        <th>Modelo</th>
                        <th>Ano</th>
                        <th>Cliente</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {veiculos.map((veiculo) => (
                        <tr key={veiculo.codVeiculo}>
                            <td>{veiculo.placa}</td>
                            <td>{veiculo.modelo}</td>
                            <td>{veiculo.anoFabricacao}</td>
                            <td>{veiculo.nomeCliente}</td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-outline-primary me-1"
                                    onClick={() => handleEditar(veiculo)}>Editar</button>
                                <button className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleExcluir(veiculo)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Veiculos;
