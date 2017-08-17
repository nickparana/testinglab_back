var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Usuario = require('../models/usuario');
var Curso = require('../models/curso');

var AlumnoSchema = new Schema({
    usuario: Schema.Types.Mixed,
    edad: { type: Number },
    regular: { type: Boolean },
    curso:  [Schema.Types.Mixed]
});

module.exports = mongoose.model('Alumno', AlumnoSchema);