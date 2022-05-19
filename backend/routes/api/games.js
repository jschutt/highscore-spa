var express = require("express");
var router = express.Router();

// GET /api/games
router.get("/", async (req, res) => {

  const {title} = req.query;

  const db = req.app.locals.db;

  const games = title 
  ? await searchGame(title, db)
  : await getGames(db);

  res.json(games);
});

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
       WHERE name ILIKE '%' || $1 || '%'
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

module.exports = router;
