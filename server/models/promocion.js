const mongoose = require('mongoose');


//Declarando el esquema
let Schema = mongoose.Schema;
//Definir el esquema  --> con los datos que va a tener la coleccion
let promocionSchema = new Schema({
    fechainicio: {
        type: Date,
        required: [true, 'Fecha inicio es obligatorio ']
    },
    fechafin: {
        type: Date,
        required: [true, 'Fecha fin es obligatorio ']
    },
    precioprom: {
        type: Number,
        required: [true, 'El precio por noche es necesario'],
    },
    disponible: {
        type: Boolean,
        default: true
    },

    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    tipohabitacion: {
        type: Schema.Types.ObjectId,
        ref: 'Tipohabitacion',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});



module.exports = mongoose.model('Promocion', promocionSchema);