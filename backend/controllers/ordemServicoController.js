const {
  getOrdensDB,
  getOrdemPorCodigoDB,
  addOrdemDB,
  updateOrdemDB,
  deleteOrdemDB,
} = require('../usecases/ordemServicoUseCases');

const getOrdens = async (request, response) => {
  try {
    const ordens = await getOrdensDB();
    response.status(200).json(ordens);
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

const getOrdemPorCodigo = async (request, response) => {
  try {
    const ordem = await getOrdemPorCodigoDB(parseInt(request.params.codigo));
    response.status(200).json(ordem);
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

const addOrdem = async (request, response) => {
  try {
    const ordem = await addOrdemDB(request.body);
    response.status(200).json({ status: 'success', message: 'Ordem de serviço criada', objeto: ordem });
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

const updateOrdem = async (request, response) => {
  try {
    const ordem = await updateOrdemDB(request.body);
    response.status(200).json({ status: 'success', message: 'Ordem de serviço alterada', objeto: ordem });
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

const deleteOrdem = async (request, response) => {
  try {
    const mensagem = await deleteOrdemDB(parseInt(request.params.codigo));
    response.status(200).json({ status: 'success', message: mensagem });
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  getOrdens,
  getOrdemPorCodigo,
  addOrdem,
  updateOrdem,
  deleteOrdem,
};
