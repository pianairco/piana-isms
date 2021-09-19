create sequence IF NOT EXISTS master_seq START WITH 1000 INCREMENT BY 50;
CREATE TABLE IF NOT EXISTS agent (
  id bigint primary key,
  name varchar(128)
);

INSERT INTO agent (id, name) select * from (
    select 1 id, 'afta' name
) where not exists(select * from agent);

CREATE TABLE IF NOT EXISTS users (
  id bigint primary key,
  agent_id bigint,
  username varchar(64),
  user_uuid char(36),
  email varchar(256) NOT NULL,
  mobile char(11),
  password char(128),
  form_password char(128),
  email_verified number(1),
  name varchar(64),
  picture_url varchar(256),
  locale char(2),
  family_name varchar(64),
  given_name varchar(64),
  constraint fk_users_2_agent_by_agent_id FOREIGN KEY (agent_id) REFERENCES agent(id)
);

-- image => https://lh3.googleusercontent.com/a-/AOh14Gg8K7kIHhlEo0-oJjPmGBG73ciHeRQnMFuRWRjQ4A=s96-c
INSERT INTO users (id, agent_id, username, user_uuid, mobile, email, email_verified, password, form_password, locale, given_name, picture_url) select * from (
    select 1 id, 1 agent_id, 'admin' username, 'admin' user_uuid, '09128855402' mobile, 'rahmatii1366@gmail.com' email, 1 email_verified,
           '$2a$10$J.qCx8tB1axgUJFqzrk6NupFsQ/ObT1tmhhVVf3MDewdumSwkxsDO' password, '$2a$10$J.qCx8tB1axgUJFqzrk6NupFsQ/ObT1tmhhVVf3MDewdumSwkxsDO' form_password, 'fa' locale,
           'admin' given_name, 'https://lh3.googleusercontent.com/a-/AOh14Gg8K7kIHhlEo0-oJjPmGBG73ciHeRQnMFuRWRjQ4A=s96-c' picture_url
) where not exists(select * from users);

CREATE TABLE IF NOT EXISTS user_roles (
    id bigint default master_seq.nextval primary key,
    user_id bigint not null,
    role_name varchar(64) NOT NULL,
    constraint fk_user_roles_2_user_by_id FOREIGN KEY (user_id)
        REFERENCES users(id)
);

INSERT INTO user_roles (id, user_id, role_name) select * from (
    select 1 id, 1 user_id, 'ROLE_ADMIN' role_name union
    select 2, 1, 'ROLE_USER'
) where not exists(select * from user_roles);
