class OrdemServico {
  constructor(codOrdem, descricaoServico, vlrServico, situacao, dtaEntrada, codVeiculo, placaVeiculo) {
    this.codOrdem = codOrdem;
    this.descricaoServico = descricaoServico;
    this.vlrServico = Number(vlrServico);
    this.situacao = situacao;
    this.dtaEntrada = dtaEntrada;
    this.codVeiculo = codVeiculo;
    this.placaVeiculo = placaVeiculo;
  }
}

module.exports = OrdemServico;
