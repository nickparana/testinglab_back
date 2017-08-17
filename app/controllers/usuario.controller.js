var mongoose = require('mongoose');
var Usuario = require('../models/usuario');
var Alumno = require('../models/alumno');

exports.findAllUsuarios = function (req, res) {
    Usuario.find(function (err, usuarios) {
        if (err)
            res.send(err);
        res.json(usuarios);
    });
};

exports.findUsuarioById = function (req, res) {
    Usuario.findById(req.params._id, function (err, usuario) {
        if (err)
            res.send(err);
        res.json(usuario);
    });
}

exports.saveUsuario = function (req, res) {
    var usuario = new Usuario();
    usuario.username = req.body.username;
    usuario.password = req.body.password;
    usuario.nombre = req.body.nombre;
    usuario.apellido = req.body.apellido;
    usuario.dni = req.body.dni;
    usuario.email = req.body.email;

    usuario.save(function (err) {
        if (err)
            res.send(err);
        res.json({ message: 'Usuario creado' });
    });
};

exports.updateUsuario = function (req, res) {
    Usuario.findById(req.params._id, function (err, usuario) {


        usuario.nombre = req.body.nombre;
        usuario.apellido = req.body.apellido;
        usuario.dni = req.body.dni;
        usuario.email = req.body.email;

        if (usuario.password !== "") {
            usuario.password = req.body.password;
        }

        usuario.save(function (err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(usuario);
            // res.json(usuario);
        });

        // Update del usuario contenido en el alumno
        Alumno.findOne({ 'usuario.username': usuario.username }, function (err, alumno) {
            alumno.usuario = usuario;
            alumno.save(function (err) {
                if (err) return console.log('Error al actualizar alumno');
                console.log('Usuario: ' + usuario.username + ' nested en Alumno: ' + alumno._id + ' actualizado');
            });
        });
    });
};

exports.deleteUsuario = function (req, res) {
    Usuario.findById(req.params._id, function (err, usuario) {
        usuario.remove(function (err) {
            if (err) return res.send(500, err.message);
            // res.status(200);
            res.json({ message: 'Usuario eliminado' });
        })

        Alumno.findOne({ 'usuario.username': usuario.username }, function (err, alumno) {
            alumno.usuario = {};
            alumno.save(function (err) {
                if (err) return console.log('Error al actualizar alumno');
                console.log('Usuario: ' + usuario.username + ' nested en Alumno: ' + alumno._id + ' actualizado');
            });
        });
    });
};




