const mongoose = require('mongoose');
//Declarando el esquema
let Schema = mongoose.Schema;

let reservaSchema = new Schema({
    fechainicio: {
        type: Date,
        required: [true, 'Fecha inicio es obligatorio ']
    },
    fechafin: {
        type: Date,
        required: [true, 'Fecha fin es obligatorio ']
    },
    fechareserva: {
        type: Date
    },
    estado: {
        type: String,
        required: [true, 'estado es necesario']
    },
    reservaHabitacion: [{
            habitacion: {
                type: Schema.Types.ObjectId,
                ref: 'Habitacion'
            },
        },
        {
            totalPagar: {
                type: Number,
                required: true
            }
        }
    ],

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    }
});
module.exports = mongoose.model('Reserva', reservaSchema);