
## Description
* TODO

## Usage
1. [Clone this repo from github](https://github.com/Naartti/npm-package-boilerplate)
1. Inside the repo directory run `npm install && rm -r .git && git init`
1. Rename to your package name in package.json
1. Rename to your package name in webpack.config.js

## Development
- ```npm run dev```
- This opens [localhost:8080/your-module-name](localhost:8080/your-module-name) in Chrome automatically (Can be removed from webpack.config.js)
- Edit your code and enjoy hot reloading

### Test driven development
- ```npm run watch```
- Edit your code and follow tests in your terminal

### Run tests
- ```npm run test```

## Build package
- ```npm run prod``` Run tests, lint and builds the module
- ```npm version patch``` (or ```minor```/```major``` etc.)
- ```npm publish```
