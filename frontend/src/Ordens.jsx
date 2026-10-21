import { useEffect, useState } from 'react';
import { api, getMensagemErro } from './api';

const situacoes = ['Aberta', 'Em andamento', 'Concluída'];
const formVazio = {
    descricaoServico: '',
    vlrServico: '',
    situacao: 'Aberta',
    dtaEntrada: '',
    codVeiculo: '',
};

const formatarMoeda = (valor) =>
    Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatarData = (data) =>
    data ? data.split('-').reverse().join('/') : '';

const Ordens = () => {
    const [ordens, setOrdens] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [form, setForm] = useState(formVazio);
    const [codEditando, setCodEditando] = useState(null);
    const [erro, setErro] = useState('');

    const carregar = async () => {
        try {
            const resOrdens = await api.get('/ordem');
            const resVeiculos = await api.get('/veiculo');
            setOrdens(resOrdens.data);
            setVeiculos(resVeiculos.data);
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
        const ordem = {
            descricaoServico: form.descricaoServico,
            vlrServico: Number(form.vlrServico),
            situacao: form.situacao,
            dtaEntrada: form.dtaEntrada || null,
            codVeiculo: Number(form.codVeiculo),
        };
        try {
            if (codEditando) await api.put('/ordem', { codOrdem: codEditando, ...ordem });
            else await api.post('/ordem', ordem);
            handleCancelar();
            carregar();
        } catch (err) {
            setErro(getMensagemErro(err));
        }
    };

    const handleEditar = (ordem) => {
        setCodEditando(ordem.codOrdem);
        setForm({
            descricaoServico: ordem.descricaoServico,
            vlrServico: ordem.vlrServico,
            situacao: ordem.situacao,
            dtaEntrada: ordem.dtaEntrada ?? '',
            codVeiculo: ordem.codVeiculo,
        });
    };

    const handleExcluir = async (ordem) => {
        if (!window.confirm('Excluir esta ordem de serviço?')) return;
        try {
            await api.delete(`/ordem/${ordem.codOrdem}`);
            carregar();
        } catch (err) {
            setErro(getMensagemErro(err));
        }
    };

    return (
        <>
            <h1 className="h3 mb-3">Ordens de serviço</h1>

            {erro && <div className="alert alert-danger">{erro}</div>}

            <form onSubmit={handleSubmit} className="card card-body mb-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Descrição do serviço</label>
                        <input className="form-control" name="descricaoServico" value={form.descricaoServico}
                            onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Valor (R$)</label>
                        <input className="form-control" name="vlrServico" type="number" step="0.01"
                            value={form.vlrServico} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Situação</label>
                        <select className="form-select" name="situacao" value={form.situacao}
                            onChange={handleChange}>
                            {situacoes.map((situacao) => (
                                <option key={situacao}>{situacao}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Data de entrada</label>
                        <input className="form-control" name="dtaEntrada" type="date" value={form.dtaEntrada}
                            onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Veículo</label>
                        <select className="form-select" name="codVeiculo" value={form.codVeiculo}
                            onChange={handleChange} required>
                            <option value="">Selecione...</option>
                            {veiculos.map((veiculo) => (
                                <option key={veiculo.codVeiculo} value={veiculo.codVeiculo}>
                                    {veiculo.placa} - {veiculo.modelo}
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
                        <th>Serviço</th>
                        <th>Veículo</th>
                        <th>Valor</th>
                        <th>Situação</th>
                        <th>Entrada</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {ordens.map((ordem) => (
                        <tr key={ordem.codOrdem}>
                            <td>{ordem.descricaoServico}</td>
                            <td>{ordem.placaVeiculo}</td>
                            <td>{formatarMoeda(ordem.vlrServico)}</td>
                            <td>{ordem.situacao}</td>
                            <td>{formatarData(ordem.dtaEntrada)}</td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-outline-primary me-1"
                                    onClick={() => handleEditar(ordem)}>Editar</button>
                                <button className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleExcluir(ordem)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Ordens;
