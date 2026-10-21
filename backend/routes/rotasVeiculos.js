const { Router } = require('express');
const {
  getVeiculos,
  getVeiculoPorCodigo,
  addVeiculo,
  updateVeiculo,
  deleteVeiculo,
} = require('../controllers/veiculoController');

const rotasVeiculos = new Router();

rotasVeiculos.route('/veiculo')
  .get(getVeiculos)
  .post(addVeiculo)
  .put(updateVeiculo);

rotasVeiculos.route('/veiculo/:codigo')
  .get(getVeiculoPorCodigo)
  .delete(deleteVeiculo);

module.exports = { rotasVeiculos };
