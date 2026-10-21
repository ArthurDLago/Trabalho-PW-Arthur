const { pool } = require('../config');
const Cliente = require('../entities/cliente');
const { traduzirErro } = require('./traduzirErro');

const paraCliente = (row) =>
  new Cliente(row.cod_cliente, row.nome_completo, row.cpf, row.celular, row.email, row.qtd_veiculos);

const getClientesDB = async () => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*, COUNT(v.cod_veiculo)::int AS qtd_veiculos
       FROM clientes c
       LEFT JOIN veiculos v ON v.cod_cliente = c.cod_cliente
       GROUP BY c.cod_cliente
       ORDER BY c.nome_completo`
    );
    return rows.map(paraCliente);
  } catch (err) {
    throw new Error('Erro ao consultar os clientes: ' + traduzirErro(err));
  }
};

const getClientePorCodigoDB = async (codCliente) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clientes WHERE cod_cliente = $1', [codCliente]);
    if (rows.length === 0) {
      throw new Error(`Nenhum registro encontrado com o código ${codCliente}`);
    }
    return paraCliente(rows[0]);
  } catch (err) {
    throw new Error('Erro ao recuperar o cliente: ' + traduzirErro(err));
  }
};

const addClienteDB = async (body) => {
  try {
    const { nomeCompleto, cpf, celular, email } = body;
    const { rows } = await pool.query(
      `INSERT INTO clientes (nome_completo, cpf, celular, email)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nomeCompleto, cpf, celular, email]
    );
    return paraCliente(rows[0]);
  } catch (err) {
    throw new Error('Erro ao inserir o cliente: ' + traduzirErro(err));
  }
};

const updateClienteDB = async (body) => {
  try {
    const { codCliente, nomeCompleto, cpf, celular, email } = body;
    const { rows } = await pool.query(
      `UPDATE clientes
       SET nome_completo = $2, cpf = $3, celular = $4, email = $5
       WHERE cod_cliente = $1
       RETURNING *`,
      [codCliente, nomeCompleto, cpf, celular, email]
    );
    if (rows.length === 0) {
      throw new Error(`Nenhum registro encontrado com o código ${codCliente} para ser alterado`);
    }
    return paraCliente(rows[0]);
  } catch (err) {
    throw new Error('Erro ao alterar o cliente: ' + traduzirErro(err));
  }
};

const deleteClienteDB = async (codCliente) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM clientes WHERE cod_cliente = $1', [codCliente]);
    if (rowCount === 0) {
      throw new Error(`Nenhum registro encontrado com o código ${codCliente} para ser removido`);
    }
    return 'Cliente removido com sucesso';
  } catch (err) {
    throw new Error('Erro ao remover o cliente: ' + traduzirErro(err));
  }
};

module.exports = {
  getClientesDB,
  getClientePorCodigoDB,
  addClienteDB,
  updateClienteDB,
  deleteClienteDB,
};
