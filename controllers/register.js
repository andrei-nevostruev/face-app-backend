const handleRegister = (db, bcrypt) => (req,res) => {
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
	}

module.exports = {
	handleRegister: handleRegister
};

