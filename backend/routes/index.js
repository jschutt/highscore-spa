var express = require("express");
var router = express.Router();

/* GET http://localhost:3000/ */
router.get("/", async function (req, res) {
  const db = req.app.locals.db;

  const sql = `
      SELECT DISTINCT ON (game.title) 
                         game.title,
                         game.url_slug,
                         users.player,
                 TO_CHAR (users.highscore, '9 999 999 999') AS highscore,
                 TO_CHAR (users.highscore_date, 'YYYY-MM-DD') AS highscore_date
                    FROM game
               LEFT JOIN users
                      ON users.game_id = game.id
                ORDER BY game.title, users.highscore DESC;
`;

  const result = await db.query(sql);

  res.render("index", {
    title: "Highscore",
    users: result.rows,
  });
});



module.exports = router;
