const request = require("supertest");
const app = require("../../app.js");

describe('/api/auth', () => {

    describe('when sending valid credentials', () => {

        const credentials = {
            username: 'tony@stark.com',
            password: 'Secret#123'
        }

        test('should respond with a 200 status code', async () => {

            const response = await request(app)
                .post('/api/auth')
                .send(credentials);

                expect(response.statusCode)
                    .toBe(200)

        })

        test('should set content type to application/json', async () => {

            const response = await request(app)
                .post('/api/auth')
                .send(credentials)

            expect(response.header['content-type'])
                .toEqual(expect.stringContaining('application/json'))

        })

        test('should return token', async () => {

            const response = await request(app)
                .post('/api/auth')
                .send(credentials)

            expect(response.body)
                .toHaveProperty('token');

        })
    })

    describe('when sending invalid credentials', () => {

        const credentials = {
            username: 'bruce@wayne.com',
            password: "secret"
        }

        test('should return sttaus code 401 Unauthorized', async () => {

            const response = await request(app)
                .post('/api/auth')
                .send(credentials)

                expect(response.statusCode)
                    .toBe(401)

        })
    })
})