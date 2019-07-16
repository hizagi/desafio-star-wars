const { criar, buscarPorId, buscarTodos, removerPlaneta } = require('./planetas.action');

module.exports = {
  '/': {
    post: {
      action: criar,
      level: 'public'
    },
    get: {
      action: buscarTodos,
      level: 'public'
    }
  },
  '/:id': {
    get: {
      action: buscarPorId,
      level: 'public'
    },
    delete: {
      action: removerPlaneta,
      level: 'public'
    }
  }
};
