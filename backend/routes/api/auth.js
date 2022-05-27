var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken');

// POST /api/auth
router.post("/", async (req, res) => {

    const db = req.app.locals.db;

    const {username, password} = req.body;

    const user = await findUser(username, password, db);

    if(!user) {
        res.status(401).send();
        return;
    }

    user.roles = await getRoles(user.id, db);

    const token = await generateToken(user);

    res.json({token})
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

const generateToken = async (user) => {

    const claims = {
        fname: user.first_name,
        lname: user.last_name,
        email: user.email,
        roles: user.roles.map(role => role.name)
    }

    const token = jwt.sign(claims, 'GREEN', {
        expiresIn: '1h'
    })

    return token;
}

module.exports = router;