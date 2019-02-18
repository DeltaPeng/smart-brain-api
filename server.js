/*
SmartBrainAPI
19/02/15 DeltaPeng - create backend API /server for smartbrain app
*/ 

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
 
const bcrypt = require('bcrypt');
const saltRounds = 10; 

const cors = require('cors') 
  
 const knex = require('knex');
 
 //run a function to initialize everything
 //127.0.0.1 is localhost
 const postgresDB = knex({
   client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true,
  }
});

postgresDB.select('*').from('users').then(data => {
	console.log(data);
})
   
//needed to setup the middleware, for POST's 
app.use(bodyParser.urlencoded({extended:false}));  //add to setup middleware to parse urlencoded, aka postman's form data 
app.use(bodyParser.json());  //add to setup middleware to parse json, else it'll send empty object

app.use(cors());

  //can create code for each path you want.   
   //where req=request and res= response
   
	app.get('/', (req, res) => { 
		res.send('it is working!');  
	})
	
	//moved the logic out to it's own file.  File needed access to postgresDB and bcrypt, so passing those in as well
	const signin = require('./controllers/signin');
	app.post('/signin', (req,res) => signin.handleSignin(req, res, postgresDB, bcrypt ))
	
	//moved the logic out to it's own file.  File needed access to postgresDB and bcrypt, so passing those in as well
	// this is known as dependency injection
	const register = require('./controllers/register');
	app.post('/register', (req, res) => register.handleRegister(req, res, postgresDB, bcrypt, saltRounds) )
	
	//:userID allows user to enter text in browser which we can then use, can be called whatever you name it
	const profile = require('./controllers/profile');
	app.get('/profile/:userID', (req, res) => profile.handleProfileGet(req, res, postgresDB))

	//everytime a user submits an image for face tracking on the front end, we want user to take this route so we can increment number by 1
	//in this case, we're taking it from the body, the name has to match what the db says (i.e. id)
	const image = require('./controllers/image');
	app.put('/image', (req, res) => image.handleImage(req, res, postgresDB))
	
	app.post('/imageurl', (req, res) => image.handleApiCall(req, res, postgresDB))
 
 //run the port we get from heroku, else run 3000
app.listen(process.env.PORT || 3000, ()=> { console.log(`a function to run right after app.listen, app is running on port ${process.env.PORT}`)});
 
