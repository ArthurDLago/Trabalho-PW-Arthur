const { Router } = require('express');
const {
  getClientes,
  getClientePorCodigo,
  addCliente,
  updateCliente,
  deleteCliente,
} = require('../controllers/clienteController');

const rotasClientes = new Router();

rotasClientes.route('/cliente')
  .get(getClientes)
  .post(addCliente)
  .put(updateCliente);

rotasClientes.route('/cliente/:codigo')
  .get(getClientePorCodigo)
  .delete(deleteCliente);

module.exports = { rotasClientes };
