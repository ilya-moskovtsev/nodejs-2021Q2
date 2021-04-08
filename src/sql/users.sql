-- create database app;

-- create schema if not exists public;

create extension "uuid-ossp";

create table if not exists users(
                                    id uuid primary key default uuid_generate_v4(),
                                    login text not null,
                                    password text not null,
                                    age int not null,
                                    is_deleted boolean not null default false
);

insert into users (login, password, age)
values ('login 1', 'password 1', 10),
       ('login 2', 'password 2', 20),
       ('login 3', 'password 3', 30);