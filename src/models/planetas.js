import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Planeta = new Schema({
  nome: String,
  clima: String,
  terreno: String
});

// Compile model from schema
module.exports = mongoose.model('planetas', Planeta);
