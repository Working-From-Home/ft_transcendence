-- database: test_pong
-- https://stackoverflow.com/questions/22256124/cannot-create-a-database-table-named-user-in-postgresql

---- first time
-- docker-compose exec postgres bash
-- createdb -U postgres test_pong && psql -U postgres -v ON_ERROR_STOP=1 test_pong < /docker-entrypoint-initdb.d/test_pong.sql

---- delete and recreate db
-- dropdb -U postgres test_pong && createdb -U postgres test_pong && psql -U postgres -v ON_ERROR_STOP=1 test_pong < /docker-entrypoint-initdb.d/test_pong.sql

-- CREATE DATABASE test_pong
-- 	WITH
-- 	OWNER = postgres;

-- Show existing databases
-- SELECT * FROM pg_database;

-- enfer -> mots reserves (doivent etre double quote, sauf si value -> simple quote): user, password, role, message, name, description, type...

DROP TYPE IF EXISTS user_role;
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'user');

DROP TABLE IF EXISTS "user";
CREATE TABLE IF NOT EXISTS "user"(
	id				INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	email			VARCHAR(200) NOT NULL UNIQUE,
	username		VARCHAR(50) NOT NULL UNIQUE,
	"password"		VARCHAR(200) NOT NULL,
	"role"			user_role NOT NULL DEFAULT 'user',
	end_ban			TIMESTAMP WITH TIME ZONE DEFAULT NULL,
	created_at		TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	two_fa_enabled	BOOLEAN NOT NULL DEFAULT FALSE,
	two_fa_secret	VARCHAR(1000) DEFAULT NULL,
	oauth_token_ft	VARCHAR(2048) DEFAULT NULL
);

DROP TABLE IF EXISTS user_stat;
CREATE TABLE IF NOT EXISTS user_stat (
   user_id			INTEGER NOT NULL REFERENCES "user"(id) PRIMARY KEY,
   level			INTEGER NOT NULL DEFAULT 0 CHECK( level >= 0 AND level <= 100),
   victories		INTEGER NOT NULL DEFAULT 0 CHECK( victories >= 0),
   losses			INTEGER NOT NULL DEFAULT 0 CHECK( losses >= 0)
);

DROP TYPE IF EXISTS friendship_type;
CREATE TYPE friendship_type AS ENUM ('accepted', 'pending', 'rejected');

-- check for dupplicates A B <-> B A
-- https://stackoverflow.com/questions/10997043/postgres-table-find-duplicates-in-two-columns-regardless-of-order
DROP TABLE IF EXISTS friendship;
CREATE TABLE IF NOT EXISTS friendship (
	applicant_id	INTEGER NOT NULL REFERENCES "user"(id),
	recipient_id	INTEGER NOT NULL REFERENCES "user"(id),
	"status"		friendship_type NOT NULL,
	created_at		TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(applicant_id, recipient_id)
);

ALTER TABLE friendship
ADD CONSTRAINT no_itself_relation
CHECK (applicant_id != recipient_id);

DROP TABLE IF EXISTS blocked;
CREATE TABLE IF NOT EXISTS blocked (
	applicant_id	INTEGER NOT NULL REFERENCES "user"(id),
	recipient_id	INTEGER NOT NULL REFERENCES "user"(id),
	created_at		TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(applicant_id, recipient_id)
);

ALTER TABLE blocked
ADD CONSTRAINT no_itself_relation
CHECK (applicant_id != recipient_id);

DROP TABLE IF EXISTS channel;
CREATE TABLE IF NOT EXISTS channel(
	id			INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   	owner_id	INTEGER NOT NULL REFERENCES "user"(id),
	is_dm		BOOLEAN NOT NULL,
	title		VARCHAR(100) NOT NULL UNIQUE,
	"password"	VARCHAR(200) DEFAULT NULL,
	created_at	TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
);

DROP TYPE IF EXISTS user_channel_role;
CREATE TYPE user_channel_role AS ENUM ('admin', 'user');

DROP TABLE IF EXISTS user_channel;
CREATE TABLE IF NOT EXISTS user_channel(
  	user_id			INTEGER NOT NULL REFERENCES "user"(id),
	channel_id		INTEGER NOT NULL REFERENCES channel(id),
	"role"			user_channel_role NOT NULL DEFAULT 'user',
	end_ban			TIMESTAMP WITH TIME ZONE DEFAULT NULL,
	end_mute		TIMESTAMP WITH TIME ZONE DEFAULT NULL,
	PRIMARY KEY(user_id, channel_id)
);

DROP TABLE IF EXISTS "message";
CREATE TABLE IF NOT EXISTS "message"(
	id			INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	channel_id	INTEGER NOT NULL REFERENCES channel(id),
  	user_id		INTEGER NOT NULL REFERENCES "user"(id),
	content 	TEXT NOT NULL,
	created_at	TIMESTAMP WITH TIME ZONE  NOT NULL DEFAULT CURRENT_TIMESTAMP,
);

DROP TABLE IF EXISTS achievement;
CREATE TABLE IF NOT EXISTS achievement(
	id				INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	title			VARCHAR(200) NOT NULL UNIQUE,
	"description"	VARCHAR(500) NOT NULL
);

