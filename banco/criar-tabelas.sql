drop table if exists ordens_servico;
drop table if exists veiculos;
drop table if exists clientes;

create table clientes (
    cod_cliente   serial not null primary key,
    nome_completo varchar(120) not null,
    cpf           varchar(14) not null unique,
    celular       varchar(20),
    email         varchar(120)
);

create table veiculos (
    cod_veiculo    serial not null primary key,
    placa          varchar(8) not null unique,
    modelo         varchar(80) not null,
    ano_fabricacao integer,
    cod_cliente    integer not null,
    foreign key (cod_cliente) references clientes (cod_cliente) on delete cascade
);

create table ordens_servico (
    cod_ordem         serial not null primary key,
    descricao_servico varchar(200) not null,
    vlr_servico       numeric(10,2) not null default 0,
    check (vlr_servico >= 0),
    situacao          varchar(20) not null default 'Aberta',
    check (situacao in ('Aberta', 'Em andamento', 'Concluída')),
    dta_entrada       date,
    cod_veiculo       integer not null,
    foreign key (cod_veiculo) references veiculos (cod_veiculo) on delete cascade
);

insert into clientes (nome_completo, cpf, celular, email) values
('Maria Souza', '123.456.789-00', '(54) 99999-0000', 'maria@email.com'),
('João Pereira', '111.222.333-44', '(54) 98888-1111', 'joao@email.com');

insert into veiculos (placa, modelo, ano_fabricacao, cod_cliente) values
('ABC1D23', 'Onix', 2020, 1),
('XYZ9K88', 'Gol', 2015, 2);

insert into ordens_servico (descricao_servico, vlr_servico, situacao, dta_entrada, cod_veiculo) values
('Troca de óleo e filtros', 250.50, 'Aberta', current_date, 1),
('Revisão de freios', 480.00, 'Em andamento', current_date, 2);
