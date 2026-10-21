class Cliente {
  constructor(codCliente, nomeCompleto, cpf, celular, email, qtdVeiculos) {
    this.codCliente = codCliente;
    this.nomeCompleto = nomeCompleto;
    this.cpf = cpf;
    this.celular = celular;
    this.email = email;
    this.qtdVeiculos = qtdVeiculos;
  }
}

module.exports = Cliente;
