const mongoose = require('mongoose');

//Para validar un dato unico
const uniqueValidator = require('mongoose-unique-validator');


//Declarando los nombres de habitaciones validas
// let tipohabValidos = {
//     values: ['HABITACION SIMPLE', 'HABITACION DOBLE', 'HABITACION MATRIMONIAL'],
//     message: '{VALUE} no es un tipo de habitacion válido'
// };


//Declarando el esquema
let Schema = mongoose.Schema;
//Definir el esquema  --> con los datos que va a tener la coleccion
let tipohabitacionSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es obligatorio ']
    },
    descripcion: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


tipohabitacionSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Tipohabitacion', tipohabitacionSchema);