"use strict";

var User = require("../models/user"); // load the model

//routes
/*
function home(req, res) {
  res.status(200).send({
    message: "Hello world!",
  });
}

function pruebas(req, res) {
  console.log(req.body);
  res.status(200).send({
    message: "Test action",
  });
}
*/
function saveUser(req, res) {
  var params = req.body;
  var user = new User();
  if (params.name && params.password && params.email) {
    user.name = params.name;
    user.email = params.email;
    user.role = "ROLE_USER";
    user.image = null;

    //Control if duplicate users exist
    User.find({
      $or: [
        {
          email: user.email.toLowerCase(),
        },
      ],
    }).exec((err, users) => {
      console.log(users);
      if (err) {
        res.status(500).send({
          message: "Error en la petición",
        });
      }
      if (users && users.length >= 1) {
        return res.status(400).send({
          message: "El usuario que intenta registrar ya existe",
        });
      } else {
        //In case no duplicate users it will encrypt the password
        bcrypt.hash(params.password, null, null, (err, hash) => {
          user.password = hash;
          user.save((err, userStored) => {
            //o tendrá un error o un usuario guardado
            if (err) {
              return res.status(500).send({
                message: "Error al guardar el usuario",
              });
            }
            if (userStored) {
              res.status(200).send({
                message: "User successfully registered",
                user: userStored,
              });
            } else {
              res.status(404).send({
                message: "No se ha registrado el usuario",
              });
            }
          });
        });
      }
    });
  } else {
    //without return if just one possible return
    res.status(200).send({
      message: "Rellena todos los campos",
    });
  }
}

function findAllUsers(req, res) {
  //id of the authenticated user
  //var identity_user_id = req.user.sub;
  var page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  var items_per_page = 5;
  User.find()
    .sort("_id")
    .paginate(page, items_per_page, (err, users, total) => {
      if (err) {
        return res.status(500).send({
          message: "Error en la petición",
        });
      }
      if (!users) {
        return res.status(404).send({
          message: "No hay usuarios disponibles",
        });
      }
      return res.status(200).send({
        users,
        pages: Math.ceil(total / items_per_page),
      });
    });
}

function deleteUser(req, res) {
  var userId = req.user.sub;
  User.find({
    _id: userId,
  }).remove((err) => {
    if (err) {
      return res.status(500).send({
        message: "Error al borrar el usuario",
      });
    }
    return res.status(200).send({
      message: "Usuario eliminado correctamente",
    });
  });
}

// exportar en forma de objeto, así están disponibles estas dos funciones fuera de este fichero
module.exports = {
  //home,
  //pruebas,
  saveUser,
  findAllUsers,
  deleteUser
};
