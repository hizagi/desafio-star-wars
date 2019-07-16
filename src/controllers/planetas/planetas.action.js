import PlanetaModel from '../../models/planetas';
import axios from 'axios';

module.exports.criar = async (req, res) => {
  const planeta = new PlanetaModel(req.body);
  try {
    const resultado = await planeta.save();
    res.status(200).json({ id: resultado._id });
  } catch (err) {
    res.status(500).json({ msg: 'Ocorreu um erro não foi possível cadastrar o planeta' });
  }
};

module.exports.buscarPorId = async (req, res) => {
  try {
    let resultado = await PlanetaModel.findById(req.params.id, '_id nome clima terreno').lean();

    if (!resultado) {
      resultado = { msg: 'Nenhum registro encontrado' };
      res.status(200).json(resultado);
    } else {
      try {
        const busca_filmes = await buscarQuantidadeAparicoes(resultado.nome, {
          timeout: 3000
        });
        resultado.quantidade_filmes = busca_filmes[0].films.length;
        res.status(200).json(resultado);
      } catch (err) {
        res.status(200).json(resultado);
      }
    }
  } catch (err) {
    res.status(500).json({ msg: 'Ocorreu um erro não foi possível encontrar o planeta' });
  }
};

module.exports.buscarTodos = async (req, res) => {
  let filtro = {};

  if (Object.keys(req.query).length) {
    filtro = { nome: req.query.busca };
  }

  try {
    let resultado = await PlanetaModel.find(filtro)
      .select('_id nome clima terreno')
      .lean();
    if (!resultado.length) {
      resultado = { msg: 'Nenhum registro encontrado' };
      res.status(200).json(resultado);
    } else {
      resultado = resultado.map(async planeta => {
        try {
          const busca_filmes = await buscarQuantidadeAparicoes(planeta.nome);
          if (busca_filmes.length) {
            planeta.quantidade_filmes = busca_filmes[0].films.length;
          }
          return planeta;
        } catch (err) {
          return planeta;
        }
      });
      resultado = await Promise.all(resultado);
      res.status(200).json(resultado);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Ocorreu um erro não foi possível listar os planetas' });
  }
};

module.exports.removerPlaneta = async (req, res) => {
  try {
    await PlanetaModel.deleteOne({ _id: req.params.id });
    res.status(200).json({msg: 'Planeta removido com sucesso'});
  } catch (err) {
    res.status(500).json({ msg: 'Ocorreu um erro não foi possível remover o planeta' });
  }
};

const buscarQuantidadeAparicoes = async nome_planeta => {
  try {
    const resultado = await axios.get(`https://swapi.co/api/planets/?search=${nome_planeta}`);
    return resultado.data.results;
  } catch (err) {
    console.log(err);
  }
};
