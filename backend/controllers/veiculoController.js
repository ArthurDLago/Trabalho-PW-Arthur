const {
  getVeiculosDB,
  getVeiculoPorCodigoDB,
  addVeiculoDB,
  updateVeiculoDB,
  deleteVeiculoDB,
} = require('../usecases/veiculoUseCases');

const getVeiculos = async (request, response) => {
  try {
    const veiculos = await getVeiculosDB();
    response.status(200).json(veiculos);
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

const getVeiculoPorCodigo = async (request, response) => {
  try {
    const veiculo = await getVeiculoPorCodigoDB(parseInt(request.params.codigo));
    response.status(200).json(veiculo);
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

const addVeiculo = async (request, response) => {
  try {
    const veiculo = await addVeiculoDB(request.body);
    response.status(200).json({ status: 'success', message: 'Veículo criado', objeto: veiculo });
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

const updateVeiculo = async (request, response) => {
  try {
    const veiculo = await updateVeiculoDB(request.body);
    response.status(200).json({ status: 'success', message: 'Veículo alterado', objeto: veiculo });
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

const deleteVeiculo = async (request, response) => {
  try {
    const mensagem = await deleteVeiculoDB(parseInt(request.params.codigo));
    response.status(200).json({ status: 'success', message: mensagem });
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  getVeiculos,
  getVeiculoPorCodigo,
  addVeiculo,
  updateVeiculo,
  deleteVeiculo,
};
