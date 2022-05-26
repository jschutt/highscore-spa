var express = require("express");
var router = express.Router();

/*GET http://localhost:3000/games/urlSlug */
router.get("/:urlSlug", async function (req, res) {
  const urlSlug = req.params.urlSlug;

  const db = req.app.locals.db;

  const sql = `
      SELECT game.id,
             game.title,
             game.genre,
             game.description,
     TO_CHAR (game.release_date, 'YYYY') AS release_date,
             game.image_url,
             game.url_slug,
             scores.player,
     TO_CHAR (scores.highscore, '9 999 999 999') AS highscore,
     TO_CHAR (scores.highscore_date, 'DD-MM-YYYY') AS highscore_date
        FROM game
   LEFT JOIN scores
          ON game.id = scores.game_id
       WHERE game.url_slug = $1
    ORDER BY scores.highscore DESC
       LIMIT 10;
  `;

  const result = await db.query(sql, [urlSlug]);

  const { title, genre, description, release_date, image_url, url_slug } =
    result.rows[0];

  const game = {
    title: title,
    genre: genre,
    description: description,
    release_date: release_date,
    image_url: image_url,
    url_slug: url_slug,
  };

  const users = result.rows.map((user) => ({
    player: user.player,
    highscore: user.highscore,
    highscore_date: user.highscore_date,
  }));

  res.render("games/details", {
    title: game.title,
    game,
    users
  });
});

module.exports = router;
