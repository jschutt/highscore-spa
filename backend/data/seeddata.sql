-- Add game
INSERT INTO game (
  title,
  genre,
  description,
  release_date,
  image_url,
  url_slug
) VALUES
(
  'Tetris',
  'Puzzle',
  'Lorum ipsum dolor and so on',
  '1984-06-06',
  'https://via.placeholder.com/260x260.png?text=Game',
  'tetris'
);

INSERT INTO game (
  title,
  genre,
  description,
  release_date,
  image_url,
  url_slug
) VALUES
(
  'Pac-Man',
  'Arcade',
  'Lorum ipsum dolor and so on',
  '1980-05-22',
  'https://via.placeholder.com/260x260.png?text=Game',
  'pac-man'
);

-- Add score
INSERT INTO scores (
  player,
  highscore,
  highscore_date,
  game_id
) VALUES
(
  'Bruce Wayne',
  579680,
  '2001-05-24',
  1
);

INSERT INTO scores (
  player,
  highscore,
  highscore_date,
  game_id
) VALUES
(
  'Clark Kent',
  1904060,
  '2004-02-04',
  2
);

-- Add user
INSERT INTO "user" (
	username,
	password,
	email,
	first_name,
	last_name
) VALUES (
	'tony@stark.com',
	'Secret#123',
	'tony@stark.com',
	'Tony',
	'Stark'
)

INSERT INTO "user" (
	username,
	password,
	email,
	first_name,
	last_name
) VALUES (
	'peter@parker.com',
	'Secret#123',
	'peter@parker.com',
	'Peter',
	'Parker'
)

-- Add roles
INSERT INTO role (name)
VALUES ('Administrator')

INSERT INTO role (name)
VALUES ('User')

-- Assign role to user (specifically Tony Stark to Administrator)
INSERT INTO user_role (user_id, role_id)
VALUES 
(1, 1)

-- Select all scores for a game
    SELECT users.id,
           users.player,
	         users.highscore,
           users.highscore_date
      FROM users
INNER JOIN game
      	ON game.id = users.game_id
     WHERE url_slug = 'pac-man'

 -- Each users highest scores
    SELECT game.id,
	         game.title,
           game.image_url,
           game.url_slug,
		       users.username,
	     MAX (users.highscore)
	    FROM game
INNER JOIN users
        ON users.game_id = game.id
  GROUP BY game.id, users.player

-- Top highscore in each game
SELECT DISTINCT ON (game.title) 
                   game.title,
                   game.url_slug,
                   users.player,
                   users.highscore,
           TO_CHAR (users.highscore_date, 'DD-MM-YYYY') AS highscore_date
              FROM game
        INNER JOIN users
                ON users.game_id = game.id
          ORDER BY game.title, users.highscore DESC;