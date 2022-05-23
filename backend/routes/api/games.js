var express = require("express");
var router = express.Router();

// GET /api/games[?title={title}]
router.get("/", async (req, res) => {

  const {title} = req.query;

  const db = req.app.locals.db;

  const games = title 
  ? await searchGame(title, db)
  : await getGames(db);

  checkResult(games);

  res.json(games);
});

// GET /api/games/{urlSlug}
router.get("/:urlSlug", async (req, res) => {

  const {urlSlug} = req.params;

  const db = req.app.locals.db;

  const game = await getGame(urlSlug, db)

  checkResult(game);

  res.json(game);
});

// POST /api/games/{urlSlug}
router.post("/", async (req, res) => {



  res.json([]);
});

// GET /api/games/{urlSlug}/highscores
router.get("/:urlSlug/highscores", async (req, res) => {

  const {urlSlug} = req.params;
  
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

  const result = await db.query(sql, [title])

  return result.rows;

}

const getGames = async (db) => {
  const sql = `
    SELECT id,
           title,
           genre,
           description,
           TO_CHAR (game.release_date, 'YYYY') AS release_date,
           image_url,
           url_slug
      FROM game
  `;

  const result = await db.query(sql)

  return result.rows;
}

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

  const result = await db.query(sql, [urlSlug])
  return result.rows;

}

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
  `

  const result = await db.query(sql, [urlSlug])
  return result.rows;

}

module.exports = router;
