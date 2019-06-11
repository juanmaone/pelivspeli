
use competencias;
create table competencias(
id integer not null auto_increment,
nombre varchar(300),
primary key(id)
);

insert into competencias (nombre) values('Cual es la mejor pelicula');
insert into competencias (nombre) values('Cual es la mejor pelicula con Tom Cruise'),('Que pelicula tiene el actor mas lindo?'),('Que pelicula dura mas?'),
(' Que pelicula vendio mas entradas?'),('Cual es la pelicula mas corta?');


create table voto(
id integer auto_increment not null,
pelicula_id integer  not null,
competencia_id integer not null,
primary key(id)
);


alter table competencias  add column genero_id int, add column director_id int, add column actor_id int,
alter table competencias  add column enabled bool default true;
