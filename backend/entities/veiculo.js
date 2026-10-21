class Veiculo {
  constructor(codVeiculo, placa, modelo, anoFabricacao, codCliente, nomeCliente) {
    this.codVeiculo = codVeiculo;
    this.placa = placa;
    this.modelo = modelo;
    this.anoFabricacao = anoFabricacao;
    this.codCliente = codCliente;
    this.nomeCliente = nomeCliente;
  }
}

module.exports = Veiculo;
