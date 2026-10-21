const traduzirErro = (err) => {
  if (err.code === '23505') return 'CPF ou placa já cadastrados';
  if (err.code === '23503') return 'Cliente ou veículo informado não existe';
  if (err.code === '23502') return 'Preencha todos os campos obrigatórios';
  if (err.code === '23514') return 'Valor inválido (situação ou valor do serviço)';
  return err.message;
};

module.exports = { traduzirErro };
