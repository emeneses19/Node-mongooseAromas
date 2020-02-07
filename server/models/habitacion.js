const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let habitacionSchema = new Schema({
    numero: {
        type: String,
        required: [true, 'El numero es necesario']
    },
    precionoche: {
        type: Number,
        required: [true, 'El precio por noche es necesario'],

    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es necesario']
    },
    img: {
        type: String,
        required: false
    },
    estado: {
        type: Boolean,
        default: true
    },
    disponible: {
        type: Boolean,
        default: true
    },
    tipohabitacion: {
        type: Schema.Types.ObjectId,
        ref: 'Tipohabitacion',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },

});
habitacionSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
module.exports = mongoose.model('Habitacion', habitacionSchema);