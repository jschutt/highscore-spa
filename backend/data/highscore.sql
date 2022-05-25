CREATE DATABASE highscore

CREATE TABLE game (
	id INTEGER GENERATED ALWAYS AS IDENTITY,
	title VARCHAR(50) NOT NULL,
	genre VARCHAR(50) NOT NULL,
    description VARCHAR(250) NOT NULL,
	release_date DATE NOT NULL,
	image_url VARCHAR(250) NOT NULL,
	url_slug VARCHAR(50) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE scores (
	id INTEGER GENERATED ALWAYS AS IDENTITY,
	player VARCHAR(50) NOT NULL,
    highscore INTEGER NOT NULL,
	highscore_date DATE NOT NULL,
    game_id INTEGER,
    FOREIGN KEY (game_id)
       REFERENCES game (id),
	   PRIMARY KEY (id)
);

CREATE TABLE user_role (
	user_id INTEGER,
	role_id INTEGER,
	PRIMARY KEY (user_id, role_id),
	FOREIGN KEY (user_id)
		REFERENCES "user" (id),
		ON DELETE CASCADE,
	FOREIGN KEY (role_id)
		REFERENCES role (id)
)