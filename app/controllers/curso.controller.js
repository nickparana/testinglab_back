var mongoose = require('mongoose');
var Curso = require('../models/curso');

exports.findAllCursos = function (req, res) {
    Curso.find(function (err, cursos) {
        if (err)
            res.send(err);
        res.json(cursos);
    });
};

exports.findCursoById = function (req, res) {
    Curso.findById(req.params._id, function (err, curso) {
        if (err)
            res.send(err);
        res.json(curso);
    });
};

exports.saveCurso = function (req, res) {
    var curso = new Curso();

    curso.nombre = req.body.nombre;
    curso.descripcion = req.body.descripcion;
    curso.fechaInicio = req.body.fechaInicio;
    curso.fechaFin = req.body.fechaFin;
    curso.dias = req.body.dias;
    curso.horaInicio = req.body.horaInicio;
    curso.horaFin = req.body.horaFin;
    curso.cupo = req.body.cupo;

    curso.save(function (err) {
        if (err)
            res.send(err);
        res.json({ message: 'Curso creado' });
    });
};

exports.updateCurso = function (req, res) {
    Curso.findById(req.params._id, function (err, curso) {

        curso.nombre = req.body.nombre;
        curso.descripcion = req.body.descripcion;
        curso.fechaInicio = req.body.fechaInicio;
        curso.fechaFin = req.body.fechaFin;
        curso.dia = req.body.dia;
        curso.horario = req.body.horario;
        curso.cupo = req.body.cupo;

        curso.save(function (err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(curso);
        });

         Alumno.findOne({ 'curso.nombre': curso.nombre }, function (err, curso) {
            alumno.curso = curso;
            alumno.save(function (err) {
                if (err) return console.log('Error al actualizar alumno');
                console.log('Alumno de usuario: ' + usuario.username + ' actualizado');
            });
        });

    });
};

exports.deleteCurso = function (req, res) {
    Curso.findById(req.params._id, function (err, curso) {
        curso.remove(function (err) {
            if (err) return res.send(500, err.message);
            res.json({ message: 'Curso eliminado' });
        })

        Alumno.findOne({ 'curso.nombre': curso.nombre }, function (err, curso) {
            alumno.curso = {};
            alumno.save(function (err) {
                if (err) return console.log('Error al actualizar alumno');
                console.log('Alumno de usuario: ' + usuario.username + ' actualizado');
            });
        });
    });
};
