var express = require("express");
var router = express.Router();
var authorize = require("../../middleware/authorize");

// GET /api/games[?title={title}]
/**
 *  @swagger
 *  /api/games:
 *    get:
 *      summary: Get all games
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

// GET /api/games/{urlSlug}
/**
 *  @swagger
 *  /api/games/{urlSlug}:
 *    get:
 *      summary: Get game
 *      description: Get game
 *      tags: [Game]
 *      parameters:
 *        - name: urlSlug
 *          in: path
 *          description: Game URL slug
 *          required: true
 *      responses:
 *        200:
 *          description: Returns game
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Game'
 *        404:
 *          description: Game not found
 */
router.get("/:urlSlug", async (req, res) => {
  const { urlSlug } = req.params;

  const db = req.app.locals.db;

  const game = await getGame(urlSlug, db);

  if (game.length == 0) {
    res.status(404).send();
    return;
  }

  res.json(game);
});

// POST /api/games/ - AUTH
/**
 *  @swagger
 *  /api/games:
 *    post:
 *      summary: Create new game
 *      description: Create new game
 *      tags: [Game]
 *      consumes:
 *        - application/json
 *      requestBody:
 *        description: Game details
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/NewGame'
 *      produces:
 *        - application/json
 *      responses:
 *        201:
 *          description: Returns game
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Game'
 *        400:
 *          description: Invalid product
 *        401:
 *          description: Invalid token
 *        403:
 *          description: Not allowed
 */
router.post("/", async (req, res) => {
  const db = req.app.locals.db;

  const { title, genre, description, releaseDate, imageUrl } = req.body;

  if (!title || !genre || !description || !imageUrl || !releaseDate) {
    res.status(400).send();
    return;
  }

  const game = {
    title,
    genre,
    description,
    releaseDate,
    imageUrl,
    urlSlug: generateURLSlug(title),
  };

  game.id = await saveGame(game, db);

  res.location(`/api/games/${game.urlSlug}`);

  res.status(201).send(game);
});

// DELETE /api/games/{id} - AUTH
/**
 *  @swagger
 *  /api/games/{id}:
 *    delete:
 *      summary: Delete game
 *      description: Delete game
 *      tags: [Game]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Game id
 *          required: true
 *      responses:
 *        204:
 *          description: Game deleted
 *        401:
 *          description: Not logged in
 *        403:
 *          description: Not allowed
 */
router.delete("/:id", async (req, res) => {
  const db = req.app.locals.db;

  const gameId = req.params.id;

  await deleteGame(gameId, db);

  res.status(204).send();
});

// GET /api/games/{urlSlug}/highscores
/**
 *  @swagger
 *  /api/games/{urlSlug}/highscores:
 *    get:
 *      summary: Get all highscores for game
 *      description: Get all highscores for game
 *      tags: [Game]
 *      parameters:
 *        - name: urlSlug
 *          in: path
 *          description: Game URL slug
 *          required: true
 *      responses:
 *        200:
 *          description: Returns highscores
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Highscores'
 *        404:
 *          description: Highscores not found
 */
router.get("/:urlSlug/highscores", async (req, res) => {
  const { urlSlug } = req.params;

  const db = req.app.locals.db;

  const scores = await getGameScore(urlSlug, db);

  checkResult(scores);

  res.json(scores);
});

// PUT /api/games/{id} - AUTH
/**
 *  @swagger
 *  /api/games/{id}:
 *    put:
 *      summary: Update game
 *      description: Update game
 *      tags: [Game]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Game id
 *          required: true
 *      consumes:
 *        - application/json
 *      requestBody:
 *        description: Game details
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/NewGame'
 *      produces:
 *        - application/json
 *      responses:
 *        204:
 *          description: Game updated
 *        404:
 *          description: Game not found
 */
router.put("/:id", async (req, res) => {
  const db = req.app.locals.db;

  const { id } = req.params;

  const gameId = await findGameById(id, db);

  if (!gameId) {
    res.status(404).send();
    return;
  }

  const { title, genre, description, releaseDate, imageUrl } = req.body;

  const game = {
    title,
    genre,
    description,
    releaseDate,
    imageUrl,
    urlSlug: await generateURLSlug(title),
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
    game.releaseDate,
    game.imageUrl,
    game.urlSlug,
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

  const games = result.rows.map((game) => ({
    id: game.id,
    title: game.title,
    genre: game.genre,
    description: game.description,
    releaseDate: game.release_date,
    imageUrl: game.image_url,
    urlSlug: game.url_slug

  }))
  return games;
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

  const games = result.rows.map((game) => ({
    id: game.id,
    title: game.title,
    genre: game.genre,
    description: game.description,
    releaseDate: game.release_date,
    imageUrl: game.image_url,
    urlSlug: game.url_slug

  }))
  return games;
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

  const game = result.rows.map((game) => ({
    id: game.id,
    title: game.title,
    genre: game.genre,
    description: game.description,
    releaseDate: game.release_date,
    imageUrl: game.image_url,
    urlSlug: game.url_slug
  }))

  return game;
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

  const scores = result.rows.map((score) => ({
    title: score.title,
    urlSlug: score.url_slug,
    player: score.player,
    highscore: score.highscore,
    highscoreDate: score.highscore_date,
  }))

  return scores;
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
    game.releaseDate,
    game.imageUrl,
    game.urlSlug,
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
 *      NewGame:
 *        type: object
 *        properties:
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
 *            description: Game image URL
 *          releaseDate:
 *            type: string
 *            description: Game release date
 *      Highscores:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *            description: Game title
 *          urlSlug:
 *            type: string
 *            description: Game URL slug
 *          player:
 *            type: string
 *            description: Player
 *          highscore:
 *            type: integer
 *            description: Player highscore
 *          highscoreDate:
 *            type: string
 *            description: Highscore date
 */

module.exports = router;
