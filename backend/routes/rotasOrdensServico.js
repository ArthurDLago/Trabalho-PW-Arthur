const { Router } = require('express');
const {
  getOrdens,
  getOrdemPorCodigo,
  addOrdem,
  updateOrdem,
  deleteOrdem,
} = require('../controllers/ordemServicoController');

const rotasOrdensServico = new Router();

rotasOrdensServico.route('/ordem')
  .get(getOrdens)
  .post(addOrdem)
  .put(updateOrdem);

rotasOrdensServico.route('/ordem/:codigo')
  .get(getOrdemPorCodigo)
  .delete(deleteOrdem);

module.exports = { rotasOrdensServico };
