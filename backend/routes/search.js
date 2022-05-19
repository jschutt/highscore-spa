var express = require("express");
var router = express.Router();

/* GET http://localhost:3000/search */
router.get("/", async function (req, res) {
  const searchTerm = req.query.q;

  const db = req.app.locals.db;

  const sql = `
    SELECT id,
           title,
           genre,
   TO_CHAR (game.release_date, 'YYYY') AS release_date,
           image_url,
           url_slug
      FROM game
     WHERE title ILIKE '%' || $1 || '%'
  `;

  const result = await db.query(sql, [searchTerm]);

  res.render("search", {
    title: "Search results",
    games: result.rows,
    searchTerm
  });
});

module.exports = router;
