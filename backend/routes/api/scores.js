var express = require("express");
var router = express.Router();
var authorize = require("../../middleware/authorize");

// POST /api/scores
/**
 *  @swagger
 *  /api/scores:
 *    post:
 *      summary: Add new score
 *      description: Add new score
 *      tags: [Score]
 *      consumes:
 *        - application/json
 *      requestBody:
 *        description: Score details
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/NewScore'
 *      produces:
 *        - application/json
 *      responses:
 *        201:
 *          description: Returns score
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Score'
 *        400:
 *          description: Invalid score
 *        401:
 *          description: Invalid token
 *        403:
 *          description: Not allowed
 */
router.post("/", authorize('Administrator'), async (req, res) => {
  const { title, player, highscore, highscoreDate } = req.body;

  const db = req.app.locals.db;

  const gameId = await findGameId(title, db);

  const score = {
    title,
    player,
    highscore: +highscore,
    highscoreDate,
    gameId: gameId,
  };

  if (!title || !highscore || !highscoreDate || !gameId) {
    res.status(400).send();
    return;
  }

  await addScore(score, db);

  res.status(201).send(score);
});

// GET /api/scores/highscores
/**
 *  @swagger
 *  /api/scores/highscores:
 *    get:
 *      summary: Get top highscores
 *      description: Get top highscores
 *      tags: [Score]
 *      responses:
 *        200:
 *          description: Returns highscores
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Score'
 *        404:
 *          description: Highscores not found
 */
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
                       scores.player,
               TO_CHAR (scores.highscore, '999 999 999') AS highscore,
                  CAST (highscore AS int),
               TO_CHAR (scores.highscore_date, 'YYYY-MM-DD') AS highscore_date
                  FROM game
             LEFT JOIN scores
                    ON scores.game_id = game.id
              ORDER BY game.title, scores.highscore DESC;
  `;

  const result = await db.query(sql);

  const scores = result.rows.map((score) => ({
    title: score.title,
    urlSlug: score.url_slug,
    player: score.player,
    highscore: score.highscore,
    highscoreDate: score.highscore_date
  }))

  return scores;
};

const findGameId = async (title, db) => {
  const sql = `
    SELECT game.id
      FROM game
     WHERE game.title = $1
  `;

  const result = await db.query(sql, [title]);
  return result.rows[0].id;
};

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
    score.gameId,
  ]);
};

/**
 * @swagger
 * components:
 *   schemas:
 *     NewScore:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Game title
 *         player:
 *           type: string
 *           description: Player
 *         highscore:
 *           type: integer
 *           description: Player highscore
 *         highscoreDate:
 *           type: string
 *           description: Highscore date
 *     Score:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Game id
 *         title:
 *           type: string
 *           description: Game title
 *         player:
 *           type: string
 *           description: Player
 *         highscore:
 *           type: integer
 *           description: Player highscore
 *         highscoreDate:
 *           type: string
 *           description: Highscore date
 */

module.exports = router;
