//function copied out to separate file to make it easier to manage
 
const Clarifai = require('clarifai');    

const handleApiCall = (req, res, postgresDB) => {

	const clariKey = "" 
	postgresDB('additional').select('data')
	  .where('key', '=', 'clarifai')
	  .returning('data')	
	   .then(data => { 
		clariKey = data[0].data.toString().trim(); 
		console.log("test1: ",clariKey);
		const app = new Clarifai.App({apiKey: clariKey});		 

		app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.inputVal) 
		.then(data2 => {
			res.json(data2);
		})
		.catch(err => res.status(400).json('unable to work with API'))
	   }) 
	   .catch (err => res.status(400).json('unable to get key'))    
}
						 
const handleImage = (req, res, postgresDB) => { 
		
		const { id} = req.body;  
	
		postgresDB('users')
		  .where('id', '=', id)
		  .increment('entries', 1)  //normally use .update, but knex has an .increment function which suits our purposes
		  .returning('entries')		  
		  .then(entries => {
			res.json(entries[0]);
		   }) 
		   .catch (err => res.status(400).json('unable to get entries'))   
		  			
	}

module.exports = {
	handleImage,
	handleApiCall
}
