Todo UI (angularjs)
===================
This project is part of the Azure AD authentication model and provides a separate UI project built with angular js to use adal.js and adal-angular.js with the v1 AAD endpoint.

## Version A
No Authentication

## Build & Run
This project requires npm. Additionally, it uses gulp **locally** to build and run the code. In order to run the gulp tasks you need to use the local gulp instance as follows:

Note:  All config properties are set in  src/client/app/dev.env.js

Update dev.env.js with API endpoints

  Common gulp tasks:
 - to lint
    
    ````node ./node_modules/gulp/bin/gulp.js vet````
 - to build and run the ui
 
    ````node ./node_modules/gulp/bin/gulp.js serve-dev````
 - to build the war file ('build' uses the dev.env.js file in the build)
    
    ````node ./node_modules/gulp/bin/gulp.js build --noMunge````