DROP TABLE IF EXISTS user_achievement;
CREATE TABLE IF NOT EXISTS user_achievement(
  	user_id			INTEGER REFERENCES "user"(id),
	achievement_id	INTEGER REFERENCES achievement(id),
	PRIMARY KEY(user_id, achievement_id)
);

DROP TABLE IF EXISTS game;
CREATE TABLE IF NOT EXISTS game(
	id				INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  	winner_id		INTEGER REFERENCES "user"(id) NOT NULL,
  	looser_id		INTEGER REFERENCES "user"(id) NOT NULL,
  	winner_score	INTEGER NOT NULL,
  	looser_score	INTEGER NOT NULL,
);

ALTER TABLE game
ADD CONSTRAINT no_itself_relation
CHECK (winner_id != looser_id);

----------------------------------------------------------------------------
-- Insert dummy data
----------------------------------------------------------------------------

INSERT INTO "user" (username, email, "password", "role") VALUES
	('bob', 'bob@bob.com', 'mypass', 'admin'),
	('marie', 'marie@email.com', 'mypass', 'admin'),
	('jacques', 'jacques@email.com', 'mypass', 'user'),
	('stef', 'stef@mail.com', 'mypass', 'user'),
	('alice', 'alice@mail.com', 'mypass', 'user'),
	('pierre', 'pierre@mail.com', 'mypass', 'user'),
	('jean', 'jeab@mail.com', 'mypass', 'user');

INSERT INTO user_stat (user_id, level, victories, losses) VALUES
	(1, 42, 15,   7),
	(2, 54, 150, 97),
	(3,  9,  15, 90),
	(4,  1,   2,  2),
	(5,  8,   5,  5);

INSERT INTO achievement (title, "description") VALUES
	('Tyson Fury', 'Win 30 games in a row.'),
	('Pilier de bar', 'Play 15 games each day for one month'),
	('Bienvenu', 'Create an account');

INSERT INTO user_achievement (user_id, achievement_id) VALUES
	(1, 3),
	(2, 3),
	(3, 3),
	(4, 3),
	(5, 3),

	(1, 2),
	(2, 2),
	(3, 2),

	(1, 1),
	(2, 1);

INSERT INTO relationship (requester_id, recipient_id, "type") VALUES
	(1, 2, 'friend'),
	(1, 3, 'friend'),
	(1, 4, 'pending'),
	(1, 5, 'blocked'),

	(2, 3, 'pending'),
	(2, 4, 'blocked'),
	(2, 5, 'friend'),

	(3, 4, 'friend'),
	(3, 5, 'pending'),

	(4, 5, 'friend'),

	(6, 1, 'friend'),
	(6, 3, 'pending'),

	(7, 1, 'blocked');


INSERT INTO channel (owner_id, title, "password") VALUES
	(1, 'L equipe', NULL ),
	(2, 'L equipe 2', NULL );

INSERT INTO user_channel (user_id, channel_id, "role", start_ban, minutes_ban, start_mute, minutes_mute) VALUES
	(1, 1, 'admin', NULL, NULL, NULL, NULL), -- owner
	(2, 1, 'admin', NULL, NULL, NULL, NULL),
	(3, 1, 'user', NULL, NULL, NULL, NULL),

	(2, 2, 'admin', NULL, NULL, NULL, NULL), -- owner
	(4, 2, 'moderator', NULL, NULL, NULL, NULL),
	(5, 2, 'user', NULL, NULL, NULL, NULL);

INSERT INTO "message" (channel_id, user_id, content, creation) VALUES
	(1, 1, 'bob: hello l equipe ! premier message', '2021-12-08 01:45:32.883044+00'),
	(1, 2, 'marie: hola, second message', 			'2021-12-08 01:45:35.883044+00'),
	(1, 3, 'jacques: Hi !, third one', 				'2021-12-08 01:46:01.883044+00'),
	(1, 1, 'bob: 4',								'2021-12-08 01:47:42.883044+00'),
	(1, 2, 'marie: 5',								'2021-12-08 01:49:32.883044+00'),
	(1, 1, 'bob: 6',								'2021-12-08 01:51:29.883044+00'),
	(1, 1, 'bob: 7',								'2021-12-08 01:53:11.883044+00'),
	(1, 1, 'bob: 8',								'2021-12-08 01:54:02.883044+00'),

	(2, 2, 'marie: hello l equipe 2 ! premier message', '2021-12-08 01:45:32.883044+00'),
	(2, 4, 'stef: hola, second message',				'2021-12-08 01:49:32.883044+00'),
	(2, 5, 'alice: Hi !, third one',					'2021-12-08 01:50:32.883044+00'),
	(2, 2, 'bob: 4',									'2021-12-08 01:52:32.883044+00'),
	(2, 4, 'marie: 5',									'2021-12-08 01:55:32.883044+00'),
	(2, 2, 'marie: 6',									'2021-12-08 01:56:32.883044+00'),
	(2, 2, 'marie: 7',									'2021-12-08 01:56:35.883044+00'),
	(2, 2, 'marie: 8',									'2021-12-08 01:57:40.883044+00');

INSERT INTO game (user_one, user_two, winner_id, "status") VALUES
	(1, 2, 1, 'ended'),
	(1, 2, 2, 'ended'),
	(4, 2, 4, 'ended'),
	(4, 5, 5, 'ended');
