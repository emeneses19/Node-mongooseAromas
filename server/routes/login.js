const express = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', async (req, res) => {
  try {
    let body = req.body;
    const usuarioDB = Usuario.findOne({ email: body.email });

    if (!usuarioDB) {
      return res.status(400).json('(Usuario) o contraseña incorrecto');
    }

    if (body.password != usuarioDB.password) {
      return res.status(400).json('(Usuario) o contraseña incorrecto');
    }

    res.json(usuarioDB);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = app;
