var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiaSchema = new Schema({
    lunes: { type: Boolean },
    martes: { type: Boolean },
    miercoles: { type: Boolean },
    jueves: { type: Boolean },
    viernes: { type: Boolean },
});

module.exports = mongoose.model('Dia', DiaSchema);