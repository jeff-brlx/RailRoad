# Node_project
Projet de Node.js 

/* description  */
This project is an API for the RailRoad company . This allow users to get informations on trains or trainstations , and Book tickets . 
Those are validated by employees or admin , who can also manage Create , updates , or delete trains , trainstations or user .

/* Prerequisites */ 
- Node.js: Version 14 or higher
- MongoDB: NoSQL database to store information
- NPM: Package manager to install dependencies

/* installation */
-Install dependencies : npm install

/* Start the Application */
- Configure environment variables by creating a .env file in the root directory with the following information:
         PORT=5151
         DB_HOST=mongodb://localhost:27017
- Configure the dbconfig file : remplace the line " mongoose.connect("mongodb://localhost:27017") to  mongoose.connect("mongodb://localhost:27017"+"RailRoad"); to set a name for your Compass Database
- now you can run the "index.js" file , and test the API project on postman (https://app.getpostman.com/join-team?invite_code=3835929d64422749c5612d9dd7b68b6b&target_code=abd878d3ba2dd90af3b31f27b5b42e58 )
or swagger following the link showed in your terminal ( http://localhost:5151/api-docs ) . 



