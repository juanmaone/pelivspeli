var conexion = require('../lib/conexionbd');



function crearCompetencia(req, res) {

    var nombreCompetencia = req.body.nombre;
    var idGenero = req.body.genero;
    var idActor = req.body.actor;
    var idDirector = req.body.director;
    var accion = req.body.Guardar;
    console.log(req.body)
    var sqlInsert = `insert  into competencias (nombre,genero_id,director_id,actor_id) values ('` + nombreCompetencia + `',` + idGenero + `,` + idDirector + `,` + idActor + `);`;

    conexion.query(sqlInsert, function(error, resultInsert) {
        if (error) {
            console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR004' + error.message, sqlInsert);
            return res.status(404).send('Error al conectar a la base de datos');
        } else {
            console.log(resultInsert)
            var response = {
                'competencia': resultInsert,
            }
            res.send(JSON.stringify(response));
        }
    })

};

function eliminarVotos(req, res) {

    var idCompetencia = req.params.id;
    var accion = req.body.Reiniciar;
    console.log(req.body)
    console.log(idCompetencia)

    var sqlDelete = ` delete from voto where competencia_id = ` + idCompetencia + `; `;
    conexion.query(sqlDelete, function(error, resultDelete) {
        if (error) {
            console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR007' + error.message, sqlDelete);
            return res.status(404).send('Error al conectar a la base de datos');
        } else {
            var response = {
                'competencia': resultDelete,
            }
            res.send(JSON.stringify(response));
        }
    })

};

function cargarGeneros(req, res) {
    var sql = `
    select * from genero;
    `;
    conexion.query(sql, function(error, result) {
        if (error) {
            console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR009' + error.message, sql);
            return res.status(404).send('Error al conectar a la base de datos');
        } else {
            var response = result;

            res.send(JSON.stringify(response));
        }
    })
};

function cargarActores(req, res) {
    var sql = `
    select * from actor;
    `;
    conexion.query(sql, function(error, result) {
        if (error) {
            console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR011' + error.message, sql);
            return res.status(404).send('Error al conectar a la base de datos');
        } else {
            var response = result;

            res.send(JSON.stringify(response));
        }
    })
};

function cargarDirectores(req, res) {
    var sql = `
    select * from director;
    `;
    conexion.query(sql, function(error, result) {
        if (error) {
            console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR010' + error.message, sql);
            return res.status(404).send('Error al conectar a la base de datos');
        } else {
            var response = result;

            res.send(JSON.stringify(response));
        }
    })
};

function compenteciaAEditar(req, res) {
    var idCompetencia = req.params.id;

    var sql = `select c.nombre,(select g.nombre from genero g where g.id=c.genero_id) as 'genero_nombre',
    (select d.nombre from director d where d.id=c.director_id) as 'director_nombre',
    (select a.nombre from actor a where a.id=c.actor_id) as 'actor_nombre'    
    from competencias c where c.id=` + idCompetencia;


    conexion.query(sql, function(error, result) {
        if (error) {
            console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR012' + error.message, sql);
            return res.status(404).send('Error al conectar a la base de datos');
        } else {
            var response = result[0];

            res.send(JSON.stringify(response));
        }
    })
};


function updateCompetencia(req, res) {
    var idCompetencia = req.params.id;
    var nuevoNombre = req.body.nombre;
    var sql = `update competencias c set nombre='` + nuevoNombre + `' where c.id=` + idCompetencia;
    console.log('compet update', idCompetencia, sql)
    conexion.query(sql, function(error, result) {
        if (error) {
            console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR013' + error.message, sql);
            return res.status(404).send('Error al conectar a la base de datos');
        } else {
            var response = result[0];

            res.send(JSON.stringify(response));
        }
    })
};

/*
    Borrado logico de competencias y votos de la competencia,
    Manejado dentro de una transaccion para que si alguno de los 2 update falla, se vuelva al estado anterior

*/

function deleteCompetencia(req, res) {
    var idCompetencia = req.params.id;

    var sql1 = `update voto set enabled=0 where competencia_id=` + idCompetencia + `; `
    conexion.beginTransaction(function(error) {
        if (error) { throw err; }
        conexion.query(sql1, function(error, result) {
            if (error) {
                conexion.rollback(function() {
                    console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR014 ' + error.message, sql1);
                    return res.status(402).send('Error al conectar a la base de datos');
                });
            }

            var sql2 = `update competencias set enabled=0 where id=` + idCompetencia + `;`;

            conexion.query(sql2, function(error, result) {
                if (error) {
                    conexion.rollback(function() {
                        console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR014 ' + error.message, sql);
                        return res.status(402).send('Error al conectar a la base de datos');
                    });
                }
                conexion.commit(function(error) {
                    if (error) {
                        conexion.rollback(function() {
                            console.error('NO SE PUEDE CONECTAR A LA BASE DE DATOS eRR014 ' + error.message, sql);
                            return res.status(402).send('Error al conectar a la base de datos');
                        });
                    } else {
                        var response = result[0];
                        res.send(JSON.stringify(response));
                    }

                });
            });
        });
    });
}



module.exports = {
    nuevaCompetencia: crearCompetencia,
    all: function(req, res) {
        res.send('All todos')
    },
    eliminarVotos: eliminarVotos,
    all: function(req, res) {
        res.send('All todos')
    },
    cargarGeneros: cargarGeneros,
    all: function(req, res) {
        res.send('All todos')
    },
    cargarDirectores: cargarDirectores,
    all: function(req, res) {
        res.send('All todos')
    },
    cargarActores: cargarActores,
    all: function(req, res) {
        res.send('All todos')
    },
    competenciaAEditar: compenteciaAEditar,
    all: function(req, res) {
        res.send('All todos')
    },
    updateCompetencia: updateCompetencia,
    all: function(req, res) {
        res.send('All todos')
    },
    deleteCompetencia: deleteCompetencia,
    all: function(req, res) {
        res.send('All todos')
    },


};