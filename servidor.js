//paquetes necesarios para el proyecto
var express = require('express');
var cors = require('cors');
var controlador = require('./controladores/controlador');
var controladorAdmin = require('./controladores/controladorAdmin');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get('/', function(req, res) {
    res.sendFile(path.join('./cliente/html/index.html'));
    /* res.sendFile('../cliente/html/index.html');
     console.log("DIR");
     console.log(__dirname);*/
});

app.get('/competencias/:id', controladorAdmin.competenciaAEditar);
app.post('/competencias', controladorAdmin.nuevaCompetencia);
app.delete('/competencias/:id/votos', controladorAdmin.eliminarVotos);
app.put('/competencias/:id', controladorAdmin.updateCompetencia);
app.delete('/competencias/:id', controladorAdmin.deleteCompetencia);
app.get('/generos', controladorAdmin.cargarGeneros);
app.get('/directores', controladorAdmin.cargarDirectores);
app.get('/actores', controladorAdmin.cargarActores);
app.get('/competencias', controlador.competencias);
app.get('/competencias/:id/peliculas', controlador.opciones);
app.post('/competencias/:id/voto', controlador.voto);
app.get('/competencias/:id/resultados', controlador.resultados)

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function() {
    console.log("Escuchando en el puerto PELI VS PELI " + puerto);
});