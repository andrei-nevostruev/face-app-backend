const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Connect to DB
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'test-user',
    password : '123',
    database : 'smart-brain'
  }
});

const app = express();

// For parsing request data
app.use(express.json());
// Cors need for security features. Without this frond-end have trouble with connection to our server
app.use(cors())

app.get('/', (req, res) => {
	res.send('success');
})

// Body in POST
// {
//     "email": "john@gmail.com",
//     "password": "cookies"
// }
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
// the same call of function, but (req, res) will send automatically
app.post('/register', register.handleRegister(db, bcrypt) ) 
// :id - grab parameter from get request
// localhost:3000/profile/123
// id = 123
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.listen(3000, () => {
	console.log('app is running on port 3000');
})