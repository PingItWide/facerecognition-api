const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
			db.transaction(trx => {
				trx.insert({
					hash: hash,
					email: email
				})
				.into('login')
				.returning('email')
				.then(loginEmail => {
					return trx('users')
						.returning('*')
						.insert({
							email: loginEmail[0].email,
							name: name,
							joined: new Date()
							})
						.then(user => {
							console.log('user registered:', user[0]);
							res.json(user[0]);
							})
					})	
					.then(trx.commit)
					.catch(trx.rollback)
				})
		.catch(err => {
			console.log('error registering user', err);
			res.status(400).json('unable to register')});
}

export default handleRegister;