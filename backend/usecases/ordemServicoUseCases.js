const { pool } = require('../config');
const OrdemServico = require('../entities/ordemServico');
const { traduzirErro } = require('./traduzirErro');

const RETORNO = `cod_ordem, descricao_servico, vlr_servico, situacao,
                 TO_CHAR(dta_entrada, 'YYYY-MM-DD') AS dta_entrada, cod_veiculo`;

const paraOrdem = (row) =>
  new OrdemServico(
    row.cod_ordem, row.descricao_servico, row.vlr_servico, row.situacao,
    row.dta_entrada, row.cod_veiculo, row.placa
  );

const getOrdensDB = async () => {
  try {
    const { rows } = await pool.query(
      `SELECT o.cod_ordem, o.descricao_servico, o.vlr_servico, o.situacao,
              TO_CHAR(o.dta_entrada, 'YYYY-MM-DD') AS dta_entrada, o.cod_veiculo, v.placa
       FROM ordens_servico o
       JOIN veiculos v ON v.cod_veiculo = o.cod_veiculo
       ORDER BY o.cod_ordem`
    );
    return rows.map(paraOrdem);
  } catch (err) {
    throw new Error('Erro ao consultar as ordens de serviço: ' + traduzirErro(err));
  }
};

const getOrdemPorCodigoDB = async (codOrdem) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${RETORNO} FROM ordens_servico WHERE cod_ordem = $1`,
      [codOrdem]
    );
    if (rows.length === 0) {
      throw new Error(`Nenhum registro encontrado com o código ${codOrdem}`);
    }
    return paraOrdem(rows[0]);
  } catch (err) {
    throw new Error('Erro ao recuperar a ordem de serviço: ' + traduzirErro(err));
  }
};

const addOrdemDB = async (body) => {
  try {
    const { descricaoServico, vlrServico, situacao, dtaEntrada, codVeiculo } = body;
    const { rows } = await pool.query(
      `INSERT INTO ordens_servico (descricao_servico, vlr_servico, situacao, dta_entrada, cod_veiculo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${RETORNO}`,
      [descricaoServico, vlrServico, situacao, dtaEntrada, codVeiculo]
    );
    return paraOrdem(rows[0]);
  } catch (err) {
    throw new Error('Erro ao inserir a ordem de serviço: ' + traduzirErro(err));
  }
};

const updateOrdemDB = async (body) => {
  try {
    const { codOrdem, descricaoServico, vlrServico, situacao, dtaEntrada, codVeiculo } = body;
    const { rows } = await pool.query(
      `UPDATE ordens_servico
       SET descricao_servico = $2, vlr_servico = $3, situacao = $4, dta_entrada = $5, cod_veiculo = $6
       WHERE cod_ordem = $1
       RETURNING ${RETORNO}`,
      [codOrdem, descricaoServico, vlrServico, situacao, dtaEntrada, codVeiculo]
    );
    if (rows.length === 0) {
      throw new Error(`Nenhum registro encontrado com o código ${codOrdem} para ser alterado`);
    }
    return paraOrdem(rows[0]);
  } catch (err) {
    throw new Error('Erro ao alterar a ordem de serviço: ' + traduzirErro(err));
  }
};

const deleteOrdemDB = async (codOrdem) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM ordens_servico WHERE cod_ordem = $1', [codOrdem]);
    if (rowCount === 0) {
      throw new Error(`Nenhum registro encontrado com o código ${codOrdem} para ser removido`);
    }
    return 'Ordem de serviço removida com sucesso';
  } catch (err) {
    throw new Error('Erro ao remover a ordem de serviço: ' + traduzirErro(err));
  }
};

module.exports = {
  getOrdensDB,
  getOrdemPorCodigoDB,
  addOrdemDB,
  updateOrdemDB,
  deleteOrdemDB,
};
