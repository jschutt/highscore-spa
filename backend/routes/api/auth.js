var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken');

// POST /api/auth
router.post("/", async (req, res) => {

    const db = req.app.locals.db;

    const {username, password} = req.body;

    const user = await findUser(username, password, db);

    !user && res.status(401).send();

    user.roles = await getRoles(user.id, db);

    res.json([])
});

const findUser = async (username, password, db) => {

    const sql = `
        SELECT id,
               username,
               email,
               first_name,
               last_name
          FROM "user"
         WHERE username = $1
           AND password = $2
    `;

    const result = await db.query(sql, [username, password])

    let user = result.rows.length ? result.rows[0] : undefined;

    return user;
}

const getRoles = async (id, db) => {

    const sql = `
        SELECT id,
               name
          FROM role
    INNER JOIN user_role
            ON user_role.role_id = role.id
         WHERE user_role.user_id = $1
    `;

    const result = await db.query(sql, [id]);

    return result.rows;

};

module.exports = router;