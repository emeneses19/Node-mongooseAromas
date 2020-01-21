// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

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