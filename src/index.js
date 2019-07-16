const debug = require('debug')('server:debug');
const path = require('path');
const permissions = require('./permissions');

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import config from 'config';
import Lumie from "lumie";
import mongoose from 'mongoose';
const db = config.get('database');
console.log(db);

// conexão com o mongoDB
conectarMongoDB();

const app = express();

app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

Lumie.load(app, {
  verbose: process.env.NODE_ENV !== 'test',
  preURL: 'api',
  ignore: ['*.spec', '*.action'],
  permissions,
  controllers_path: path.join(__dirname, 'controllers')
});



const listen = app.listen(config.get('port'), () => {
  debug(`server is running on port ${config.get('port')} and in ${config.get('name')} mode`);
  console.log(`server is running on port ${config.get('port')} and in ${config.get('name')} mode`);
});

async function conectarMongoDB() {
    try{
        await mongoose.connect(db);
        console.log("Conectado ao MongoDB");
        
    } catch(err) {
        console.log(err);
        console.log('MongoDB não conectado');
    };
}

module.exports = app;
module.exports.port = listen.address().port;
