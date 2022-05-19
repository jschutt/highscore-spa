var express = require("express");
var router = express.Router();

/* GET http://localhost:3000/admin/games */
router.get("/", async function (req, res) {

    const db = req.app.locals.db;

    const sql = `
        SELECT game.id,
               game.title,
               game.genre,
               game.description,
       TO_CHAR (game.release_date, 'DD-MM-YYYY') AS release_date,
               game.image_url,
               game.url_slug
          FROM game
    `;

    const result = await db.query(sql);

    const games = result.rows;

    res.render("admin/games/index", {
      title: "Administration",
      games
    });
  });

/* GET http://localhost:3000/admin/games/new */
router.get("/new", function (req, res) {



  res.render("admin/games/new", {
    title: "Administration"
  });
});

/* POST http://localhost:3000/admin/games/new */
router.post("/new", async function (req, res) {

  const {title, description, imageUrl, genre, releaseDate } = req.body;

  const game = {
    title,
    description,
    imageUrl,
    genre: capitalizeFirstLetter(genre),
    releaseDate,
    urlSlug: generateURLSlug(title)
  };

  const db = req.app.locals.db;

  await addGame(game, db);

  res.redirect("/admin/games");
});

const generateURLSlug = (title) => {
  return title.replace("-", "").replace(" ", "-").toLowerCase();
}

const addGame = async (game, db) => {
  const sql = `
    INSERT INTO game (
      title,
      description,
      image_url,
      genre,
      release_date,
      url_slug
    ) VALUES ($1, $2, $3, $4, $5, $6)
  `;

  await db.query(sql, [
      game.title,
      game.description,
      game.imageUrl,
      game.genre,
      game.releaseDate,
      game.urlSlug
  ]);

}

const capitalizeFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = router;
