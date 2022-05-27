var express = require("express");
var router = express.Router();
var authorize = require("../../middleware/authorize");

// GET /api/games[?title={title}]
/**
 *  @swagger
 *  /api/games:
 *    get:
 *      description: Get all games
 *      tags: [Game]
 *      parameters:
 *        - title: title
 *          in: query
 *          description: Game title
 *          required: false
 *      responses:
 *        200:
 *          description: Returns list of games
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Game'
 *        404:
 *          description: Couldn't fetch games
 */
router.get("/", async (req, res) => {
  const { title } = req.query;

  const db = req.app.locals.db;

  const games = title ? await searchGame(title, db) : await getGames(db);

  checkResult(games);

  res.json(games);
});

// GET /api/games/{id}
/**
 *  @swagger
 *  /api/games/{id}:
 *    get:
 *      description: Get game
 *      tags: [Game]
 *      parameters:
 *        - title: title
 *          in: path
 *          description: Game title
 *          required: true
 *      responses:
 *        200:
 *          description: Returns game
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Game'
 *        404:
 *          description: Game not found
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const db = req.app.locals.db;

  const game = await getGame(id, db);

  checkResult(game);

  res.json(game);
});

// POST /api/games/
router.post("/", authorize('Administrator'), async (req, res) => {
  const db = req.app.locals.db;

  const { title, genre, description, release_date, image_url } = req.body;

  if (!title || !genre || !description || !image_url || !release_date) {
    res.status(400).send();
    return;
  }

  const game = {
    title,
    genre,
    description,
    release_date,
    image_url,
    url_slug: generateURLSlug(title),
  };

  game.id = await saveGame(game, db);

  res.location(`/api/games/${game.url_slug}`);

  res.status(201).send(game);
});

// DELETE /api/games/{id}
router.delete("/:id", authorize('Administrator'), async (req, res) => {
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

// PUT /api/games/{id}
router.put("/:id", authorize('Administrator'), async (req, res) => {
  const db = req.app.locals.db;

  const { id } = req.params;

  const gameId = await findGameById(id, db);

  if (!gameId) {
    res.status(404).send();
    return;
  }

  const { title, genre, description, release_date, image_url } = req.body;

  const game = {
    title,
    genre,
    description,
    release_date,
    image_url,
    url_slug: await generateURLSlug(title),
  };

  await updateGame(game, id, db);

  res.status(204).send();
});

const findGameById = async (id, db) => {
  const sql = `
      SELECT game.id
      FROM game
      WHERE game.id = $1
  `;

  const result = await db.query(sql, [id]);
  return result.rows[0];
};

const updateGame = async (game, id, db) => {
  const sql = `
      UPDATE game
         SET title = $2,
             genre = $3,
             description = $4,
             release_date = $5,
             image_url = $6,
             url_slug = $7
       WHERE game.id = $1
  `;

  await db.query(sql, [
    id,
    game.title,
    game.genre,
    game.description,
    game.release_date,
    game.image_url,
    game.url_slug,
  ]);
};

const checkResult = (result) => {
  if (!result) {
    res.status(404).send([]);
    return;
  }
};

const generateURLSlug = (title) => {
  return title.replace("-", "").replace(" ", "-").toLowerCase();
};

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

const getGame = async (id, db) => {
  const sql = `
      SELECT game.id,
             game.title,
             game.genre,
             game.description,
     TO_CHAR (game.release_date, 'DD-MM-YYYY') AS release_date,
             game.image_url,
             game.url_slug
        FROM game
       WHERE game.id = $1
  `;

  const result = await db.query(sql, [id]);
  return result.rows;
};

const getGameScore = async (urlSlug, db) => {
  const sql = `
      SELECT game.title,
             game.url_slug,
             scores.player,
     TO_CHAR (scores.highscore, '999 999 999') AS highscore,
        CAST (highscore AS int),
     TO_CHAR (scores.highscore_date, 'YYYY-MM-DD') AS highscore_date
        FROM game
  INNER JOIN scores
          ON scores.game_id = game.id
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

  await db.query(sql, [gameId]);
};

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Game:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: Game id
 *          title:
 *            type: string
 *            description: Game title
 *          genre:
 *            type: string
 *            description: Game genre
 *          description:
 *            type: string
 *            description: Game description
 *          imageUrl:
 *            type: string
 *            description: Game image
 *          releaseDate:
 *            type: string
 *            description: Game release date
 *          urlSlug:
 *            type: string
 *            description: Game URL slug
 */

module.exports = router;
