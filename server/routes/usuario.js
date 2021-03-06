const express = require('express');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario', async (req, res) => {
  try {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    const users = await Usuario.find(
      { estado: true },
      'nombre apellido email role estado google img'
    )
      .skip(desde)
      .limit(limite);

    const conteo = await Usuario.count({ estado: true });

    res.json({ ok: true, users, cuantos: conteo });
    
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
});

app.post('/usuario', (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    DNI: body.nroDoc,
    nombres: body.nombres,
    apellidos: body.apellidos,
    email: body.email,
    password: body.password,
    telefono: body.telefono,
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status().json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});
app.put('/usuario/:id', (req, res) => {
  //Obteniendo el id
  let id = req.params.id;
  //Validando para actulizar datos los cuales van a permitir actualizar

  let body = _.pick(req.body, [
    'nombres',
    'apellidos',
    'email',
    'img',
    'role',
    'estado',
    'telefono',
    'tipoDoc',
    'nroDoc'
  ]);
  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB
      });
    }
  );
  // res.json({
  //     id
  // });
});

app.delete('/usuario/:id', (req, res) => {
  let id = req.params.id;
  //deje de existir el rsgstro
  //Borra definitivamente
  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  //     if (err) {
  //         return res.status(400).json({
  //             ok: false,
  //             err
  //         });
  //     }
  //     if (usuarioBorrado === null) {
  //         return res.status(400).json({
  //             ok: false,
  //             err: {
  //                 message: 'El usuario no existe'
  //             }
  //         });
  //     }
  //     res.json({
  //         ok: true,
  //         usuario: usuarioBorrado
  //     })
  // });

  let cambiaEstado = {
    estado: false
  };
  Usuario.findByIdAndUpdate(
    id,
    cambiaEstado,
    { new: true },
    (err, usuarioBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      if (usuarioBorrado === null) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El usuario no existe'
          }
        });
      }
      res.json({
        ok: true,
        usuario: usuarioBorrado
      });
    }
  );
});
module.exports = app;
