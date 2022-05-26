var express = require("express");
var router = express.Router();

/* GET http://localhost:3000/admin/score */
router.get("/", async function (req, res) {


  res.render("admin/score/index", {
    title: "Administration"
  });
});

/* GET http://localhost:3000/admin/score/new */
router.get("/new", async function (req, res) {

  const db = req.app.locals.db;

  const sql = `
      SELECT game.id, 
             game.title
        FROM game
  `;

  const result = await db.query(sql);

  const games = result.rows;

  res.render("admin/score/new", {
    title: "Administration",
    games
  });
});

/* POST http://localhost:3000/admin/score/new */
router.post("/new", async function (req, res) {

  const {player, highscore, highscoreDate, gameTitle } = req.body;

  const db = req.app.locals.db;

  const gameId = await findGameId(gameTitle, db);

  const score = {
    player,
    highscore: +highscore,
    highscoreDate,
    gameId: gameId.id
  };

  await addScore(score, db),

  res.redirect("/admin/games");
});

const findGameId = async (title, db) => {
  const sql = `
    SELECT game.id
      FROM game
     WHERE game.title = $1
  `;

  const result = await db.query(sql, [title])
  return result.rows[0];

}

const addScore = async (score, db) => {
  const sql = `
    INSERT INTO scores (
      player,
      highscore,
      highscore_date,
      game_id
    ) VALUES ($1, $2, $3, $4)
  `;

  await db.query(sql, [
      score.player,
      score.highscore,
      score.highscoreDate,
      score.gameId
  ]);
}
  

module.exports = router;
