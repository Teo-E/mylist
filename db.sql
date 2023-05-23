CREATE database IF NOT EXISTS `db`;
USE `db`;

CREATE table users (
    idUser int(11) NOT NULL AUTO_INCREMENT,
    nameUser varchar(255) NOT NULL,
    passwordUser varchar(255) NOT NULL,
    PRIMARY KEY (idUser)
);

CREATE table products (
    id int(11) NOT NULL AUTO_INCREMENT,
    product varchar(255) NOT NULL,
    quantity int(11) NOT NULL,
    idUser int(11) NOT NULL,
    PRIMARY KEY (id),
    foreign key (idUser) references users(idUser)
);

insert into products (product, quantity,idUser) values ('Pasta', 2, 1);

insert into users (nameUser, passwordUser) values ('admin', 'admin');
