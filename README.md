Todo UI (angularjs)
===================
This project is an example angularjs ui which will be expanded upon to integrate with Azure
Active Directory (AAD) for authentication and authorization.  This project will use the adal.js
library v 1.0.17 provided by Microsoft.

The APIs are in a separate project

## Step A
No Authentication

## Dependendies
This project requires npm to install dependencies.  Additionally, it uses gulp **locally** to build and run the code. 

## Project Config
All config properties are set in the file  

    ./src/client/app/dev.env.js

These properties are loaded in as global constants when the application is bootstrapped in the client (see the file ./src/client/app/app.const.js)

## Running
In order to run the gulp tasks you need to use the local gulp instance as follows:

Update dev.env.js with API endpoints

  Common gulp tasks:
 - to lint
    
    ````node ./node_modules/gulp/bin/gulp.js vet````
 - to build and run the ui
 
    ````node ./node_modules/gulp/bin/gulp.js serve-dev````
 - to build the war file ('build' uses the dev.env.js file in the build)
    
    ````node ./node_modules/gulp/bin/gulp.js build --noMunge````
