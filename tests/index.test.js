import { expect } from 'chai';
import request from 'supertest';
import config from 'config';
import server from '../src/index';

describe('Server', () => {
  it('Testa se o servidor está executando na porta correta', async () => {
    expect(server.port).to.equal(config.get('port'));
  });
});

describe('Planetas', () => {
  it('Testa a Criação de um planeta', async () => {
    const resultado = await request(server)
      .post('/api/planetas')
      .send({
        nome: 'Yavin IV',
        terreno: 'Floresta Tropical, Selva',
        climate: 'temperado, tropical'
      })
      .set('Accept', 'application/json');
    expect(200).to.equal(resultado.status);
  });
  it('Testa a Listagem de planetas', async () => {
    const resultado = await request(server)
      .get('/api/planetas')
      .set('Accept', 'application/json');
    expect(200).to.equal(resultado.status);
  });
  it('Testa a Listagem de um planeta pelo id e se possui a quantidade de filmes correta', async () => {
    const resultado = await request(server)
      .get('/api/planetas/5d2a451dbb9d590e7166026e')
      .set('Accept', 'application/json');
    expect(200).to.equal(resultado.status);
    expect(5).to.equal(resultado.body.quantidade_filmes);
  });
});
