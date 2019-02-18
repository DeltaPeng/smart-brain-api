//function copied out to separate file to make it easier to manage

const handleSignin = (req, res, postgresDB, bcrypt) => {

		//run some validation, don't allow any field to be blank OR empty spaces
		if (!req.body.password.trim() || !req.body.email.trim()){
			//need a return here, to exit the function early so a fail on validation does not allow code to proceed
			return res.status(400).json('incorrect form submission');			
		}
		
		postgresDB('login').select('email','hash')
		.where('email','=',req.body.email)
		.then(data => { 
			const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
			
			if (isValid) { 
				return postgresDB.select('*').from('users')
				.where('email','=',req.body.email)
				.then( user => { 
					res.json(user[0]);  
				})
				.catch (err => res.status(400).json('failure you email/credentials are.')) 
				
			} else {
				res.status(400).json('failure you email/credentials are');
			} 	
		})
		.catch (err => res.status(400).json('failure, you email/credentials are'))   
	}

module.exports = {
	handleSignin: handleSignin
}