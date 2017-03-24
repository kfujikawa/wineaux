SETUP NOTES FOR STARTING A NEW NODE PROJECT USING EXPRESS AND MONGOOSE
=======================================================================

EXPRESS
1.  Open Terminal 
	a.  mkdir <name>, cd into directory
	b.  Create package.json file
		i.  npm init
		ii. name (no caps), version (default), description (<description of app>), entry point (file where app starts ie app.js or server.js), test command (default), git repository (default), keywords (default), author (self), license (default)
		iii.  npm install express body-parser mongoose --save
	c.  Create .gitignore and include "node_modules" so this isn't saved to git.  This is a space issue when the file grows.  
	d.  npm start (if you want to change the "scripts" line in package.json file to "start": "nodemon server.js" you can).  You can name your script anything and then run it.  
	*NOTE that this will cause a problem with Heroku later.  

FILES
1.  Create folders and basic files necessary for project.  
	a.  "public" or "client" folder to store "css", "js" and "views" folders
		i.  css - style.css
		ii. js - client.js
		iii. views - index.html
	b. "test" folder to store test-<js file you want to test> ex. "test-server.js"
	c. api folder and sub folders 
		i.  Example for component setup for books:  mkdir book, cd book, touch book.controller.js, touch book.router.js, touch book.model.js, touch book.test.js
2.  TRAVIS - SETUP 
	* Travis allows for continuous integration testing.  It is used to test the API and what it does when it hits the routes.  
	a.  Create ".travis.yml" file in the root of the project folder assuming Travis will be used
	b.  The following should be added to the file language: node_js <br> node_js: node
	c.  Log on Travis https://travis-ci.org/ (GitHub credentials used as authentication)
	d.  Log on to GitHub and enable repository access (settings/integrations and services)

3.  HEROKU - SETUP
	* Heroku is a Cloud PAAS (Platform As A Service).  It has virtual machines called dynos that allows you to run your application in the cloud.  
	a.  Add to .travis.yml file if using Heroku - See config instructions below. 
	b.  From command line "travis setup heroku" (use defaults)
	c.  From command line enter "heroku create" - app: <name>
	d.  From command line "heroku ps:scale web=1"

3.  Create "config.js"
	* The config file is to centralize environment variables
*4.  Create "controller.js"
	* The controller is (why are we abstracting this out and what's the purpose of the controller)
	a.  Make sure you require correct files.  
*5.  Create "router.js"
	* The router is unrelated to the client and routes CRUD requests? 
6.  Create "sever.js"
7.  Create app.js - 

MONGO
	* Mongo is a non-relational document based database.  It has "collections" and "documents."  This can be run locally or in a tool like mLab (Database As A Service - Cloud based Mongo provider)
	1.  From command line "mongod" - This starts the mongo daemon
	2.  From a new tab in command line "mongo" - Gives access to the shell so you can interact with dbs
	3.  Import
		a.  --db<db name> --collection<name> --drop --file </location/filename>
	4.  Commands include "show dbs" - See all available; have to have at least one document in collection to show up.  ""

MONGOOSE
	* MongoDB object modeling tool.
	1.  Create "schema.js"
	* The Schema file is specific to Mongoose in this case.  
		a.  Will need to export the model using module.exports = {Modelname}
	*2.  Set up mongoose connection to database (server.js)

MLAB
* Database As A Service - Cloud based Mongo provider
	1.  Provision a new DB
		a.  Create New
		b.  Choose Free Option (single node)
		c.  Name DB
		d.  Click create new MongoDB deployment button
	2.  Import existing data if any.  Go to "Tools" tab and use the provided terminal command.  