var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String },
    nombre: { type: String },
    apellido: { type: String },
    dni: { type: String },
    email: { type: String }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);