Todo UI (angularjs)
===================
This repo is part of the Azure Active Directory (AAD) authentication model and provides a UI project built with angular js (1.6.10) to use the [adal.js](https://github.com/AzureAD/azure-activedirectory-library-for-js) library with the v1 AAD endpoint.

This repo has multiple branches, each of which represent different chapters as authentication and authorization are implemented.  Each step builds upon the previous step.  The README file is different for each step and describes the changes with respect to the previous step.  To proceed through all the steps you will need an Azure subscription.  All samples use the default Azure AD features (i.e. free tier).

This repo is a UI project only and is intended to be used in conjunction with the API projects in another repo:  [BgRva/aad_adal_api_dn_std](https://github.com/BgRva/aad_adal_api_dn_std)

# Step B
Baseline integration with Azure AD, simple authentication with adal.js, no authorization.  This branch builds on the **Step A** branch (see changes from Step_A).

The next chapter is **Step_C**

## Dependendies
This project requires npm to install dependencies.  Additionally, it uses gulp **locally** to build and run the code. 

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
    
    
# Changes from Step_A

To continue with this step, you should have registered 2 apis in AAD (each as a separate application).  From each record the following:  
 - login url
 - App ID URI

1) Register this ui application with AAD
2) Record the following
    - application id
    - tenant
3) Update the values in the dev.env.js file to include the base urls of the endpoints, the tenant, client id (i.e. application id), and the endpoints collection used by adal.js (note that these are used by adal only)

4) Add adal-angular to app.module.js

5) Update app.config.js to register the adal interceptor

5) Add routing guard flags to todos.routes.js and events.routes.js

7) Add userInfo.isAuthenticated checks to the links in index.html
