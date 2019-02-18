//function copied out to separate file to make it easier to manage

const handleProfileGet = (req, res, postgresDB) => { 
		
		const { userID} = req.params; 
		
		postgresDB.select('*').from('users').where('id',userID)
		.then(user => {
			if (user.length) {
				//get the first item (of which there should only be one), not the array of users
				res.json(user[0]);
			} else {
				res.status(400).json('not found')
			}
		}) 
		.catch (err => res.status(400).json('error getting user'))   
		
	}

module.exports = {
	handleProfileGet 
}