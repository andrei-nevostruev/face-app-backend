const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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
app.post('/signin', (req, res) => {
	 db.select('email', 'hash').from('login')
	 	.where('email', '=', req.body.email)
	 	.then(data => {
	 		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
	 		if (isValid) {
	 			return db.select('*').from('users')
	 				.where('email', '=', req.body.email)
	 				.then(user => {
	 					res.json(user[0]);
	 				})
	 				.catch(err => res.status(400).json('unable to get user'))
	 		} else {
	 			res.status(400).json('wrong credentions')
	 		}
	 	})
	.catch(err => res.status(400).json('wrong credentions'))
})

app.post('/register', (req, res) => {
	const { email, name, password} = req.body;
	const hash = bcrypt.hashSync(password);
	// retuning - return columns for next .then
	// use .then(console.log) for check result
	// transaction - for multiple operations that depend on each other's result
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx.insert({
					email: loginEmail[0].email,
					name: name,
					joined: new Date()
				})
				.into('users')
				.returning('*')
				.then(user => {
					res.json(user[0]);			
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})

		.catch(err => res.status(400).json('unable to register'))
	})

// :id - grab parameter from get request
// localhost:3000/profile/123
// id = 123
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({
		id: id
		})
		.then(user => {
			if (user.length) {
				res.json(user[0])
			} else {
				res.status(400).json('not found')
			}
		})
		.catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0].entries);
		})
		.catch(err => res.status(400).json('unable to get entires'))
})


app.listen(3000, () => {
	console.log('app is running on port 3000');
})