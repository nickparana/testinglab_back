var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Dia = require('../models/dia');

var CursoSchema = new Schema({
    nombre: { type: String, },
    descripcion: { type: String },
    fechaInicio: { type: String },
    fechaFin: { type: String },
    dias:  Schema.Types.Mixed,
    horaInicio: { type: String },
    horaFin: { type: String },
    cupo: { type: Number }
});

module.exports = mongoose.model('Curso', CursoSchema);