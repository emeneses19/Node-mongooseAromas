// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Vencimiento del token
// ============================

process.env.CADUCIDAD_TOKEN = '48h';

// ============================
//  SEED de autenticacion
//60 seg, 60 m., 24 h., 30d.
// ============================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



// ============================
// Base d edatos
// ============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/aromas';

} else {
    urlDB = 'mongodb+srv://aromas:aromas@cluster0-qwt3v.mongodb.net/test?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB;