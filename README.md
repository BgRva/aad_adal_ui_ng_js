Todo UI (angularjs)
===================
This repo is part of the Azure Active Directory (AAD) authentication model and provides a UI project built with angular js (1.6.10) to use the [adal.js](https://github.com/AzureAD/azure-activedirectory-library-for-js) library with the v1 AAD endpoint.

This repo has multiple branches, each of which represent different chapters as authentication and authorization are implemented.  Each step builds upon the previous step.  The README file is different for each step and describes the changes with respect to the previous step.  To proceed through all the steps you will need an Azure subscription.  All samples use the default Azure AD features (i.e. free tier).

This repo is a UI project only and is intended to be used in conjunction with the API projects in another repo:  [BgRva/aad_adal_api_dn_std](https://github.com/BgRva/aad_adal_api_dn_std)

## Branches (i.e think Chapters)

 - Step_A:  Baseline UI project with no authentication
 - Step_B:  Simple authentication
   - the adal.js library is integrated to provide authentication only
   - the ui uses the API versions from Step_B of the API repo
   - you will need to create a application in AAD
 - Step_C:  Role based authorization
   - the adal.js library is integrated to provide authentication and role based authorization only
   - the ui uses the API versions from Step_C of the API repo
   - A simple role hierarchy is used and the roles must match the roles defined and registered with the corresponing APIs
   - you will need to create a application in AAD

## Configurations
Note:  All config properties are set in the file  _src/client/app/dev.env.js_ and this file is loaded and the properties are accessible as constants throughout the application.  Update dev.env.js with API endpoints and config settings from AAD

## Build & Run
This project requires npm to be installed (installing node.js LTS 8.11.1 will work just fine). Additionally, it uses gulp and bower but **only locally** to build and run the code (I made use of a custom build process but tried to limit any required installs). In order to run the gulp tasks you need to use the local gulp instance as follows:

  Common gulp tasks (run in the repo directory):
 - to lint
    ````node ./node_modules/gulp/bin/gulp.js vet````
    
 - to build and run the ui
    ````node ./node_modules/gulp/bin/gulp.js serve-dev````
    
 - to build the project (output is in the /build folder)
    ````node ./node_modules/gulp/bin/gulp.js build --noMunge````

 - to build the deployable WAR file (run build first, output is in /dist)
    ````node ./node_modules/gulp/bin/gulp.js war````
