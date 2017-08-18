var mongoose = require('mongoose');
var Curso = require('../models/curso');
var Alumno = require('../models/alumno');

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
        res.jsonp(curso);
    });
};

exports.updateCurso = function (req, res) {
    Curso.findById(req.params._id, function (err, curso) {

        curso.nombre = req.body.nombre;
        curso.descripcion = req.body.descripcion;
        curso.fechaInicio = req.body.fechaInicio;
        curso.fechaFin = req.body.fechaFin;
        curso.dias = req.body.dias;
        curso.horaInicio = req.body.horaInicio;
        curso.horaFin = req.body.horaFin;
        curso.cupo = req.body.cupo;

        curso.save(function (err) {
            if (err) return res.send(500, err.message);
            res.jsonp(curso);
        });

        Alumno.findOne({ 'curso.nombre': curso.nombre }, function (err, alumno) {
            if (alumno != null) {
                alumno.curso = curso;
                alumno.save(function (err) {
                    if (err) return console.log('Error al actualizar alumno');
                    console.log('Alumno de usuario: ' + usuario.username + ' actualizado');
                });
            }
        });

    });
};

exports.deleteCurso = function (req, res) {
    Curso.findById(req.params._id, function (err, curso) {

        Alumno.findOne({ 'curso.nombre': curso.nombre }, function (err, alumno) {
            if (alumno != null) {
                if (alumno.curso != null && alumno.curso.length > 0) {
                    alumno.curso.forEach(function (c) {
                        if (c._id == req.params._idCurso) {
                            var cursoIndex = alumno.curso.indexOf(c);
                            if (cursoIndex !== -1) {
                                alumno.curso.splice(cursoIndex, 1);
                                res.json(alumno.curso);
                            }
                        }
                        else {
                            res.json({ message: 'Curso no encontrado' });
                        }
                    });
                    alumno.save(function (err) {
                        if (err) return res.send(500, err.message);
                    });
                }
                else {
                    res.json({ message: 'No hay cursos asociados a este alumno' });
                }

            }
            else {
                res.json({ message: 'Alumno no encontrado' });
            }
        });

        curso.remove(function (err) {
            if (err) return res.send(500, err.message);
            res.json({ message: 'Curso eliminado' });
        })
    });
};
