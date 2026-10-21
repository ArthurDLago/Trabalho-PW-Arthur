const {
  getClientesDB,
  getClientePorCodigoDB,
  addClienteDB,
  updateClienteDB,
  deleteClienteDB,
} = require('../usecases/clienteUseCases');

const getClientes = async (request, response) => {
  try {
    const clientes = await getClientesDB();
    response.status(200).json(clientes);
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

const getClientePorCodigo = async (request, response) => {
  try {
    const cliente = await getClientePorCodigoDB(parseInt(request.params.codigo));
    response.status(200).json(cliente);
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

const addCliente = async (request, response) => {
  try {
    const cliente = await addClienteDB(request.body);
    response.status(200).json({ status: 'success', message: 'Cliente criado', objeto: cliente });
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

const updateCliente = async (request, response) => {
  try {
    const cliente = await updateClienteDB(request.body);
    response.status(200).json({ status: 'success', message: 'Cliente alterado', objeto: cliente });
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

const deleteCliente = async (request, response) => {
  try {
    const mensagem = await deleteClienteDB(parseInt(request.params.codigo));
    response.status(200).json({ status: 'success', message: mensagem });
  } catch (err) {
    response.status(400).json({ status: 'error', message: err.message });
  }
};

module.exports = {
  getClientes,
  getClientePorCodigo,
  addCliente,
  updateCliente,
  deleteCliente,
};
