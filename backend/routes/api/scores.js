var express = require("express");
var router = express.Router();

// GET /api/scores
router.get("/", async (req, res) => {

  // const {title} = req.query;

  // const db = req.app.locals.db;

//   const games = title 
//   ? await searchGame(title, db)
//   : await getGames(db);

  res.json([]);
});

// GET /api/scores/highscores
router.get("/highscores", async (req, res) => {
  
    const db = req.app.locals.db;

    const highscores = await getHighscores(db);
  
    if (!highscores) {
      res.status(404).send([]);
      return;
    }
  
    res.json(highscores);
  });

const getHighscores = async (db) => {

  const sql = `
    SELECT DISTINCT ON (game.title) 
                       game.title,
                       game.url_slug,
                       users.player,
               TO_CHAR (users.highscore, '999 999 999') AS highscore,
               TO_CHAR (users.highscore_date, 'YYYY-MM-DD') AS highscore_date
                  FROM game
             LEFT JOIN users
                    ON users.game_id = game.id
              ORDER BY game.title, users.highscore DESC;
  `

  const result = await db.query(sql)

  return result.rows;
}



module.exports = router;
