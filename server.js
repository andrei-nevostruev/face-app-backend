const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

// For parsing request data
app.use(express.json());
// Cors need for security features. Without this frond-end have trouble with connection to our server
app.use(cors())

const database = {
	users: [
		{	
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date(),
		},
		{	
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date(),
		} 
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})

// Body in POST
// {
//     "email": "john@gmail.com",
//     "password": "cookies"
// }
app.post('/signin', (req, res) => {
	// Load hash from your password DB.
	bcrypt.compare("apples", '$2a$10$vY2mpq1oyza0AcIOS.bQiO0o4i2yjw7xcd/VsPBFD582qcuCrN/3e', function(err, res) {
    	console.log('first guest', res);
	});
	bcrypt.compare("veggies", '$2a$10$vY2mpq1oyza0AcIOS.bQiO0o4i2yjw7xcd/VsPBFD582qcuCrN/3e', function(err, res) {
		console.log('second guest', res);
	});
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password) {
		res.json('success');
	} else {
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	const { email, name, password} = req.body;
	bcrypt.hash(password, null, null, function(err, hash) {
    	console.log(hash);
	});
	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date(),
	})
	res.json(database.users[database.users.length-1]);
})

// :id - grab parameter from get request
// localhost:3000/profile/123
// id = 123
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	})
	if (!found) {
		res.status(404).json('not found');
	}
})

app.post('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if (!found) {
		res.status(404).json('not found');
	}
})



app.listen(3000, () => {
	console.log('app is running on port 3000');
})