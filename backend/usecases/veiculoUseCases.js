const { pool } = require('../config');
const Veiculo = require('../entities/veiculo');
const { traduzirErro } = require('./traduzirErro');

const paraVeiculo = (row) =>
  new Veiculo(row.cod_veiculo, row.placa, row.modelo, row.ano_fabricacao, row.cod_cliente, row.nome_completo);

const getVeiculosDB = async () => {
  try {
    const { rows } = await pool.query(
      `SELECT v.*, c.nome_completo
       FROM veiculos v
       JOIN clientes c ON c.cod_cliente = v.cod_cliente
       ORDER BY v.placa`
    );
    return rows.map(paraVeiculo);
  } catch (err) {
    throw new Error('Erro ao consultar os veículos: ' + traduzirErro(err));
  }
};

const getVeiculoPorCodigoDB = async (codVeiculo) => {
  try {
    const { rows } = await pool.query('SELECT * FROM veiculos WHERE cod_veiculo = $1', [codVeiculo]);
    if (rows.length === 0) {
      throw new Error(`Nenhum registro encontrado com o código ${codVeiculo}`);
    }
    return paraVeiculo(rows[0]);
  } catch (err) {
    throw new Error('Erro ao recuperar o veículo: ' + traduzirErro(err));
  }
};

const addVeiculoDB = async (body) => {
  try {
    const { placa, modelo, anoFabricacao, codCliente } = body;
    const { rows } = await pool.query(
      `INSERT INTO veiculos (placa, modelo, ano_fabricacao, cod_cliente)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [placa, modelo, anoFabricacao, codCliente]
    );
    return paraVeiculo(rows[0]);
  } catch (err) {
    throw new Error('Erro ao inserir o veículo: ' + traduzirErro(err));
  }
};

const updateVeiculoDB = async (body) => {
  try {
    const { codVeiculo, placa, modelo, anoFabricacao, codCliente } = body;
    const { rows } = await pool.query(
      `UPDATE veiculos
       SET placa = $2, modelo = $3, ano_fabricacao = $4, cod_cliente = $5
       WHERE cod_veiculo = $1
       RETURNING *`,
      [codVeiculo, placa, modelo, anoFabricacao, codCliente]
    );
    if (rows.length === 0) {
      throw new Error(`Nenhum registro encontrado com o código ${codVeiculo} para ser alterado`);
    }
    return paraVeiculo(rows[0]);
  } catch (err) {
    throw new Error('Erro ao alterar o veículo: ' + traduzirErro(err));
  }
};

const deleteVeiculoDB = async (codVeiculo) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM veiculos WHERE cod_veiculo = $1', [codVeiculo]);
    if (rowCount === 0) {
      throw new Error(`Nenhum registro encontrado com o código ${codVeiculo} para ser removido`);
    }
    return 'Veículo removido com sucesso';
  } catch (err) {
    throw new Error('Erro ao remover o veículo: ' + traduzirErro(err));
  }
};

module.exports = {
  getVeiculosDB,
  getVeiculoPorCodigoDB,
  addVeiculoDB,
  updateVeiculoDB,
  deleteVeiculoDB,
};
