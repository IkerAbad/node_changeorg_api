'use strict'

var User = require('../models/user');
var bcrypt = require('bcryptjs');
const jwt = require("../services/jwt");

//routes
function home(req, res) {
    res.status(200).send({
        message: 'Test Action'
    });
}

function pruebas(req, res) {
    console.log(req.body)
    res.status(200).send({
        message: 'Test Action'
    });
}

function saveUser(req, res) {
    console.log("Hola!");
    var params = req.body;
    var user = new User();
    if (params.name && params.password && params.email) {
        user.name = params.name;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
//Control if duplicate users exist
        User.find({
            $or: [{
                email: user.email.toLowerCase()
            }
            ]
        }).then((users) => {
            console.log(users);
            if (users && users.length >= 1) {
                return res.status(400).send({
                    message: 'El usuario que intenta registrar ya existe'
                });
            } else {
//In case no duplicate users it will encrypt the password
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash( params.password, salt, function(err, hash) {
                        user.password=hash;
                        user.save().then((userStored)=> {
                                if(err){
                                    return res.status(500).send({
                                        message: 'Error en la petición'
                                    });
                                }
                                return res.status(200).send({
                                    message:"ok",
                                    user: userStored
                                });
                            }).catch((error=>{
                                res.status(500).send({
                                    message: error.message
                                });
                            }));
                    });
                });

            }
        }).catch((error=>{
            res.status(500).send({
                message: error.message
            });
        }));
    } else {
//without return if just one possible return
        res.status(200).send({
            message: 'Rellena todos los campos'
        });
    }
}

function getUsers(req, res) {
    //id of the authenticated user
    //var identity_user_id = req.user.sub;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    console.log(req);
    var items_per_page = 2;
    User.paginate({}, { page: page, limit: items_per_page }, function(err, users) {
        if (err) {
            return res.status(500).send({
                message: 'Error en la petición'
            });
        }
        if (!users) {
            return res.status(404).send({
                message: 'No hay usuarios disponibles'
            });
        }
        return res.status(200).send({
            users
        });
    });

}

function getUser(req, res) {
    const userId = req.user.sub; // Aquí se obtiene el ID del usuario a partir de los parámetros de la solicitud
    User.findById(userId)
        .then(user => {
            if (!user) {
                // Si no se encuentra un usuario con el ID especificado, se devuelve un error 404
                res.status(404).json({ message: 'No se encontró ningún usuario con ese ID' });
            } else {
                // Si se encuentra un usuario con el ID especificado, se devuelve el usuario en la respuesta
                res.json(user);
            }
        })
        .catch(error => {
            // Si se produce un error al buscar el usuario, se devuelve un error 500
            res.status(500).json({ message: 'Se produjo un error al buscar el usuario', error: error });
        });

}

function login(req,res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({
        email: email
    }).then((user) => {
        if(user){
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){
                    user.password = undefined;
                    res.status(200).send({
                        token: jwt.createToken(user)
                    });
                } else {
                    return res.status(404).send({
                        message: 'El usuario no se ha podido identificar correctamente'
                    });
                }
            });
        } else {
            return res.status(404).send({
                message: 'El usuario no se ha podido identificar'
            });
        }
    }).catch((error =>{
        res.status(500).send({
            message: error.message
        });
    }));
}

function updateUser(req, res) {
    var userId = req.user.sub;
    var update = req.body;
    delete update.password;
    User.findByIdAndUpdate(userId, update, {
        new: true
    }).then((userUpdated) => {
        return res.status(200).send({
            user: userUpdated
        });
    }).catch((error =>{
        res.status(500).send({
            message: error.message
        });
    }));
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    User.findByIdAndDelete(
         userId
).then((del) => {
        return res.status(200).send({
            message: 'Usuario eliminado correctamente'
        });
    }).catch((error =>{
        res.status(500).send({
            message: error.message
        });
    }));
}



module.exports = {
    home,
    pruebas,
    saveUser,
    getUsers,
    getUser,
    login,
    updateUser,
    deleteUser
}