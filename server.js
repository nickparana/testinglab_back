// BASE SETUP
// =============================================================================

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')

var config = require('./config/config');

var mongoose = require('mongoose');
mongoose.connect(config.database, function (err, res) {
    if (err) throw err;
    console.log('Conexión a DB establecida.');
});

// Import Models and controllers
var Usuario = require('./app/models/usuario');
var Alumno = require('./app/models/alumno');
var Curso = require('./app/models/curso');
var UsuarioCtrl = require('./app/controllers/usuario.controller');
var AlumnoCtrl = require('./app/controllers/alumno.controller');
var CursoCtrl = require('./app/controllers/curso.controller');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors())

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================

var authenticate = express.Router();
var usuarios = express.Router();
var alumnos = express.Router();
var cursos = express.Router();

var loggedIn = false;

authenticate.post('/authenticate', function (req, res) {
    Usuario.findOne({ username: req.body.username }, function (err, usuario) {

        if (err) throw err;

        if (!usuario) {
            res.status(500).send({ success: false, message: 'Login Error: Usuario inexistente.' });
        }
        else if (usuario) {
            if (usuario.password != req.body.password) {
                res.status(401).send({ success: false, message: 'Login Error: Contraseña incorrecta.' });
            } else {
                loggedIn = true;
                res.status(200).send({
                    success: true, message: 'Login Correcto',
                    usuario: { _id: usuario._id, username: usuario.username, nombre: usuario.nombre, apellido: usuario.apellido, dni: usuario.dni, email: usuario.email }
                }); // para no pasar la pass
            }

        }
    });
});

app.use('/api', authenticate);
usuarios.route('/usuarios')
    .post(UsuarioCtrl.saveUsuario);

authenticate.route('/logout')
    .post(function (req, res) {
        loggedIn = false;
        res.json({ message: 'Has salido.' });
    });

alumnos.route('/alumnos')
    .get(AlumnoCtrl.findAllAlumnos)
    .post(AlumnoCtrl.saveAlumno);

alumnos.route('/alumnos/:_id')
    .get(AlumnoCtrl.findAlumnoById)
    .put(AlumnoCtrl.updateAlumno)
    .delete(AlumnoCtrl.deleteAlumno);

alumnos.route('/alumnos/:_idAlumno/curso/:_idCurso')
    .get(AlumnoCtrl.inscribirAlumno);

alumnos.route('/alumnos/:_idAlumno/curso/:_idCurso/desinscribir')
    .get(AlumnoCtrl.desinscribirAlumno);

alumnos.route('/alumnos/usuario/:username')
    .get(AlumnoCtrl.findAlumnoByUsername);

cursos.route('/cursos')
    .get(CursoCtrl.findAllCursos)
    .post(CursoCtrl.saveCurso);

cursos.route('/cursos/:_id')
    .get(CursoCtrl.findCursoById)
    .put(CursoCtrl.updateCurso)
    .delete(CursoCtrl.deleteCurso);

usuarios.use(function (req, res, next) {
    if (!loggedIn) {
        return res
            .status(403)
            .send({ message: "No estás loggeado" });
    }
    else {
        console.log('req: ', req.body);
        next();
    }
});

usuarios.route('/usuarios')
    .get(UsuarioCtrl.findAllUsuarios)
    .post(UsuarioCtrl.saveUsuario);

usuarios.route('/usuarios/:_id')
    .get(UsuarioCtrl.findUsuarioById)
    .put(UsuarioCtrl.updateUsuario)
    .delete(UsuarioCtrl.deleteUsuario);



app.use('/api', usuarios);
app.use('/api', alumnos);
app.use('/api', cursos);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Servidor levantando en puerto: ' + port);