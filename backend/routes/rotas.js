const { Router } = require('express');
const { rotasClientes } = require('./rotasClientes');
const { rotasVeiculos } = require('./rotasVeiculos');
const { rotasOrdensServico } = require('./rotasOrdensServico');

const rotas = new Router();

rotas.use(rotasClientes);
rotas.use(rotasVeiculos);
rotas.use(rotasOrdensServico);

module.exports = rotas;
