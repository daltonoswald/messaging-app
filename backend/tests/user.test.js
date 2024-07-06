// const index = require('./index');
const users = require('../routes/users');

const request = require('supertest');
const express = require('express');
const initializeMongoServer = require('./mongoConfigTesting')
const app = express();

app.use(express.urlencoded({ extended: false }));
// app.use("/", index);
app.use('/users', users);

// initializeMongoServer();

beforeAll(() => {
    return initializeMongoServer();
})

test("index route works", done => {
    request(app)
      .get("/users")
      .expect("Content-Type", /json/)
      .expect({ name: "frodo" })
      .expect(200, done);
  });

// test('testing route works', done => {
//     request(app)
//         .post('/test')
//         .type("form")
//         .send({ item: "hey" })
//         .then(() => {
//             request(app)
//             .get("/test")
//             .expect({ array: ["hey"] }, done);
//         })
// })