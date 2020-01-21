const jwt = require('jsonwebtoken');

//===================
// verrificar token
//============

let verificaToken = (req, res, next) => {

    let token = req.get('token');
    console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();

    });
}


//===================
// verrificar roles
//==================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE' || 'EMPLOYE_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no tiene permisos para realizar esta tarea'
            }
        });
    }

}

module.exports = {
    verificaToken,
    verificaAdminRole
}