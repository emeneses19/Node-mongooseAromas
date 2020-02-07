const express = require('express');

const Reserva = require('../models/reserva');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

// app.post('/reservas', [verificaToken], (req, res) => {
//     // grabar el usuario

//     let body = req.body;

//     let reserva = new Reserva({
//         usuario: req.usuario._id,
//         fechainicio: body.fechainicio,
//         fechafin: body.fechafin,
//         voucher: body.voucher,
//         payloadVisa: body.payloadVisa,
//         codigoReserva: body.codigoReserva,
//         habitacion: body.habitacion
//     });

//     habitacion.save((err, reservaDB) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err
//             });
//         }

//         res.status(201).json({
//             ok: true,
//             reserva: reservaDB
//         });
//     });
// });

module.exports = app;