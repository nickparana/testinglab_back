var mongoose = require('mongoose');
var Alumno = require('../models/alumno');
var Usuario = require('../models/usuario');
var Curso = require('../models/curso');

exports.findAllAlumnos = function (req, res) {
    Alumno.find(function (err, alumnos) {
        if (err)
            res.send(err);
        res.json(alumnos);
    });
};

exports.findAlumnoById = function (req, res) {
    Alumno.findById(req.params._id, function (err, alumno) {
        if (err)
            res.send(err);
        res.json(alumno);
    });
}

exports.findAlumnoByUsername = function (req, res) {
    Alumno.findOne({ 'usuario.username': req.params.username }, function (err, alumno) {
        if (err)
            res.send(err);
        if (alumno != null) {
            res.json(alumno);
        }
    });
}

exports.saveAlumno = function (req, res) {
    var alumno = new Alumno();

    alumno.edad = req.body.edad;
    alumno.regular = req.body.regular;
    alumno.usuario = req.body.usuario;

    alumno.save(function (err) {
        if (err)
            res.send(err);
        res.jsonp(alumno);
    });

    Usuario.findById(alumno.usuario._id, function (err, usuario) {
        if (usuario != null) {
            usuario.nombre = alumno.usuario.nombre;
            usuario.apellido = alumno.usuario.apellido;
            usuario.dni = alumno.usuario.dni;
            usuario.email = alumno.usuario.email;

            usuario.save(function (err) {
                if (err) return res.send(500, err.message);
                if (err) return console.log('Error al actualizar usuario');
                console.log('Usuario: ' + usuario.username + ' de Alumno: ' + alumno._id + ' actualizado');
            });
        }
    });
};

exports.updateAlumno = function (req, res) {
    Alumno.findById(req.params._id, function (err, alumno) {

        alumno.edad = req.body.edad;
        alumno.regular = req.body.regular;
        alumno.usuario = req.body.usuario;

        alumno.save(function (err) {
            if (err) return res.send(500, err.message);
            res.jsonp(alumno);
        });

        Usuario.findById(alumno.usuario._id, function (err, usuario) {
            if (usuario != null) {
                usuario.nombre = alumno.usuario.nombre;
                usuario.apellido = alumno.usuario.apellido;
                usuario.dni = alumno.usuario.dni;
                usuario.email = alumno.usuario.email;

                usuario.save(function (err) {
                    if (err) return console.log('Error al actualizar usuario');
                    console.log('Usuario: ' + usuario.username + ' de Alumno: ' + alumno._id + ' actualizado');
                });
            }
        });

    });
};

exports.deleteAlumno = function (req, res) {
    Alumno.findById(req.params._id, function (err, alumno) {
        alumno.remove(function (err) {
            if (err) return res.send(500, err.message);
            res.json({ message: 'Alumno eliminado' });
        })
    });
};

exports.inscribirAlumno = function (req, res) {
    Alumno.findById(req.params._idAlumno, function (err, alumno) {
        if (alumno !== null) {
            Curso.findById(req.params._idCurso, function (err, curso) {
                alumno.curso.push(curso);
                alumno.save(function (err) {
                    if (err) return res.send(500, err.message);
                    res.json({ message: 'Alumno inscripto' });
                });
            });
        }
        else {
            res.json({ message: 'Alumno no encontrado' });
        }
    });
};

exports.desinscribirAlumno = function (req, res) {
    Alumno.findById(req.params._idAlumno, function (err, alumno) {
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
};




