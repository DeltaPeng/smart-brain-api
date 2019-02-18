//function copied out to separate file to make it easier to manage

const handleRegister = (req, res, postgresDB, bcrypt, saltRounds) => { 
		
		//add a new user based on data coming in from website
		const {email, name, password} = req.body;  //get three things from the body
		 
		//run some validation, don't allow any field to be blank OR empty spaces
		if (!email.trim() || !name.trim() || !password.trim()){
			//need a return here, to exit the function early so a fail on validation does not allow code to proceed
			return res.status(400).json('incorrect form submission');			
		}
		
		//sync method, other js does not execute while this is occurring
		const theHash = bcrypt.hashSync(password, saltRounds);
		
		//create a transaction, since we are updating 2 tables, if one of the actions fail, we want both to fail
		// so we don't have inconsistency in data where one table is missing needed data
		postgresDB.transaction( trx => {
			//now, can use trx for the transaction in place of postgresDB
			trx('login')
			.insert(
			{  
				email: email,
				hash: theHash		
			})
			.returning('email')
			.then( responseLoginEmail => {  
				return trx('users')
				.returning('*') 
				.insert(
				{ 
					name: name,
					email: responseLoginEmail[0],
					joined: new Date()		
				})
				.then( response => { 
					res.json(response[0]);
				})  
			})  
			.then(trx.commit) //if successful, commit the transaction
			.catch (trx.rollback)  //if error occurred, rollback the transaction
		})			
		.catch (err => res.status(400).json('Unable to register.'))  //add to catch and display error if found. Can do err for error info, but this is security no-no. Don't want to give client any info of your system. So instead, return a generic msg
 	}

module.exports = {
	handleRegister: handleRegister
}