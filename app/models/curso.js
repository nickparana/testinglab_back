var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CursoSchema = new Schema({
    nombre: { type: String, },
    descripcion: { type: String },
    fechaInicio: { type: Date },
    fechaFin: { type: Date },
    dias: [String],
    horaInicio: { type: Date },
    horaFin: { type: Date },
    cupo: { type: Number }
});

module.exports = mongoose.model('Curso', CursoSchema);