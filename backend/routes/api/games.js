var express = require("express");
var router = express.Router();

// GET /api/games[?title={title}]
router.get("/", async (req, res) => {
  const { title } = req.query;

  const db = req.app.locals.db;

  const games = title ? await searchGame(title, db) : await getGames(db);

  checkResult(games);

  res.json(games);
});

// GET /api/games/{urlSlug}
router.get("/:urlSlug", async (req, res) => {
  const { urlSlug } = req.params;

  const db = req.app.locals.db;

  const game = await getGame(urlSlug, db);

  checkResult(game);

  res.json(game);
});

// POST /api/games/{urlSlug}
router.post("/", async (req, res) => {
  const db = req.app.locals.db;

  const { title, genre, description, release_date, image_url } = req.body;

  const game = {
    title,
    genre,
    description,
    release_date,
    image_url,
    url_slug: generateURLSlug(title),
  };

  if(!title || !genre || !description || !image_url || !release_date){
    res.status(400).send();
    return;
  }

  game.id = await saveGame(game, db);

  res.location(`/api/games/${game.url_slug}`);

  res.status(201).send(game);
});

// DELETE /api/games/{urlSlug}
router.delete("/:id", async (req, res) => {

  const db = req.app.locals.db;

  const gameId = req.params.id;

  await deleteGame(gameId, db);

  res.status(204).send();
});

// GET /api/games/{urlSlug}/highscores
router.get("/:urlSlug/highscores", async (req, res) => {
  const { urlSlug } = req.params;

  const db = req.app.locals.db;

  const scores = await getGameScore(urlSlug, db);

  checkResult(scores);

  res.json(scores);
});

const checkResult = (result) => {
  if (!result) {
    res.status(404).send([]);
    return;
  }
};

const generateURLSlug = (title) => {
  return title.replace("-", "").replace(" ", "-").toLowerCase();
}

const searchGame = async (title, db) => {
  const sql = `
      SELECT id,
             title,
             genre,
             description,
     TO_CHAR (game.release_date, 'YYYY') AS release_date,
             image_url,
             url_slug
        FROM game
       WHERE title ILIKE '%' || $1 || '%'
  `;

  const result = await db.query(sql, [title]);

  return result.rows;
};

const getGames = async (db) => {
  const sql = `
    SELECT id,
           title,
           genre,
           description,
           TO_CHAR (game.release_date, 'DD-MM-YYYY') AS release_date,
           image_url,
           url_slug
      FROM game
  `;

  const result = await db.query(sql);

  return result.rows;
};

const getGame = async (urlSlug, db) => {
  const sql = `
      SELECT game.id,
             game.title,
             game.genre,
             game.description,
     TO_CHAR (game.release_date, 'DD-MM-YYYY') AS release_date,
             game.image_url,
             game.url_slug
        FROM game
       WHERE game.url_slug = $1
  `;

  const result = await db.query(sql, [urlSlug]);
  return result.rows;
};

const getGameScore = async (urlSlug, db) => {
  const sql = `
      SELECT game.title,
             game.url_slug,
             users.player,
     TO_CHAR (users.highscore, '999 999 999') AS highscore,
        CAST (highscore AS int),
     TO_CHAR (users.highscore_date, 'YYYY-MM-DD') AS highscore_date
        FROM game
  INNER JOIN users
          ON users.game_id = game.id
       WHERE game.url_slug = $1
  `;

  const result = await db.query(sql, [urlSlug]);
  return result.rows;
};

const saveGame = async (game, db) => {
  const sql = `
    INSERT INTO game (
                title,
                genre,
                description,
                release_date,
                image_url,
                url_slug
       ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
  `;

  const result = await db.query(sql, [
    game.title,
    game.genre,
    game.description,
    game.release_date,
    game.image_url,
    game.url_slug,
  ]);

  return result.rows[0].id;
};

const deleteGame = async (gameId, db) => {
  const sql = `
    DELETE FROM game
      WHERE id = $1
  `;

  await db.query(sql, [gameId])
}

module.exports = router;
