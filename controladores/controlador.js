var conexion = require('../lib/conexionbd');

function buscarCompetencias(req, res) {
    var sql = 'select * from competencias where enabled =1;'
    conexion.query(sql, function(error, result) {
        if (error) {
            console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR001' + error.message);
            return res.status(404).send('Error al conectar a la base de datos  Competencias');
        } else {
            var response = {
                'competencias': result,
            }
            res.send(JSON.stringify(response));
        }
    })
};

function obtenerResultados(req, res) {

    var idCompetencia = req.params.id;
    var sql = 'select * from  competencias where  id=' + idCompetencia + ';';
    conexion.query(sql, function(error, resultCompetencia) {
        if (error) {
            console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR002' + error.message);
            return res.status(404).send('Error al conectar a la base de datos');
        }
        //  sqlPeliculasRnd = 'select * from  pelicula   order by rand() limit 2;';
        // sqlPeliculasRes = 'select * from  pelicula p, voto v where p.id = v.pelicula_id and v.competencia_id=' + idCompetencia + ' limit 3;';
        sqlPeliculasRes = 'select *,(select count(pelicula_id) from voto vot where vot.pelicula_id=p.id and competencia_id=' + idCompetencia + '  )as votos '
        sqlPeliculasRes += ' from  pelicula p, voto v where p.id = v.pelicula_id and v.competencia_id=' + idCompetencia + ' order by votos DESC limit 3';
        console.log(sqlPeliculasRes);
        conexion.query(sqlPeliculasRes, function(error, resultPeliculas) {
            if (error) {
                console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR003' + error.message);
                return res.status(404).send('Error al conectar a la base de datos');
            } else {
                var response = {
                    'competencia': resultCompetencia[0].nombre,
                    'resultados': resultPeliculas
                }
                res.send(JSON.stringify(response));
            }
        })
    })

};


function buscarOpciones(req, res) {
    var idCompetencia = req.params.id;
    var sql = 'select * from  competencias where  id=' + idCompetencia + ';';
    conexion.query(sql, function(error, resultCompetencia) {
        if (error) {
            console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR003' + error.message);
            return res.status(404).send('Error al conectar a la base de datos buscarOpciones');
        }
        //si la competencia tiene director,genero,actor especifico lo filtra en la consulta
        var director_id = resultCompetencia[0].director_id;
        var actor_id = resultCompetencia[0].actor_id;
        var genero_id = resultCompetencia[0].genero_id;
        sqlPeliculasRnd = 'select * from  pelicula  where (true) '
        if (director_id != 0) {
            sqlPeliculasRnd += `and director_id=` + director_id + ` `
        }
        if (genero_id != 0) {
            sqlPeliculasRnd += ` and genero_id=` + genero_id + ` `
        }
        if (actor_id != 0) {
            sqlPeliculasRnd += ` and actor_id=` + actor_id + ` `
        }

        sqlPeliculasRnd += ' order by rand() limit 2;';

        conexion.query(sqlPeliculasRnd, function(error, resultPeliculas) {
            if (error) {
                console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR005' + error.message, 'SQL ERROR ', sqlPeliculasRnd);
                return res.status(404).send('Error al conectar a la base de datos buscarPeliculasOPt');
            } else {
                var response = {
                    'competencia': resultCompetencia[0].nombre,
                    'peliculas': resultPeliculas
                }
                res.send(JSON.stringify(response));
            }
        })
    })

};


function insertarVoto(req, res) {
    var idCompetencia = req.params.id;
    var idPelicula = req.body.idPelicula;
    var sqlInsert = 'insert  into voto (competencia_id,pelicula_id) values (' + idCompetencia + ',' + idPelicula + ');';
    conexion.query(sqlInsert, function(error, resultInsert) {
        if (error) {
            console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR004' + error.message);
            return res.status(404).send('Error al conectar a la base de datos');
        } else {
            var response = {
                'competencia': resultInsert,
            }
            res.send(JSON.stringify(response));
        }
    })

};



module.exports = {
    competencias: buscarCompetencias,
    all: function(req, res) {
        res.send('All todos')
    },
    opciones: buscarOpciones,
    all: function(req, res) {
        res.send('All todos')
    },
    voto: insertarVoto,
    all: function(req, res) {
        res.send('All todos')
    },
    resultados: obtenerResultados,
    all: function(req, res) {
        res.send('All todos')
    },
};