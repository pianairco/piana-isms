create sequence IF NOT EXISTS master_seq START WITH 1000 INCREMENT BY 50;

create table IF NOT EXISTS consequence_parameters_type (
    id number(18) primary key,
    level number(2)
);

INSERT INTO consequence_parameters_type (id, level) select * from (
    select 1 , 3 union
    select 2, 5
) where not exists(select * from consequence_parameters_type);

create table IF NOT EXISTS consequence_parameters_attribute (
    id number(18) primary key,
    consequence_parameters_type_id number(18),
    orders number(2),
    value number(2),
    label varchar(128),
    constraint fk_cons_params_attr_2_cons_params_type FOREIGN KEY (consequence_parameters_type_id) REFERENCES consequence_parameters_type(id)
);

INSERT INTO consequence_parameters_attribute (id, consequence_parameters_type_id, orders, value, label) select * from (
    select 1 id, 1 consequence_parameters_type_id, 1 orders, 1 value, 'کم' label union
    select 2 , 1, 2, 2, 'متوسط' union
    select 3 , 1, 3, 3, 'زیاد' union
    select 4 , 2, 1, 1, 'خیلی کم' union
    select 5 , 2, 2, 2, 'کم' union
    select 6 , 2, 3, 3, 'متوسط' union
    select 7 , 2, 4, 4, 'زیاد' union
    select 8 , 2, 5, 5, 'خیلی زیاد'
) where not exists(select * from consequence_parameters_attribute);

create table IF NOT EXISTS consequence_parameters(
    id number(18) primary key,
    consequence_parameters_type_id number(18),
    name varchar(128),
    alias varchar(128),
    coefficient number(4, 3)
);

INSERT INTO consequence_parameters (id, consequence_parameters_type_id, name, alias, Coefficient) select * from (
    select 1 id, 1 consequence_parameters_type_id, 'confidentiality' name, 'CONFIDENTIALITY' alias, 1 Coefficient union
    select 2, 2, 'integrity', 'INTEGRITY', 1 union
    select 3, 2, 'availability', 'AVAILABILITY', 1
) where not exists(select * from consequence_parameters);

create table IF NOT EXISTS asset_category (
    id number(18) primary key,
    asset_category_name varchar(128) NOT NULL ,
    parent_id number(18)
);

INSERT INTO asset_category (id, asset_category_name) select * from (
    select 1 , 'سخت افزار' union
    select 2 , 'نرم افزار' union
    select 3 , 'شبکه'
) where not exists(select * from asset_category);
