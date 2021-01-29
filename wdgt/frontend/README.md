# 3BACK

3BACK is the first AI-driven app-as-a-service feedback solution that let‘s brands directly connect customers & PM

## Branch info
This is the web app clients which don't install the mobile app.

## Technology stack
- [node 8+ LTS](https://nodejs.org/en/)
- [angular 6.0.2](https://angular.io/)

## Setup
1. Install [node](https://nodejs.org/en/) 8+
2. Install angular cli: 
- **npm**: `npm install -g @angular/cli`
- **yarn**: `yarn global add @angular/cli`
3. Install tslint cli: 
- **npm**: `npm install -g tslint`
- **yarn**: `yarn global add tslint`
4. Clone project
5. Install project dependencies:
- **npm**: `npm install`
- **yarn**: `yarn`
6. Run project:
- **localy**: `npm run start` or `npm run start-aot`
- **for external access**: `sudo iptables -I INPUT -p tcp -m tcp --dport 4200 -j ACCEPT` `ng serve --host 0.0.0.0`
- **for stage**: `npm run build-stage`
- **start production**: `npm run build`

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test --sourceMap=false` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
1. Install `sudo npm install -g protractor`, `sudo webdriver-manager update`
2. Run selenium webdriver `webdriver-manager start`. Run `ng e2e` in other console to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Running linter

Run `tslint -p . --fix` to execute linter [TSLint](https://palantir.github.io/tslint/).

